const validateRegister = (req, res, next) => {
  const { fullName, email, password, role } = req.body;

  // Check required fields
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  // Validate email format
  const emailRegex = /^\S+@\S+\.\S+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address.",
    });
  }

  // Validate password length
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long.",
    });
  }

  // Validate role
  const allowedRoles = ["student", "mentor", "admin"];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user role.",
    });
  }

  next();
};

module.exports = {
  validateRegister,
};