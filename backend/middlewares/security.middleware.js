/**
 * Security Headers & Protection Middleware (MZ-CLOUD)
 * Configured with cross-origin resource policy so Vercel frontend can load Render CDN images & videos
 */
const helmet = require('helmet');

const securityMiddleware = helmet({
  contentSecurityPolicy: false, // Disabled for WebApp flexibility inside Telegram webview
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: false
});

module.exports = securityMiddleware;
