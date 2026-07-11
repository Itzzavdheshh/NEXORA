const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/role.middleware");
const authenticate = require("../middleware/auth.middleware");

const {
  createProfile,
  getProfile,
  verify,
} = require("../controllers/mentor.controller");

const {
  validateMentorProfile,
} = require("../validators/mentor.validator");

router.post(
  "/",
  authenticate,
  validateMentorProfile,
  createProfile
);

router.get(
  "/",
  authenticate,
  getProfile
);

router.patch(
  "/:id/verify",
  authenticate,
  authorizeRoles("admin"),
  verify
);

module.exports = router;