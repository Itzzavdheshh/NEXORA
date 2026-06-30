const supabase = require("../config/supabase");

const apiHealth = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to Nexora Backend API 🚀",
    version: "1.0.0",
  });
};

const databaseHealth = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("_connection_test_")
      .select("*")
      .limit(1);

    return res.status(200).json({
      success: true,
      connected: true,
      message: "Backend connected to Supabase.",
      note: error ? error.message : "Connection successful.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      connected: false,
      error: err.message,
    });
  }
};

module.exports = {
  apiHealth,
  databaseHealth,
};