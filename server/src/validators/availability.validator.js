const validateAvailability = (req, res, next) => {
  const { day_of_week, start_time, end_time } = req.body;

  if (!day_of_week || !start_time || !end_time) {
    return res.status(400).json({
      success: false,
      message: "Day, start time and end time are required.",
    });
  }

  next();
};

module.exports = {
  validateAvailability,
};
