const sanitizeString = (str) => {
  if (typeof str !== "string") return str;
  // Strip all HTML tag brackets to prevent XSS injections
  return str.replace(/<[^>]*>/g, "").trim();
};

const sanitizeInput = (data) => {
  if (!data) return data;

  if (typeof data === "string") {
    return sanitizeString(data);
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeInput(item));
  }

  if (typeof data === "object") {
    const sanitized = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitized[key] = sanitizeInput(data[key]);
      }
    }
    return sanitized;
  }

  return data;
};

const sanitizerMiddleware = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  if (req.query) {
    req.query = sanitizeInput(req.query);
  }
  if (req.params) {
    req.params = sanitizeInput(req.params);
  }
  next();
};

module.exports = {
  sanitizeInput,
  sanitizerMiddleware,
};
