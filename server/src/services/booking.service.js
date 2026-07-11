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

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .or(`student_id.eq.${userId},mentor_id.eq.${userId}`);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const updateBookingStatus = async (bookingId, status) => {

  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
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

  return data;
};

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
};