const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 50,
  skipSuccessfulRequests: true,
});

module.exports = {
  authLimiter,
};
