const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/role.middleware");
const authenticate = require("../middleware/auth.middleware");

const {
  createProfile,
  getProfile,
  updateProfile,
  pendingMentors,
  verify,
  reject,
} = require("../controllers/mentor.controller");

const {
  validateMentorProfile,
} = require("../validators/mentor.validator");

// Create mentor profile (mentor only, first-time setup)
router.post(
  "/",
  authenticate,
  authorizeRoles("mentor"),
  validateMentorProfile,
  createProfile
);

// Get own mentor profile
router.get(
  "/profile",
  authenticate,
  authorizeRoles("mentor"),
  getProfile
);

// Update mentor profile (upsert)
router.put(
  "/profile",
  authenticate,
  authorizeRoles("mentor"),
  updateProfile
);

// Get pending (unverified) mentors - admin only
router.get(
  "/pending",
  authenticate,
  authorizeRoles("admin"),
  pendingMentors
);

// Verify a mentor - admin only
router.patch(
  "/:id/verify",
  authenticate,
  authorizeRoles("admin"),
  verify
);

// Reject a mentor - admin only
router.patch(
  "/:id/reject",
  authenticate,
  authorizeRoles("admin"),
  reject
);


module.exports = router;