const supabase = require("../config/supabase");

const createSlot = async (mentorId, slot) => {
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
    .eq("mentor_id", mentorId);

  if (error) throw new Error(error.message);

  return data;
};

module.exports = {
  createSlot,
  getSlots,
};