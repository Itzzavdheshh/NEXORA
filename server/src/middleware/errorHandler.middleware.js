const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const requestId = req.id || "unknown";

  // Log error using Winston
  logger.error(`Error occurred: ${message}`, {
    requestId,
    userId: req.user ? req.user.id : "anonymous",
    status,
    stack: err.stack,
  });

  const response = {
    success: false,
    message,
    requestId,
  };

  // Hide stack trace in production environments
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  // Handle specific database or validation errors if necessary
  if (err.name === "ValidationError") {
    return res.status(400).json({
      ...response,
      message: err.message,
    });
  }

  return res.status(status).json(response);
};

module.exports = errorHandler;
