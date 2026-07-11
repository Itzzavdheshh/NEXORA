const supabase = require("../config/supabase");

const createNotification = async (notification) => {

  const { data, error } = await supabase
    .from("notifications")
    .insert(notification)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const getNotifications = async (userId) => {

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const markAsRead = async (notificationId) => {

  const { data, error } = await supabase
    .from("notifications")
    .update({
      is_read: true,
    })
    .eq("id", notificationId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
};