const {
  createSlot,
  getSlots,
  updateSlot,
  deleteSlot,
} = require("../services/availability.service");

const createAvailability = async (req, res, next) => {
  try {
    const slot = await createSlot(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      data: slot,
    });
  } catch (error) {
    next(error);
  }
};

const getAvailability = async (req, res, next) => {
  try {
    const slots = await getSlots(req.user.id);

    return res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    next(error);
  }
};

const updateAvailability = async (req, res, next) => {
  try {
    const slot = await updateSlot(req.user.id, req.params.id, req.body);

    return res.status(200).json({
      success: true,
      data: slot,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAvailability = async (req, res, next) => {
  try {
    const result = await deleteSlot(req.user.id, req.params.id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAvailability,
  getAvailability,
  updateAvailability,
  deleteAvailability,
};