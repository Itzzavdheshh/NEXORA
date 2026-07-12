const {
  createBooking,
  getBookings,
  updateBookingStatus,
} = require("../services/booking.service");

const create = async (req, res, next) => {
  try {
    const booking = await createBooking(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const bookings = await getBookings(req.user.id);

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const booking = await updateBookingStatus(
      req.params.id,
      req.body.status
    );

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  updateStatus,
};