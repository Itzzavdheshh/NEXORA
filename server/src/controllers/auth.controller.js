const { registerUser, loginUser, getCurrentUser, logoutUser, } = require("../services/auth.service");

const register = async (req, res) => {
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
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async ( req, res) => {
  try {
    const { email, Password } = req.body;

    const data = await loginUser({ email, Password });

    return res.status(200).json({
      success: true,
      message: "Login successfully.",
      data,
    });
  }
  catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const me = async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  }
  
  catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const result = await logoutUser(token);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  register,
  login,
  me,
  logout,
};
