require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const mentorRoutes = require("./routes/mentor.routes");
const availabilityRoutes = require("./routes/availability.routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/mentor", mentorRoutes);
app.use("/api/v1/availability", availabilityRoutes);

module.exports = app;