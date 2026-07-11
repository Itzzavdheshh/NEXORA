const {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
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
      data: {
        ...profile,
        full_name: req.user.full_name,
        email: req.user.email,
        avatar_url: req.user.avatar_url,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profile = await updateStudentProfile(
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Student profile updated successfully.",
      data: {
        ...profile,
        full_name: req.body.fullName || req.user.full_name,
        email: req.user.email,
        avatar_url: req.body.avatar_url || req.user.avatar_url,
      },
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
  updateProfile,
};
