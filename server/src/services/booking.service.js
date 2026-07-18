const supabase = require("../config/supabase");
const { createNotification, } = require("./notification.service");
const { sendEmail } = require("../utils/email");
const { BOOKING_STATUS } = require("../constants/status");

const createBooking = async (studentId, booking) => {

    if (studentId === booking.mentor_id) {
        throw new Error("You cannot book your own session.");
    }
  // Check availability slot
  const { data: slot, error: slotError } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("id", booking.availability_slot_id)
    .single();

  if (slotError || !slot) {
    throw new Error("Availability slot not found.");
  }

  if (!slot.is_available) {
    throw new Error("This slot is no longer available.");
  }

// Check if booking already exists
const { data: existingBooking } = await supabase
  .from("bookings")
  .select("id")
  .eq("availability_slot_id", booking.availability_slot_id)
  .maybeSingle();

if (existingBooking) {
  throw new Error("This availability slot has already been booked.");
}

// Create booking
const { data, error } = await supabase
  .from("bookings")
  .insert({
    student_id: studentId,
    mentor_id: booking.mentor_id,
    availability_slot_id: booking.availability_slot_id,
    booking_date: booking.booking_date,
    start_time: booking.start_time,
    end_time: booking.end_time,
    meeting_type: booking.meeting_type,
    notes: booking.notes,
    status: BOOKING_STATUS.PENDING,
  })
  .select()
  .single();

if (error) {
  throw new Error(error.message);
}

  if (existingBooking) {
    throw new Error("This availability slot has already been booked.");
  }

  const { data: student } = await supabase
  .from("users")
  .select("email, full_name")
  .eq("id", studentId)
  .single();

const { data: mentor } = await supabase
  .from("users")
  .select("email, full_name")
  .eq("id", booking.mentor_id)
  .single();

  // Mark slot unavailable
  await supabase
    .from("availability_slots")
    .update({
      is_available: false,
    })
    .eq("id", booking.availability_slot_id);


    // Notify student
await createNotification({
  user_id: studentId,
  title: "Booking Created",
  message: "Your booking request has been submitted successfully.",
});

// Notify mentor
await createNotification({
  user_id: booking.mentor_id,
  title: "New Booking",
  message: "A student has booked one of your available slots.",
});

try {
  await sendEmail({
    to: student.email,
    subject: "Booking Created - Nexora",
    html: `
      <h2>Hello ${student.full_name},</h2>
      <p>Your mentorship booking has been created successfully.</p>
      <p>Status: <b>Pending</b></p>
    `,
  });

  await sendEmail({
    to: mentor.email,
    subject: "New Booking - Nexora",
    html: `
      <h2>Hello ${mentor.full_name},</h2>
      <p>You have received a new mentorship booking.</p>
    `,
  });

} catch (err) {
  console.error("Email Error:", err.message);
}

  return data;
};

const getBookings = async (userId) => {

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .or(`student_id.eq.${userId},mentor_id.eq.${userId}`);

  if (error) {
    throw new Error(error.message);
  }

  if (!bookings || bookings.length === 0) return [];

  // Extract all unique user IDs for students and mentors associated with these bookings
  const userIds = [...new Set(bookings.flatMap((b) => [b.student_id, b.mentor_id]))].filter(Boolean);

  if (userIds.length > 0) {
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, full_name, avatar_url, role")
      .in("id", userIds);

    if (!usersError && users) {
      // Filter out student user IDs
      const studentIds = users.filter((u) => u.role === "student").map((u) => u.id);

      let studentProfilesMap = new Map();
      if (studentIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from("student_profiles")
          .select("user_id, college, degree, branch, skills, bio")
          .in("user_id", studentIds);

        if (!profilesError && profiles) {
          studentProfilesMap = new Map(profiles.map((p) => [p.user_id, p]));
        }
      }

      const userMap = new Map(
        users.map((u) => {
          if (u.role === "student") {
            const profile = studentProfilesMap.get(u.id) || null;
            return [u.id, { ...u, profile }];
          }
          return [u.id, u];
        }),
      );

      return bookings.map((b) => ({
        ...b,
        student: userMap.get(b.student_id) || null,
        mentor: userMap.get(b.mentor_id) || null,
      }));
    }
  }


  return bookings.map((b) => ({ ...b, student: null, mentor: null }));
};


const ALLOWED_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled", "confirmed"],
  completed: [],
  cancelled: [],
};

const updateBookingStatus = async (bookingId, status, meetingLink, userId, userRole) => {
  // Fetch the current booking details to verify its current status
  const { data: existingBooking, error: fetchError } = await supabase
    .from("bookings")
    .select("status, student_id, mentor_id, availability_slot_id")
    .eq("id", bookingId)
    .single();

  if (fetchError || !existingBooking) {
    throw new Error("Booking record not found.");
  }

  // Authorization Check
  if (userRole !== "admin") {
    if (userRole === "student") {
      if (existingBooking.student_id !== userId) {
        throw new Error("You are not authorized to update this booking.");
      }
      if (status !== "cancelled") {
        throw new Error("Students can only cancel bookings.");
      }
    } else if (userRole === "mentor") {
      if (existingBooking.mentor_id !== userId) {
        throw new Error("You are not authorized to update this booking.");
      }
    } else {
      throw new Error("Unauthorized role.");
    }
  }

  const currentStatus = existingBooking.status || "pending";
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];

  if (!allowed.includes(status)) {
    throw new Error(
      `Invalid booking status transition from '${currentStatus}' to '${status}'.`
    );
  }

  const updatePayload = { status };
  if (meetingLink !== undefined) {
    if (userRole !== "mentor" && userRole !== "admin") {
      throw new Error("Only mentors are authorized to set or update the meeting link.");
    }
    updatePayload.meeting_link = meetingLink;
  }

  const { data, error } = await supabase
    .from("bookings")
    .update(updatePayload)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Free availability slots by setting is_available = true when status transitions to cancelled
  if (status === "cancelled" && existingBooking.availability_slot_id) {
    const { error: slotError } = await supabase
      .from("availability_slots")
      .update({ is_available: true })
      .eq("id", existingBooking.availability_slot_id);

    if (slotError) {
      console.error("Failed to free availability slot:", slotError.message);
    }
  }

  // Create notification
  await createNotification({
    user_id: data.student_id,
    title: "Booking Updated",
    message: `Your booking has been ${status}.`,
  });

  // Get student email
  const { data: student } = await supabase
    .from("users")
    .select("email, full_name")
    .eq("id", data.student_id)
    .single();

  // Send email (don't fail booking if email fails)
  if (student) {
    try {
      await sendEmail({
        to: student.email,
        subject: `Booking ${status}`,
        html: `
          <h2>Hello ${student.full_name},</h2>
          <p>Your booking status has been updated.</p>
          <p><b>Status:</b> ${status}</p>
        `,
      });
    } catch (err) {
      console.error("Email Error:", err.message);
    }
  }

  return data;
};


module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
};