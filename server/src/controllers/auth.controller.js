const {
  registerUser,
  loginUser,
  logoutUser,
  changePassword: changePasswordService,
} = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    const user = await registerUser({
      fullName,
      email,
      password,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const data = await loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: "Login successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};

const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    await logoutUser(token);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters and include an uppercase letter and a number.",
      });
    }

    await changePasswordService({
      userId: req.user.auth_id,
      email: req.user.email,
      currentPassword,
      newPassword,
    });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  me,
  logout,
  changePassword,
};
