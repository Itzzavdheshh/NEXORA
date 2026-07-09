const validateMentorProfile = (req, res, next) => {

  const {
    designation,
    company,
    experience,
  } = req.body;

  if (!designation || !company) {

    return res.status(400).json({
      success: false,
      message: "Designation and company are required.",
    });

  }

  if (
    experience &&
    (!Number.isInteger(experience) || experience < 0)
  ) {

    return res.status(400).json({
      success: false,
      message: "Invalid experience.",
    });

  }

  next();
};

module.exports = {
  validateMentorProfile,
};