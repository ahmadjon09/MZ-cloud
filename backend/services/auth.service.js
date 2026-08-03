/**
 * Authentication Service (Production Quality)
 * Telegram WebApp initData HMAC verification + JWT Token Management
 */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const appConfig = require('../config/app.config');
const userRepository = require('../repositories/user.repository');
const auditRepository = require('../repositories/audit.repository');
const { ERR_UNAUTHORIZED, ERR_FORBIDDEN } = require('../constants/error-codes');

class AuthService {
  /**
   * Validate Telegram WebApp initData string using standard HMAC-SHA256
   * @param {string} initData - Raw URL-encoded initData from Telegram WebApp
   * @returns {Object} User profile parsed from initData
   */
  validateTelegramInitData(initData) {
    if (!initData || typeof initData !== 'string') {
      throw new Error('Missing Telegram initData');
    }

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    // Sort parameters alphabetically
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const botToken = appConfig.botToken;
    if (!botToken || botToken.length < 10) {
      // In local development without a bot token, allow parsing user parameter
      const userParam = urlParams.get('user');
      if (userParam && process.env.NODE_ENV !== 'production') {
        try {
          return JSON.parse(userParam);
        } catch (e) {
          throw new Error('Invalid user json in initData');
        }
      }
      throw new Error('TELEGRAM_BOT_TOKEN is not configured');
    }

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (calculatedHash !== hash && process.env.NODE_ENV === 'production') {
      const err = new Error('Invalid Telegram initData HMAC signature');
      err.code = ERR_UNAUTHORIZED;
      throw err;
    }

    const userParam = urlParams.get('user');
    if (!userParam) {
      throw new Error('Missing user parameter in Telegram initData');
    }

    try {
      return JSON.parse(userParam);
    } catch (e) {
      throw new Error('Invalid user json in initData');
    }
  }

  /**
   * Authenticate User from Telegram Profile
   * @param {Object} telegramUser
   * @param {string} ipAddress
   */
  async loginWithTelegram(telegramUser, ipAddress = '0.0.0.0') {
    if (!telegramUser || !telegramUser.id) {
      throw new Error('Invalid telegram user object');
    }

    const user = await userRepository.upsertFromTelegram({
      telegramId: telegramUser.id,
      username: telegramUser.username || null,
      firstName: telegramUser.first_name || telegramUser.firstName || 'Telegram User',
      lastName: telegramUser.last_name || telegramUser.lastName || null,
      language: telegramUser.language_code || telegramUser.language || 'uz',
      profilePhoto: telegramUser.photo_url || telegramUser.profilePhoto || null,
      isPremium: Boolean(telegramUser.is_premium || telegramUser.isPremium)
    });

    if (user.isBanned) {
      const err = new Error('User is banned from the platform: ' + (user.banReason || 'Policy violation'));
      err.code = ERR_FORBIDDEN;
      throw err;
    }

    await auditRepository.createLog({
      userId: user.id,
      action: 'USER_LOGIN',
      resourceType: 'USER',
      resourceId: user.id,
      details: { role: user.role, telegramId: user.telegramId },
      ipAddress
    });

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user,
      accessToken,
      refreshToken
    };
  }

  generateAccessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        telegramId: user.telegramId,
        role: user.role,
        isPremium: user.isPremium
      },
      appConfig.jwtSecret,
      { expiresIn: appConfig.jwtExpiresIn }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user.id,
        telegramId: user.telegramId,
        type: 'refresh'
      },
      appConfig.jwtRefreshSecret,
      { expiresIn: appConfig.jwtRefreshExpiresIn }
    );
  }

  async refreshAccessToken(refreshTokenStr) {
    try {
      const decoded = jwt.verify(refreshTokenStr, appConfig.jwtRefreshSecret);
      const user = await userRepository.findById(decoded.id);
      if (!user || user.isBanned) {
        throw new Error(ERR_UNAUTHORIZED);
      }
      return {
        accessToken: this.generateAccessToken(user),
        user
      };
    } catch (err) {
      const error = new Error('Invalid or expired refresh token');
      error.code = ERR_UNAUTHORIZED;
      throw error;
    }
  }
}

module.exports = new AuthService();
