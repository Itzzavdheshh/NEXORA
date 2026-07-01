const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/role.middleware");
const authenticate = require("../middleware/auth.middleware");

const {
  getDashboardStats,
  listUsers,
  updateUserStatus,
} = require("../controllers/admin.controller");

// Apply authentication and role authorization checks globally on this router
router.use(authenticate);
router.use(authorizeRoles("admin"));

// Dashboard statistics
router.get("/dashboard/stats", getDashboardStats);

// List users (paginated, sorted, and filtered)
router.get("/users", listUsers);

// Deactivate/Activate user
router.patch("/users/:id/status", updateUserStatus);

module.exports = router;
