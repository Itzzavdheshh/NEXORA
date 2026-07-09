const supabase = require("../config/supabase");

const createBooking = async (studentId, booking) => {

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
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Mark slot unavailable
  await supabase
    .from("availability_slots")
    .update({
      is_available: false,
    })
    .eq("id", booking.availability_slot_id);

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

module.exports = {
  createBooking,
  getBookings,
};