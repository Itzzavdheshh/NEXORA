const express = require("express");
const router = express.Router();

const {
  register,
} = require("../controllers/auth.controller");

const {
  validateRegister,
} = require("../validators/auth.validator");

// Register User
router.post("/register", validateRegister, register);

module.exports = router;