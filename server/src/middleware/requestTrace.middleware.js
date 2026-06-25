const crypto = require("crypto");
const logger = require("../utils/logger");

const requestTrace = (req, res, next) => {
  // Extract X-Request-ID or generate a new UUID
  const requestId = req.headers["x-request-id"] || crypto.randomUUID();
  req.id = requestId;
  res.setHeader("X-Request-ID", requestId);

  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const userId = req.user ? req.user.id : "anonymous";
    const status = res.statusCode;

    logger.info(`HTTP Request Completed`, {
      requestId: req.id,
      userId,
      method: req.method,
      url: req.originalUrl,
      status,
      duration: `${duration}ms`,
    });
  });

  next();
};

module.exports = requestTrace;
