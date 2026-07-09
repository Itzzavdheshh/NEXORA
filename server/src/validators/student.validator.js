const validateStudentProfile = (req, res, next) => {
  const {
    college,
    degree,
    branch,
    graduation_year,
    bio,
    linkedin_url,
    github_url,
    portfolio_url,
    skills,
  } = req.body;

  if (!college || !degree || !branch) {
    return res.status(400).json({
      success: false,
      message: "College, degree and branch are required.",
    });
  }

  if (
    graduation_year &&
    (!Number.isInteger(graduation_year) ||
      graduation_year < 2000 ||
      graduation_year > 2100)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid graduation year.",
    });
  }

  if (skills && !Array.isArray(skills)) {
    return res.status(400).json({
      success: false,
      message: "Skills must be an array.",
    });
  }

  next();
};

module.exports = {
  validateStudentProfile,
};