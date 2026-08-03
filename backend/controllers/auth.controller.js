/**
 * Authentication Controller (Production Quality - MZ-CLOUD)
 * Supports Telegram WebApp initData verification, refresh tokens, and Telegram Stars Premium invoices
 */
const authService = require('../services/auth.service');
const statisticsService = require('../services/statistics.service');
const userRepository = require('../repositories/user.repository');
const telegramBot = require('../telegram/bot');
const logger = require('../config/logger');

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

  /**
   * Send a Telegram Stars (XTR) Invoice directly to the user's Telegram chat
   */
  async createStarsInvoice(req, res, next) {
    try {
      const bot = telegramBot.getBot();
      const targetTelegramId = req.user.telegramId;

      if (req.user.isPremium) {
        return res.status(400).json({
          success: false,
          error: { code: 'ERR_PREMIUM', message: 'Siz allaqachon MZ-CLOUD Premium a\'zosisiz!' }
        });
      }

      if (bot && bot.telegram) {
        try {
          await bot.telegram.sendInvoice(
            targetTelegramId,
            'MZ-CLOUD Premium Membership',
            '100% reklamasiz bulutli xotira, VIP oltin yulduz statusi va parallel yozish ustuvorligi!',
            JSON.stringify({ userId: req.user.id, action: 'MZ_CLOUD_PREMIUM_UPGRADE' }),
            '', // Must be empty string for Telegram Stars (XTR)
            'XTR',
            [{ label: 'MZ-CLOUD Premium (1 Year)', amount: 50 }]
          );

          logger.info({ userId: req.user.id, telegramId: targetTelegramId }, '⭐ Telegram Stars invoice dispatched to chat');

          return res.status(200).json({
            success: true,
            data: {
              sent: true,
              message: '50 Telegram Stars to\'lov hisobi chatingizga yuborildi! Telegram ilovangizni ochib to\'lovni tasdiqlang.'
            }
          });
        } catch (tgErr) {
          logger.warn({ err: tgErr.message }, 'Failed to send Telegram Stars invoice via Bot API');
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          sent: false,
          message: 'Telegram Bot oflayn rejimida. Botni /premium buyrug\'i orqali oching.'
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Dev/Sandbox toggle to instantly test MZ-CLOUD Premium on/off in the WebApp
   */
  async toggleDemoPremium(req, res, next) {
    try {
      const newStatus = !req.user.isPremium;
      const updated = await userRepository.updatePremiumStatus(req.user.id, newStatus);
      return res.status(200).json({
        success: true,
        data: {
          user: updated,
          message: newStatus
            ? 'VIP MZ-CLOUD Premium statusi faollashtirildi! (0 reklama)'
            : 'MZ-CLOUD Premium statusi o\'chirildi'
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
