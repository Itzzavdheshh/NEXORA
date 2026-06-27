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
    fullName,
    avatar_url,
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

  if (fullName && fullName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Full name must be at least 2 characters long.",
    });
  }

  const optionalUrls = [linkedin_url, github_url, portfolio_url, avatar_url].filter(Boolean);
  const invalidUrl = optionalUrls.find((url) => {
    try {
      new URL(url);
      return false;
    } catch {
      return true;
    }
  });

  if (invalidUrl) {
    return res.status(400).json({
      success: false,
      message: "Social links and avatar must be valid URLs.",
    });
  }

  next();
};

module.exports = {
  validateStudentProfile,
};
