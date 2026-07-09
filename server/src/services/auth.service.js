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
      .single();

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
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
};

const logoutUser = async (accessToken) => {
    const { error } = await supabase.auth.signOut(accessToken);

    if (error) {
      throw new Error(error.message);
    }

    return { message: "logged out successfully." };

};
  
module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
};