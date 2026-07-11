const supabase = require("../config/supabase");
const handleSupabaseError = require("../utils/handleSupabaseError");
const createStudentProfile = async (userId, profile) => {

  const { data: existing, error: existingError } = await supabase
    .from("student_profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existing && !existingError) {
    throw new Error("Student profile already exists.");
  }

  const { data, error } = await supabase
    .from("student_profiles")
    .insert({
        user_id: userId,
        college: profile.college,
        degree: profile.degree,
        branch: profile.branch,
        graduation_year: profile.graduation_year,
        bio: profile.bio,
        linkedin_url: profile.linkedin_url,
        github_url: profile.github_url,
        portfolio_url: profile.portfolio_url,
        skills: profile.skills,
    })
    .select()
    .single();

  if (error) {
    handleSupabaseError(error);
  }

  return data;
};

const getStudentProfile = async (userId) => {
  const { data, error } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    handleSupabaseError(error);
  }

  return data;
};

const updateStudentProfile = async (userId, profile) => {
  const userUpdates = {};

  if (profile.fullName !== undefined) {
    userUpdates.full_name = profile.fullName;
  }

  if (profile.avatar_url !== undefined) {
    userUpdates.avatar_url = profile.avatar_url;
  }

  if (Object.keys(userUpdates).length) {
    const { error: userError } = await supabase
      .from("users")
      .update(userUpdates)
      .eq("id", userId);

    if (userError) {
      handleSupabaseError(userError);
    }
  }

  const { data, error } = await supabase
    .from("student_profiles")
    .update({
      college: profile.college,
      degree: profile.degree,
      branch: profile.branch,
      graduation_year: profile.graduation_year,
      bio: profile.bio,
      linkedin_url: profile.linkedin_url,
      github_url: profile.github_url,
      portfolio_url: profile.portfolio_url,
      skills: profile.skills,
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    handleSupabaseError(error);
  }

  return data;
};

module.exports = {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
};
