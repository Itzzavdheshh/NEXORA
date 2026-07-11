const supabase = require("../config/supabase");
const { sendEmail } = require("../utils/email");
const { createNotification } = require("./notification.service");

const createMentorProfile = async (userId, profile) => {

  const { data: existing, error: existingError } = await supabase
    .from("mentor_profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existing && !existingError) {
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


const verifyMentor = async (userId) => {

  const { data, error } = await supabase
    .from("users")
    .update({
      mentor_verified: true,
      is_verified: true,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

try {
  await createNotification({
    user_id: userId,
    title: "Mentor Verified",
    message: "Congratulations! Your mentor account has been verified."
  });

  await sendEmail({
    to: data.email,
    subject: "Mentor Verification",
    html: `
      <h2>Congratulations!</h2>
      <p>Your mentor account has been verified successfully.</p>
    `,
  });
} catch (err) {
  console.error("Notification/Email Error:", err.message);
}

  return data;
};

module.exports = {
  createMentorProfile,
  getMentorProfile,
  verifyMentor,
};