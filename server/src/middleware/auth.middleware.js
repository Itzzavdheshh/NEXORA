const supabase = require("../config/supabase");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify Supabase JWT

    const result = await supabase.auth.getUser(token);

    const {
      data: { user: authUser },
      error,
    } = result;

    if (error || !authUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // Fetch application user
    const { data: appUser, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", authUser.id)
      .single();

    if (profileError || !appUser) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    // Attach complete application user
    req.user = appUser;

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = authenticate;