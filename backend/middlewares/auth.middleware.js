/**
 * Authentication Middleware (Production Quality - MZ-CLOUD)
 * Supports Bearer JWT token, Telegram WebApp initData headers, and query parameters (?token=&tgId=) for browser media tags
 */
const jwt = require('jsonwebtoken');
const appConfig = require('../config/app.config');
const authService = require('../services/auth.service');
const userRepository = require('../repositories/user.repository');
const { ERR_UNAUTHORIZED, ERR_FORBIDDEN } = require('../constants/error-codes');

async function authMiddleware(req, res, next) {
  try {
    let user = null;

    // 1. Check Authorization Bearer Token (Header or Query ?token=)
    const tokenStr =
      (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
        ? req.headers.authorization.replace('Bearer ', '').trim()
        : null) || req.query.token;

    if (tokenStr) {
      try {
        const decoded = jwt.verify(tokenStr, appConfig.jwtSecret);
        user = await userRepository.findById(decoded.id);
      } catch (e) {
        // Token invalid or expired, check Telegram headers/params
      }
    }

    // 2. Check X-Telegram-Init-Data header
    if (!user && req.headers['x-telegram-init-data']) {
      const rawInitData = decodeURIComponent(req.headers['x-telegram-init-data']);
      try {
        const telegramUser = authService.validateTelegramInitData(rawInitData);
        if (telegramUser && telegramUser.id) {
          const authResult = await authService.loginWithTelegram(
            telegramUser,
            req.ip || req.connection?.remoteAddress
          );
          user = authResult.user;
          res.setHeader('X-Access-Token', authResult.accessToken);
          res.setHeader('X-Refresh-Token', authResult.refreshToken);
        }
      } catch (e) {
        // Fallthrough
      }
    }

    // 3. Check X-Telegram-User-Id / X-Telegram-User-Data or ?tgId= query parameter
    if (!user) {
      const tgId = String(req.headers['x-telegram-user-id'] || req.query.tgId || '');
      let tgProfile = null;
      if (req.headers['x-telegram-user-data']) {
        try {
          tgProfile = JSON.parse(decodeURIComponent(req.headers['x-telegram-user-data']));
        } catch (e) {
          // ignore
        }
      }

      if (tgProfile && tgProfile.id) {
        const authResult = await authService.loginWithTelegram(
          tgProfile,
          req.ip || req.connection?.remoteAddress
        );
        user = authResult.user;
        res.setHeader('X-Access-Token', authResult.accessToken);
        res.setHeader('X-Refresh-Token', authResult.refreshToken);
      } else if (tgId && tgId !== '') {
        user = await userRepository.findByTelegramId(tgId);
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
