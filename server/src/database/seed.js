require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const logger = require("../utils/logger");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  console.error("Missing Supabase URL or Secret Key. Cannot run seed script.");
  process.exit(1);
}

// Initialize Supabase Client with service_role bypass key
const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const SEED_PASSWORD = "Password123!";

async function runSeed() {
  logger.info("Starting Nexora Idempotent database seeder...");

  try {
    // 1. Fetch existing users to avoid recreating auth accounts
    const { data: authData, error: authErr } = await supabase.auth.admin.listUsers();
    if (authErr) throw authErr;

    const existingAuthUsers = authData.users || [];
    const authMap = new Map(existingAuthUsers.map((u) => [u.email, u.id]));

    // ── Create Admin ──────────────────────────────────────────────────────────
    const adminEmail = "admin@nexora.com";
    let adminAuthId = authMap.get(adminEmail);
    if (!adminAuthId) {
      const { data: newAdmin, error } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: SEED_PASSWORD,
        email_confirm: true,
      });
      if (error) throw error;
      adminAuthId = newAdmin.user.id;
      logger.info(`Auth Admin created: ${adminEmail}`);
    }
    const { data: adminUser } = await supabase
      .from("users")
      .upsert({
        auth_id: adminAuthId,
        email: adminEmail,
        full_name: "Nexora Administrator",
        role: "admin",
        status: "active",
        is_verified: true,
      }, { onConflict: "email" })
      .select()
      .single();

    // ── Create Mentors (5) ────────────────────────────────────────────────────
    const mentors = [];
    for (let i = 1; i <= 5; i++) {
      const email = `mentor${i}@nexora.com`;
      let authId = authMap.get(email);
      if (!authId) {
        const { data: newUser, error } = await supabase.auth.admin.createUser({
          email,
          password: SEED_PASSWORD,
          email_confirm: true,
        });
        if (error) throw error;
        authId = newUser.user.id;
        logger.info(`Auth Mentor created: ${email}`);
      }
      const { data: user } = await supabase
        .from("users")
        .upsert({
          auth_id: authId,
          email,
          full_name: `Mentor Professor ${i}`,
          role: "mentor",
          status: "active",
          is_verified: i <= 3, // first 3 are verified, last 2 are pending
        }, { onConflict: "email" })
        .select()
        .single();

      mentors.push(user);

      // Create mentor profile
      await supabase
        .from("mentor_profiles")
        .upsert({
          user_id: user.id,
          designation: i % 2 === 0 ? "Staff Software Engineer" : "Associate Professor",
          company: i % 2 === 0 ? "Google Cloud" : "MIT Engineering",
          bio: `Experienced industry mentor specializing in full-stack architecture, system designs, and computer science curriculums.`,
          expertise: ["React", "Node.js", "System Design", "Cloud Computing", "AI/ML"],
          experience: 5 + i,
          linkedin_url: `https://linkedin.com/in/mentor-${i}`,
          portfolio_url: `https://mentor-${i}.dev`,
          hourly_rate: 25 * (i || 1),
        }, { onConflict: "user_id" });
    }

    // ── Create Students (20) ──────────────────────────────────────────────────
    const students = [];
    for (let i = 1; i <= 20; i++) {
      const email = `student${i}@nexora.com`;
      let authId = authMap.get(email);
      if (!authId) {
        const { data: newUser, error } = await supabase.auth.admin.createUser({
          email,
          password: SEED_PASSWORD,
          email_confirm: true,
        });
        if (error) throw error;
        authId = newUser.user.id;
        logger.info(`Auth Student created: ${email}`);
      }
      const { data: user } = await supabase
        .from("users")
        .upsert({
          auth_id: authId,
          email,
          full_name: `Student Learner ${i}`,
          role: "student",
          status: "active",
          is_verified: false,
        }, { onConflict: "email" })
        .select()
        .single();

      students.push(user);

      // Create student profile
      await supabase
        .from("student_profiles")
        .upsert({
          user_id: user.id,
          college: "Stanford University",
          degree: "Bachelor of Technology",
          branch: "Computer Science",
          graduation_year: 2026 + (i % 3),
          bio: `B.Tech final year student passionate about building highly scalable software products and cloud systems.`,
          skills: ["Javascript", "HTML/CSS", "Python", "Data Structures"],
          linkedin_url: `https://linkedin.com/in/student-${i}`,
          github_url: `https://github.com/student-${i}`,
        }, { onConflict: "user_id" });
    }

    // ── Create Availability slots for verified mentors ─────────────────────────
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    for (const mentor of mentors) {
      if (mentor.is_verified) {
        for (let i = 0; i < 3; i++) {
          const day = weekdays[i];
          await supabase
            .from("availability_slots")
            .upsert({
              mentor_id: mentor.id,
              day_of_week: day,
              start_time: "10:00:00",
              end_time: "11:00:00",
              is_available: true,
            }, { onConflict: "mentor_id, day_of_week, start_time" });
        }
      }
    }

    // ── Create Bookings ───────────────────────────────────────────────────────
    logger.info("Seeding mentorship session bookings...");
    // Book student1 to student5 with mentor1 to mentor3
    for (let i = 0; i < 5; i++) {
      const student = students[i];
      const mentor = mentors[i % 3];
      await supabase
        .from("bookings")
        .insert({
          student_id: student.id,
          mentor_id: mentor.id,
          booking_date: new Date(Date.now() + (i + 1) * 86400000).toISOString().split("T")[0],
          start_time: "10:00:00",
          end_time: "11:00:00",
          status: i === 0 ? "pending" : "confirmed",
          meeting_type: "Virtual Google Meet",
          notes: "Need guidance on portfolio projects and software engineering roadmap.",
        });
    }

    // ── Create Notifications ──────────────────────────────────────────────────
    logger.info("Seeding system notification logs...");
    for (let i = 0; i < 3; i++) {
      await supabase
        .from("notifications")
        .insert({
          user_id: mentors[0].id,
          title: "New Booking Request",
          message: `Student Learner ${i + 1} has requested a session.`,
          is_read: false,
        });

      await supabase
        .from("notifications")
        .insert({
          user_id: students[0].id,
          title: "Booking Confirmed",
          message: `Your booking request has been confirmed by Mentor Professor 1.`,
          is_read: false,
        });
    }

    logger.info("✅ Database successfully seeded!");
    process.exit(0);
  } catch (error) {
    logger.error("❌ Seeding failed with error", error);
    process.exit(1);
  }
}

runSeed();
