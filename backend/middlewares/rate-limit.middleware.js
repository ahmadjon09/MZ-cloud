/**
 * API Rate Limiter Middleware
 * Uses Redis cache to track requests per window
 */
const redisClient = require('../config/redis');

function createRateLimiter({ windowMs = 60000, max = 200, keyPrefix = 'rl:' } = {}) {
  return async (req, res, next) => {
    // In local development, relax rate limiter
    if (process.env.NODE_ENV === 'development' && !process.env.STRICT_RATE_LIMIT) {
      return next();
    }

    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    const key = `tgcloud:${keyPrefix}${ip}`;

    try {
      const currentStr = await redisClient.get(key);
      let current = currentStr ? parseInt(currentStr, 10) : 0;

      if (current >= max) {
        return res.status(429).json({
          success: false,
          error: {
            code: 'ERR_RATE_LIMIT',
            message: 'Too many requests, please try again later.'
          }
        });
      }

      await redisClient.setex(key, Math.ceil(windowMs / 1000), current + 1);
      next();
    } catch (e) {
      // If Redis fails, allow request through gracefully
      next();
    }
  };
}

module.exports = {
  createRateLimiter
};
