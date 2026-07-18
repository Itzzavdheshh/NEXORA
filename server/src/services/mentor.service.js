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
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

const updateMentorProfile = async (userId, profile) => {
  // Update users table fields if provided
  const userUpdates = {};
  if (profile.fullName !== undefined) userUpdates.full_name = profile.fullName;
  if (profile.avatar_url !== undefined) userUpdates.avatar_url = profile.avatar_url;

  if (Object.keys(userUpdates).length) {
    const { error: userError } = await supabase
      .from("users")
      .update(userUpdates)
      .eq("id", userId);
    if (userError) throw new Error(userError.message);
  }

  // Upsert mentor_profiles (creates if missing, updates if exists)
  const { data, error } = await supabase
    .from("mentor_profiles")
    .upsert(
      {
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
      },
      { onConflict: "user_id" },
    )
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const getPendingMentors = async () => {
  const { data: users, error } = await supabase
    .from("users")
    .select("id, full_name, email, avatar_url, created_at, is_verified, status")
    .eq("role", "mentor")
    .eq("is_verified", false)
    .neq("status", "rejected");

  if (error) throw new Error(error.message);

  if (users && users.length > 0) {
    const userIds = users.map((u) => u.id);
    const { data: profiles, error: profileErr } = await supabase
      .from("mentor_profiles")
      .select("user_id, designation, company, bio, expertise, experience, linkedin_url, github_url, portfolio_url, hourly_rate")
      .in("user_id", userIds);

    if (!profileErr && profiles) {
      const profileMap = new Map(
        profiles.map((p) => [
          p.user_id,
          {
            ...p,
            job_title: p.designation,
            skills: p.expertise,
            experience_years: p.experience,
            website_url: p.portfolio_url,
          },
        ])
      );
      return users.map((u) => ({
        ...u,
        profile: profileMap.get(u.id) || null,
      }));
    }
  }

  return (users ?? []).map((u) => ({ ...u, profile: null }));
};


const verifyMentor = async (userId) => {
  // Fetch existing user to make sure they are a mentor and not rejected
  const { data: existingUser, error: fetchErr } = await supabase
    .from("users")
    .select("status, role")
    .eq("id", userId)
    .single();

  if (fetchErr || !existingUser) {
    throw new Error("Mentor user not found.");
  }
  if (existingUser.role !== "mentor") {
    throw new Error("Target user is not a mentor.");
  }
  if (existingUser.status === "rejected") {
    throw new Error("Cannot verify a rejected mentor application.");
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      mentor_verified: true,
      is_verified: true,
      status: "active", // Make sure status is set to active upon verification
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
      message: "Congratulations! Your mentor account has been verified.",
    });
  } catch (err) {
    console.error("Notification Error:", err.message);
  }

  try {
    await sendEmail({
      to: data.email,
      subject: "Mentor Verification",
      html: `
        <h2>Congratulations!</h2>
        <p>Your mentor account has been verified successfully.</p>
      `,
    });
  } catch (err) {
    console.error("Email Error:", err.message);
  }

  return data;
};

const rejectMentor = async (userId) => {
  // Fetch existing user to make sure they are a mentor and not already active/verified
  const { data: existingUser, error: fetchErr } = await supabase
    .from("users")
    .select("status, role, is_verified")
    .eq("id", userId)
    .single();

  if (fetchErr || !existingUser) {
    throw new Error("Mentor user not found.");
  }
  if (existingUser.role !== "mentor") {
    throw new Error("Target user is not a mentor.");
  }
  if (existingUser.is_verified) {
    throw new Error("Cannot reject an already verified mentor.");
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      mentor_verified: false,
      is_verified: false,
      status: "rejected",
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
      title: "Application Status",
      message: "We regret to inform you that your mentor application has been rejected.",
    });
  } catch (err) {
    console.error("Notification Error:", err.message);
  }

  try {
    await sendEmail({
      to: data.email,
      subject: "Mentor Application Update",
      html: `
        <h2>Application Update</h2>
        <p>Hello ${data.full_name},</p>
        <p>Your mentor application has been reviewed and was not accepted at this time.</p>
      `,
    });
  } catch (err) {
    console.error("Email Error:", err.message);
  }

  return data;
};

const getVerifiedMentors = async (search = "") => {
  const { data: users, error } = await supabase
    .from("users")
    .select("id, full_name, email, avatar_url, created_at, is_verified, status")
    .eq("role", "mentor")
    .eq("is_verified", true)
    .eq("status", "active");

  if (error) throw new Error(error.message);

  if (!users || users.length === 0) return [];

  const userIds = users.map((u) => u.id);
  const { data: profiles, error: profileErr } = await supabase
    .from("mentor_profiles")
    .select("user_id, designation, company, bio, expertise, experience, linkedin_url, github_url, portfolio_url, hourly_rate")
    .in("user_id", userIds);

  if (profileErr) throw new Error(profileErr.message);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [
      p.user_id,
      {
        ...p,
        job_title: p.designation,
        skills: p.expertise,
        experience_years: p.experience,
        website_url: p.portfolio_url,
      },
    ])
  );

  let mentors = users.map((u) => ({
    ...u,
    profile: profileMap.get(u.id) || null,
  }));

  if (search.trim()) {
    const s = search.toLowerCase().trim();
    mentors = mentors.filter((m) => {
      const nameMatch = m.full_name?.toLowerCase().includes(s);
      const titleMatch = m.profile?.job_title?.toLowerCase().includes(s);
      const companyMatch = m.profile?.company?.toLowerCase().includes(s);
      const bioMatch = m.profile?.bio?.toLowerCase().includes(s);
      const skillsMatch = Array.isArray(m.profile?.skills) && m.profile.skills.some((skill) => skill.toLowerCase().includes(s));
      return nameMatch || titleMatch || companyMatch || bioMatch || skillsMatch;
    });
  }

  return mentors;
};

module.exports = {
  createMentorProfile,
  getMentorProfile,
  updateMentorProfile,
  getPendingMentors,
  verifyMentor,
  rejectMentor,
  getVerifiedMentors,
};