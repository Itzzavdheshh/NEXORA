const {
  createMentorProfile,
  getMentorProfile,
  updateMentorProfile,
  getPendingMentors,
  verifyMentor,
  rejectMentor,
} = require("../services/mentor.service");

const createProfile = async (req, res, next) => {
  try {
    const profile = await createMentorProfile(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const profile = await getMentorProfile(req.user.id);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const profile = await updateMentorProfile(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

const pendingMentors = async (req, res, next) => {
  try {
    const mentors = await getPendingMentors();

    return res.status(200).json({
      success: true,
      data: mentors,
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Administrators cannot verify their own accounts.",
      });
    }

    const mentor = await verifyMentor(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Mentor verified successfully.",
      data: mentor,
    });
  } catch (error) {
    next(error);
  }
};

const reject = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Administrators cannot reject their own accounts.",
      });
    }

    const mentor = await rejectMentor(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Mentor application rejected.",
      data: mentor,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  pendingMentors,
  verify,
  reject,
};