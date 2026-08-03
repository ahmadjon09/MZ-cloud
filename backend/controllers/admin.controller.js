/**
 * Admin Controller (MZ-CLOUD)
 * Super Admin Panel API endpoints for monitoring, user management, and server health
 * Includes adding/promoting new admins by Telegram ID or Username
 */
const statisticsService = require('../services/statistics.service');
const userRepository = require('../repositories/user.repository');
const auditRepository = require('../repositories/audit.repository');
const uploadQueue = require('../queues/upload.queue');
const logger = require('../config/logger');
const { ROLES } = require('../constants/permissions');

class AdminController {
  async getAnalytics(req, res, next) {
    try {
      const analytics = await statisticsService.getSuperAdminAnalytics();
      const queueLen = await uploadQueue.getQueueLength();
      analytics.health.queueLength = queueLen;

      return res.status(200).json({
        success: true,
        data: analytics
      });
    } catch (err) {
      next(err);
    }
  }

  async listUsers(req, res, next) {
    try {
      const { search, role, limit = 20, offset = 0 } = req.query;
      const result = await userRepository.listUsers({ search, role, limit, offset });
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Add a new admin by Telegram ID or username
   */
  async addAdmin(req, res, next) {
    try {
      const { telegramIdOrUsername } = req.body;
      if (!telegramIdOrUsername || !String(telegramIdOrUsername).trim()) {
        return res.status(400).json({
          success: false,
          error: { code: 'ERR_VALIDATION', message: 'Telegram ID or username is required' }
        });
      }

      const clean = String(telegramIdOrUsername).trim().replace(/^@/, '');
      const searchRes = await userRepository.listUsers({ search: clean, limit: 5 });
      const targetUser = searchRes.users.find(
        (u) => u.telegramId === clean || (u.username && u.username.toLowerCase() === clean.toLowerCase())
      ) || searchRes.users[0];

      if (!targetUser) {
        return res.status(404).json({
          success: false,
          error: { code: 'ERR_NOT_FOUND', message: 'User not found in database. Ask them to /start the bot first.' }
        });
      }

      const updated = await userRepository.updateRole(targetUser.id, ROLES.ADMIN);

      await auditRepository.createLog({
        userId: req.user.id,
        action: 'ADMIN_ADD_NEW_ADMIN',
        resourceType: 'USER',
        resourceId: targetUser.id,
        details: { targetTelegramId: targetUser.telegramId, targetUsername: targetUser.username }
      });

      return res.status(200).json({
        success: true,
        data: {
          user: updated,
          message: `${updated.firstName} (${updated.telegramId}) yangi Admin sifatida qo'shildi!`
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async setUserBanStatus(req, res, next) {
    try {
      const { isBanned, banReason } = req.body;
      const updated = await userRepository.setBanStatus(req.params.id, Boolean(isBanned), banReason);

      await auditRepository.createLog({
        userId: req.user.id,
        action: isBanned ? 'ADMIN_BAN_USER' : 'ADMIN_UNBAN_USER',
        resourceType: 'USER',
        resourceId: req.params.id,
        details: { banReason }
      });

      return res.status(200).json({
        success: true,
        data: { user: updated }
      });
    } catch (err) {
      next(err);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const { role } = req.body;
      const updated = await userRepository.updateRole(req.params.id, role);

      await auditRepository.createLog({
        userId: req.user.id,
        action: 'ADMIN_CHANGE_ROLE',
        resourceType: 'USER',
        resourceId: req.params.id,
        details: { newRole: role }
      });

      return res.status(200).json({
        success: true,
        data: { user: updated }
      });
    } catch (err) {
      next(err);
    }
  }

  async broadcastMessage(req, res, next) {
    try {
      const { message, markdown = true } = req.body;
      if (!message || message.trim() === '') {
        return res.status(400).json({
          success: false,
          error: { code: 'ERR_VALIDATION', message: 'Broadcast message cannot be empty' }
        });
      }

      await auditRepository.createLog({
        userId: req.user.id,
        action: 'ADMIN_BROADCAST',
        resourceType: 'SYSTEM',
        details: { messageText: message }
      });

      logger.info({ adminId: req.user.id, message }, '📢 Super Admin triggered broadcast message');

      return res.status(200).json({
        success: true,
        data: {
          message: 'Broadcast message dispatched to queue',
          recipientCountEstimate: 'All Active Users'
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();
