const express = require("express");

const router = express.Router();
const authorizeRoles = require("../middleware/role.middleware");
const authenticate = require("../middleware/auth.middleware");

const {
  create,
  getAll,
  updateStatus,
} = require("../controllers/booking.controller");

const {
  validateBooking,
} = require("../validators/booking.validator");

router.post(
  "/",
  authenticate,
  authorizeRoles("student"),
  validateBooking,
  create
);

router.get(
  "/",
  authenticate,
  getAll
);

router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("mentor"),
  updateStatus
);

module.exports = router;