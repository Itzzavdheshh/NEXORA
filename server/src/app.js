require("dotenv").config();

// Validate environment variables on startup
const { validateEnv } = require("./utils/env.validator");
validateEnv();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const supabase = require("./config/supabase");
const requestTrace = require("./middleware/requestTrace.middleware");
const { sanitizerMiddleware } = require("./utils/sanitizer");
const errorHandler = require("./middleware/errorHandler.middleware");

// Routes
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const mentorRoutes = require("./routes/mentor.routes");
const availabilityRoutes = require("./routes/availability.routes");
const bookingRoutes = require("./routes/booking.routes");
const notificationRoutes = require("./routes/notification.routes");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

// Enable compression and request tracing
app.use(compression());
app.use(requestTrace);

// Configure CORS
const corsOptions = {
  origin: process.env.NODE_ENV === "production" ? process.env.CORS_ORIGIN : "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  exposedHeaders: ["X-Request-ID"],
};
app.use(cors(corsOptions));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Sanitize inputs for XSS prevention globally
app.use(sanitizerMiddleware);

// Rate limiting setup
const authLimiterWindow = parseInt(process.env.AUTH_RATE_LIMIT_WINDOW || "15", 10);
const authLimiterMax = parseInt(process.env.AUTH_RATE_LIMIT_MAX || "20", 10);
const apiLimiterWindow = parseInt(process.env.API_RATE_LIMIT_WINDOW || "15", 10);
const apiLimiterMax = parseInt(process.env.API_RATE_LIMIT_MAX || "200", 10);

const authLimiter = rateLimit({
  windowMs: authLimiterWindow * 60 * 1000,
  max: authLimiterMax,
  message: { success: false, message: "Too many authentication requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: apiLimiterWindow * 60 * 1000,
  max: apiLimiterMax,
  message: { success: false, message: "Rate limit exceeded. Please throttle requests." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Mount Rate limiters
app.use("/api/v1/auth", authLimiter);
app.use("/api/v1", apiLimiter);

// Swagger Documentation API Setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nexora Platform API Documentation",
      version: "1.0.0",
      description: "Production API specification for Nexora AI Mentorship Platform",
    },
    servers: [
      {
        url: "/api/v1",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root Health Probe Endpoints
app.get("/health", (req, res) => {
  return res.status(200).json({ status: "UP", timestamp: new Date() });
});

app.get("/ready", async (req, res) => {
  try {
    const { error } = await supabase.from("users").select("id").limit(1);
    if (error) throw error;
    return res.status(200).json({ status: "READY", database: "connected" });
  } catch (err) {
    return res.status(503).json({
      status: "NOT_READY",
      database: "disconnected",
      error: err.message,
    });
  }
});

// Mount Routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/mentor", mentorRoutes);
app.use("/api/v1/mentors", mentorRoutes);
app.use("/api/v1/availability", availabilityRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;