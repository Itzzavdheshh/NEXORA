const {
  createBooking,
  getBookings,
} = require("../services/booking.service");

const create = async (req, res) => {
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

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

const getAll = async (req, res) => {
  try {

    const bookings = await getBookings(req.user.id);

    return res.status(200).json({
      success: true,
      data: bookings,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  create,
  getAll,
};