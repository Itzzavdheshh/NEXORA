const validateBooking = (req, res, next) => {

  const {
    mentor_id,
    availability_slot_id,
    booking_date,
    start_time,
    end_time,
  } = req.body;

  if (
    !mentor_id ||
    !availability_slot_id ||
    !booking_date ||
    !start_time ||
    !end_time
  ) {

    return res.status(400).json({
      success: false,
      message: "All required fields must be provided.",
    });

  }

  if (start_time >= end_time) {
    return res.status(400).json({
        success: false,
        message: "End time must be after start time.",
    });
}

  next();
};

module.exports = {
  validateBooking,
};