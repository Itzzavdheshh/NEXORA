const {
  registerUser,
  loginUser,
  logoutUser,
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

module.exports = {
  register,
  login,
  me,
  logout,
};
