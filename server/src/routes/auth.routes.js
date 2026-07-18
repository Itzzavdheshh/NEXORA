const authenticate = require("../middleware/auth.middleware");
const express = require("express");
const router = express.Router();

const {
  register,
  login,
  me,
  logout,
  changePassword,
} = require("../controllers/auth.controller");

const {
  validateRegister,
  validateLogin,
} = require("../validators/auth.validator");

// Register User
router.post("/register", validateRegister, register);

// Login User
router.post("/login", validateLogin, login);

// Get Current User
router.get("/me", authenticate, me);

// Change Password
router.post("/change-password", authenticate, changePassword);

// Logout User
router.post("/logout", authenticate, logout);

module.exports = router;