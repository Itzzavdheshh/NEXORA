const {
  createSlot,
  getSlots,
} = require("../services/availability.service");

const createAvailability = async (req, res) => {
  try {
    const slot = await createSlot(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      data: slot,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAvailability = async (req, res) => {
  try {
    const slots = await getSlots(req.user.id);

    return res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAvailability,
  getAvailability,
};