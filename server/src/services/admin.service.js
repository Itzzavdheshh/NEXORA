const supabase = require("../config/supabase");

const fetchStats = async () => {
  // 1. Fetch User Counts
  const { count: totalUsers, error: err1 } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true });

  const { count: studentCount, error: err2 } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .eq("role", "student");

  const { count: mentorCount, error: err3 } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .eq("role", "mentor");

  const { count: verifiedMentorCount, error: err4 } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .eq("role", "mentor")
    .eq("is_verified", true);

  const { count: pendingMentorCount, error: err5 } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .eq("role", "mentor")
    .eq("is_verified", false)
    .neq("status", "rejected");

  if (err1 || err2 || err3 || err4 || err5) {
    throw new Error("Failed to retrieve user statistics.");
  }

  // 2. Fetch Booking Counts
  const { count: totalBookings, error: err6 } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true });

  const { count: completedBookings, error: err7 } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("status", "completed");

  const { count: pendingBookings, error: err8 } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: cancelledBookings, error: err9 } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("status", "cancelled");

  if (err6 || err7 || err8 || err9) {
    throw new Error("Failed to retrieve booking statistics.");
  }

  // 3. Recent activity logs (recent users + recent bookings)
  const { data: recentUsers, error: userLogErr } = await supabase
    .from("users")
    .select("id, full_name, email, role, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentBookings, error: bookingLogErr } = await supabase
    .from("bookings")
    .select("id, booking_date, created_at, status")
    .order("created_at", { ascending: false })
    .limit(5);

  const activity = [];
  if (!userLogErr && recentUsers) {
    recentUsers.forEach((u) => {
      activity.push({
        id: `user-${u.id}`,
        title: "New User Registered",
        description: `${u.full_name} (${u.role}) joined Nexora.`,
        timestamp: u.created_at,
        type: "user",
      });
    });
  }
  if (!bookingLogErr && recentBookings) {
    recentBookings.forEach((b) => {
      activity.push({
        id: `booking-${b.id}`,
        title: `Booking Created`,
        description: `Mentorship session booked on ${b.booking_date} (Status: ${b.status}).`,
        timestamp: b.created_at || b.booking_date,
        type: "booking",
      });
    });
  }
  activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // 4. System health status
  const memoryUsage = process.memoryUsage();
  const health = {
    status: "healthy",
    uptime: Math.round(process.uptime()),
    memory: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
    database: "connected",
  };

  return {
    users: {
      total: totalUsers || 0,
      students: studentCount || 0,
      mentors: mentorCount || 0,
      verifiedMentors: verifiedMentorCount || 0,
      pendingMentors: pendingMentorCount || 0,
    },
    bookings: {
      total: totalBookings || 0,
      completed: completedBookings || 0,
      pending: pendingBookings || 0,
      cancelled: cancelledBookings || 0,
    },
    recentActivity: activity.slice(0, 8),
    health,
  };
};

const fetchUsers = async ({ search = "", role = "all", status = "all", verified = "all", sort = "newest", page = 1, limit = 10 }) => {
  let query = supabase.from("users").select("*", { count: "exact" });

  // Filters
  if (role !== "all") {
    query = query.eq("role", role);
  }
  if (status !== "all") {
    query = query.eq("status", status);
  }
  if (verified !== "all") {
    const isVerified = verified === "true";
    query = query.eq("is_verified", isVerified);
  }

  if (search.trim()) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  // Sorting
  if (sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  // Pagination range
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  return {
    users: data ?? [],
    totalCount: count ?? 0,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };
};

const modifyUserStatus = async (userId, status) => {
  if (!["active", "inactive", "suspended", "rejected"].includes(status)) {
    throw new Error("Invalid user status requested.");
  }

  const { data, error } = await supabase
    .from("users")
    .update({ status })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

module.exports = {
  fetchStats,
  fetchUsers,
  modifyUserStatus,
};
