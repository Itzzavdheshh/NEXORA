const {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require("../services/notification.service");

const create = async (req, res) => {
  try {
    const notification = await createNotification({
      user_id: req.user.id,
      title: req.body.title,
      message: req.body.message,
    });

    return res.status(201).json({
      success: true,
      data: notification,
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
    const notifications = await getNotifications(req.user.id);

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const read = async (req, res) => {
  try {
    const notification = await markAsRead(req.params.id);

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const readAll = async (req, res) => {
  try {
    const result = await markAllAsRead(req.user.id);

    return res.status(200).json({
      success: true,
      data: result,
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
  read,
  readAll,
};