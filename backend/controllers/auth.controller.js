/**
 * Authentication Controller (Production Quality)
 */
const authService = require('../services/auth.service');
const statisticsService = require('../services/statistics.service');

class AuthController {
  async telegramLogin(req, res, next) {
    try {
      const { initData } = req.body;

      if (!initData) {
        return res.status(400).json({
          success: false,
          error: { code: 'ERR_VALIDATION', message: 'Missing Telegram initData' }
        });
      }

      const telegramUser = authService.validateTelegramInitData(initData);
      const authResult = await authService.loginWithTelegram(
        telegramUser,
        req.ip || req.connection?.remoteAddress
      );

      return res.status(200).json({
        success: true,
        data: authResult
      });
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: { code: 'ERR_VALIDATION', message: 'Missing refreshToken' }
        });
      }

      const result = await authService.refreshAccessToken(refreshToken);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const stats = await statisticsService.getUserDashboardStats(req.user.id);
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
