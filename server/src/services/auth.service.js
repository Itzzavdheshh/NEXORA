const supabase = require("../config/supabase");

const registerUser = async ({ fullName, email, password, role }) => {
  // Create user in Supabase Authentication
  const { data: authData, error: authError } =
    await supabase.auth.signUp({
      email,
      password,
    });

  if (authError) {
    throw new Error(authError.message);
  }
  if (!authData.user) {
    throw new Error("User registration failed.");
  }

  // Insert user into public.users
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
  const { data, error } = await supabase.auth.signInWithPassword({
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

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
};
