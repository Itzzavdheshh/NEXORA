const supabase = require("../config/supabase");

// Helper to convert time format (HH:MM or HH:MM:SS) to total minutes
const toMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const parts = timeStr.split(":");
  const h = parseInt(parts[0] || "0", 10);
  const m = parseInt(parts[1] || "0", 10);
  return h * 60 + m;
};

// Check if a new slot overlaps with any existing slot for the same mentor & day
const checkOverlap = async (mentorId, dayOfWeek, startTime, endTime, excludeSlotId = null) => {
  const { data: existingSlots, error } = await supabase
    .from("availability_slots")
    .select("id, day_of_week, start_time, end_time")
    .eq("mentor_id", mentorId)
    .eq("day_of_week", dayOfWeek);

  if (error) throw new Error(error.message);

  const newStart = toMinutes(startTime);
  const newEnd = toMinutes(endTime);

  const hasOverlap = (existingSlots ?? []).some((slot) => {
    if (excludeSlotId && slot.id === excludeSlotId) return false;

    const existStart = toMinutes(slot.start_time);
    const existEnd = toMinutes(slot.end_time);

    // Overlap condition: startA < endB AND endA > startB
    return newStart < existEnd && newEnd > existStart;
  });

  if (hasOverlap) {
    throw new Error("This slot overlaps with an existing availability slot on the same day.");
  }
};

const createSlot = async (mentorId, slot) => {
  // Check overlap before inserting
  await checkOverlap(mentorId, slot.day_of_week, slot.start_time, slot.end_time);

  const { data, error } = await supabase
    .from("availability_slots")
    .insert({
      mentor_id: mentorId,
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time,
      is_available: true,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const getSlots = async (mentorId) => {
  const { data, error } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("mentor_id", mentorId)
    .order("day_of_week", { ascending: true });

  if (error) throw new Error(error.message);

  return data ?? [];
};

const updateSlot = async (mentorId, slotId, slot) => {
  // Ensure the slot belongs to this mentor before updating
  const { data: existing, error: findError } = await supabase
    .from("availability_slots")
    .select("id")
    .eq("id", slotId)
    .eq("mentor_id", mentorId)
    .single();

  if (findError || !existing) {
    throw new Error("Availability slot not found or access denied.");
  }

  // Check overlap before updating, excluding the slot being updated itself
  await checkOverlap(mentorId, slot.day_of_week, slot.start_time, slot.end_time, slotId);

  const { data, error } = await supabase
    .from("availability_slots")
    .update({
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time,
      is_available: slot.is_available !== undefined ? slot.is_available : true,
    })
    .eq("id", slotId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const deleteSlot = async (mentorId, slotId) => {
  // Ensure the slot belongs to this mentor before deleting
  const { data: existing, error: findError } = await supabase
    .from("availability_slots")
    .select("id")
    .eq("id", slotId)
    .eq("mentor_id", mentorId)
    .single();

  if (findError || !existing) {
    throw new Error("Availability slot not found or access denied.");
  }

  const { error } = await supabase
    .from("availability_slots")
    .delete()
    .eq("id", slotId);

  if (error) throw new Error(error.message);

  return { deleted: true, id: slotId };
};

module.exports = {
  createSlot,
  getSlots,
  updateSlot,
  deleteSlot,
};