const express = require("express");

const {
  apiHealth,
  databaseHealth,
} = require("../controllers/health.controller");

const router = express.Router();

router.get("/", apiHealth);
router.get("/db", databaseHealth);

module.exports = router;