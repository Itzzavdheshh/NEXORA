const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const {
  createProfile,
  getProfile,
} = require("../controllers/student.controller");

const {
  validateStudentProfile,
} = require("../validators/student.validator");

router.post("/", authenticate, validateStudentProfile, createProfile);

router.get("/", authenticate, getProfile);

module.exports = router;