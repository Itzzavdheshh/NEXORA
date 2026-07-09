const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const {
  create,
  getAll,
} = require("../controllers/booking.controller");

const {
  validateBooking,
} = require("../validators/booking.validator");

router.post(
  "/",
  authenticate,
  validateBooking,
  create
);

router.get(
  "/",
  authenticate,
  getAll
);

module.exports = router;