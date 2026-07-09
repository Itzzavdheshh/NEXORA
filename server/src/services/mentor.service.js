const supabase = require("../config/supabase");

const createMentorProfile = async (userId, profile) => {

  const { data: existing } = await supabase
    .from("mentor_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    throw new Error("Mentor profile already exists.");
  }

  const { data, error } = await supabase
    .from("mentor_profiles")
    .insert({
      user_id: userId,
      designation: profile.designation,
      company: profile.company,
      experience: profile.experience,
      expertise: profile.expertise,
      bio: profile.bio,
      linkedin_url: profile.linkedin_url,
      github_url: profile.github_url,
      portfolio_url: profile.portfolio_url,
      hourly_rate: profile.hourly_rate,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const getMentorProfile = async (userId) => {

  const { data, error } = await supabase
    .from("mentor_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

module.exports = {
  createMentorProfile,
  getMentorProfile,
};