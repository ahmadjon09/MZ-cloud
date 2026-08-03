/**
 * Enterprise Centralized Error Handling Middleware
 */
const logger = require('../config/logger');
const { ERR_INTERNAL_SERVER } = require('../constants/error-codes');

function errorHandler(err, req, res, next) {
  logger.error({
    err: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    userId: req.user?.id
  }, '🚨 Unhandled API Error');

  const statusCode = err.status || err.statusCode || 500;
  const errorCode = err.code || ERR_INTERNAL_SERVER;

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: err.message || 'An unexpected server error occurred',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
}

module.exports = errorHandler;
