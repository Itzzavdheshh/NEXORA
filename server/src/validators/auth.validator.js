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

  // Validate password strength: min 8 chars, at least one uppercase, one number
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters and include an uppercase letter and a number.",
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

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address.",
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};