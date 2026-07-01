const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/role.middleware");
const authenticate = require("../middleware/auth.middleware");

const {
  createAvailability,
  getAvailability,
  updateAvailability,
  deleteAvailability,
} = require("../controllers/availability.controller");

const {
  validateAvailability,
} = require("../validators/availability.validator");

// Create a slot (mentor only)
router.post(
  "/",
  authenticate,
  authorizeRoles("mentor"),
  validateAvailability,
  createAvailability
);

// Get own slots
router.get(
  "/",
  authenticate,
  getAvailability
);

// Update a slot (mentor only)
router.put(
  "/:id",
  authenticate,
  authorizeRoles("mentor"),
  validateAvailability,
  updateAvailability
);

// Delete a slot (mentor only)
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("mentor"),
  deleteAvailability
);

module.exports = router;