const {
  createStudentProfile,
  getStudentProfile,
} = require("../services/student.service");

const createProfile = async (req, res) => {
  try {
    const profile = await createStudentProfile(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await getStudentProfile(req.user.id);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
};