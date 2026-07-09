const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const {
  createProfile,
  getProfile,
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

module.exports = router;