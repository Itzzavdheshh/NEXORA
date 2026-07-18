const { createClient } = require("@supabase/supabase-js");
const supabase = require("../config/supabase");

// Helper to create a transient, single-use client for authentication operations
// (like signInWithPassword) that mutate the client's internal auth state.
// This prevents the shared 'supabase' singleton client from having its session
// overridden by a logged-in user's JWT.
const createTransientClient = () => {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};

const registerUser = async ({ fullName, email, password, role }) => {
  // Use admin.createUser for server-side registration.
  // Unlike auth.signUp(), this does not mutate the client's internal auth
  // state, so subsequent table queries always run as the service role.
  // email_confirm: true auto-confirms the address (consistent with seed.js).
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role },
    });

  if (authError) {
    throw new Error(authError.message);
  }
  if (!authData.user) {
    throw new Error("User registration failed.");
  }

  // Insert user into public.users (runs as service role, bypasses RLS)
  const { data: userData, error: userError } =
    await supabase
      .from("users")
      .insert({
        auth_id: authData.user.id,
        full_name: fullName,
        email,
        role,
      })
      .select()
      .maybeSingle();

  if (userError) {
    throw new Error(userError.message);
  }

  return userData;
};

const loginUser = async ({ email, password }) => {
  const authClient = createTransientClient();
  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  let { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", data.user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  // Self-healing: if auth succeeds but public.users profile is missing, generate it dynamically
  if (!profile) {
    const fullName = data.user.user_metadata?.full_name || email.split("@")[0];
    const role = data.user.user_metadata?.role || "student";

    const { data: newProfile, error: createError } = await supabase
      .from("users")
      .insert({
        auth_id: data.user.id,
        full_name: fullName,
        email: email,
        role: role,
        status: "active",
      })
      .select()
      .maybeSingle();

    if (createError) {
      throw new Error(`Profile synchronization failed: ${createError.message}`);
    }
    profile = newProfile;
  }

  return {
    session: data.session,
    user: profile,
  };
};

const getCurrentUser = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const logoutUser = async (token) => {
  if (!token) {
    throw new Error("Authorization token is required.");
  }

  if (supabase.auth.admin?.signOut) {
    const { error } = await supabase.auth.admin.signOut(token);

    if (error) {
      throw new Error(error.message);
    }
  }

  return {
    message: "Logged out successfully.",
  };
};

const changePassword = async ({ userId, email, currentPassword, newPassword }) => {
  // 1. Verify current password by attempting to sign in using a transient client
  const authClient = createTransientClient();
  const { error: signInError } = await authClient.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (signInError) {
    throw new Error("Incorrect current password.");
  }

  // 2. Update user password in Supabase auth using admin api
  const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (updateError) {
    throw new Error(updateError.message);
  }

  return { message: "Password updated successfully." };
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  changePassword,
};
