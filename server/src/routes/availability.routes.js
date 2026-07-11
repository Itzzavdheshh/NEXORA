const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/role.middleware");
const authenticate = require("../middleware/auth.middleware");

const {
  createAvailability,
  getAvailability,
} = require("../controllers/availability.controller");

const {
  validateAvailability,
} = require("../validators/availability.validator");

router.post(
  "/",
  authenticate,
  authorizeRoles("mentor"),
  validateAvailability,
  createAvailability
);

router.get(
  "/",
  authenticate,
  getAvailability
);

module.exports = router;