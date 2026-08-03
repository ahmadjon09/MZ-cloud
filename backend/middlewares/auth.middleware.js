/**
 * Authentication Middleware (Production Quality)
 * Requires valid Bearer JWT access token or Telegram WebApp initData header
 */
const jwt = require('jsonwebtoken');
const appConfig = require('../config/app.config');
const authService = require('../services/auth.service');
const userRepository = require('../repositories/user.repository');
const { ERR_UNAUTHORIZED, ERR_FORBIDDEN } = require('../constants/error-codes');

async function authMiddleware(req, res, next) {
  try {
    let user = null;

    // 1. Check Authorization Bearer Token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      try {
        const decoded = jwt.verify(token, appConfig.jwtSecret);
        user = await userRepository.findById(decoded.id);
      } catch (e) {
        // Token invalid or expired, check X-Telegram-Init-Data
      }
    }

    // 2. Check X-Telegram-Init-Data header if Bearer failed or missing
    if (!user) {
      const initDataHeader = req.headers['x-telegram-init-data'];
      if (initDataHeader) {
        const telegramUser = authService.validateTelegramInitData(initDataHeader);
        if (telegramUser && telegramUser.id) {
          const authResult = await authService.loginWithTelegram(
            telegramUser,
            req.ip || req.connection?.remoteAddress
          );
          user = authResult.user;
          // Expose new tokens in response headers for client storage
          res.setHeader('X-Access-Token', authResult.accessToken);
          res.setHeader('X-Refresh-Token', authResult.refreshToken);
        }
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: ERR_UNAUTHORIZED,
          message: 'Authentication required. Must open inside Telegram WebApp.'
        }
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        error: {
          code: ERR_FORBIDDEN,
          message: 'User account is banned: ' + (user.banReason || 'Policy violation')
        }
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: {
        code: ERR_UNAUTHORIZED,
        message: err.message || 'Unauthorized access'
      }
    });
  }
}

module.exports = authMiddleware;
