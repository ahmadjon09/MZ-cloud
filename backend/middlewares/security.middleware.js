/**
 * Security Headers & Protection Middleware
 */
const helmet = require('helmet');

const securityMiddleware = helmet({
  contentSecurityPolicy: false, // Disabled for WebApp flexibility inside Telegram webview
  crossOriginEmbedderPolicy: false
});

module.exports = securityMiddleware;
