const validateNotification = (req, res, next) => {

  const {
    title,
    message,
  } = req.body;

  if (!title || !message) {

    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });

  }

  next();
};

module.exports = {
  validateNotification,
};