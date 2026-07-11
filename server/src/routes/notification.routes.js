const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const {
  create,
  getAll,
  read,
} = require("../controllers/notification.controller");

const {
  validateNotification,
} = require("../validators/notification.validator");

router.get(
  "/",
  authenticate,
  getAll
);

router.patch(
  "/:id/read",
  authenticate,
  read
);

module.exports = router;