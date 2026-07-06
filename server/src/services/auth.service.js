const supabase = require("../config/supabase");

const registerUser = async ({ fullName, email, password, role }) => {
  // Create user in Supabase Authentication
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) {
    throw new Error(authError.message);
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

module.exports = {
  registerUser,
};