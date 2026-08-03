/**
 * User Repository (MZ-CLOUD)
 * Strict Multi-Tenant Data Isolation: Manages user profiles, language selection, storage metrics, roles, and MZ-CLOUD Premium status
 */
const prisma = require('../config/database');
const { ROLES } = require('../constants/permissions');

class UserRepository {
  async findByTelegramId(telegramId) {
    if (!telegramId) return null;
    return prisma.user.findUnique({
      where: { telegramId: String(telegramId) }
    });
  }

  async findById(id) {
    if (!id) return null;
    return prisma.user.findUnique({
      where: { id: String(id) }
    });
  }

  async upsertFromTelegram(profile) {
    const telegramIdStr = String(profile.telegramId || profile.id);
    const adminTelegramId = String(process.env.ADMIN_TELEGRAM_ID || '777000');
    const role = telegramIdStr === adminTelegramId ? ROLES.SUPER_ADMIN : ROLES.USER;

    return prisma.user.upsert({
      where: { telegramId: telegramIdStr },
      create: {
        telegramId: telegramIdStr,
        username: profile.username || null,
        firstName: profile.firstName || profile.first_name || 'Telegram User',
        lastName: profile.lastName || profile.last_name || null,
        language: profile.language || profile.language_code || 'uz',
        profilePhoto: profile.profilePhoto || profile.photo_url || null,
        isPremium: Boolean(profile.isPremium || profile.is_premium),
        role
      },
      update: {
        username: profile.username || null,
        firstName: profile.firstName || profile.first_name || undefined,
        lastName: profile.lastName || profile.last_name || undefined,
        profilePhoto: profile.profilePhoto || profile.photo_url || undefined
      }
    });
  }

  async updateLanguage(userId, langCode) {
    if (!userId) return null;
    return prisma.user.update({
      where: { id: String(userId) },
      data: { language: String(langCode).toLowerCase() }
    });
  }

  /**
   * Update MZ-CLOUD custom Premium membership status (unlocked via Telegram Stars)
   */
  async updatePremiumStatus(userId, isPremium) {
    if (!userId) return null;
    return prisma.user.update({
      where: { id: String(userId) },
      data: { isPremium: Boolean(isPremium) }
    });
  }

  async incrementStorage(userId, bytes, countDelta = 1) {
    if (!userId) return null;
    return prisma.user.update({
      where: { id: String(userId) },
      data: {
        storageUsed: { increment: Number(bytes) },
        fileCount: { increment: Number(countDelta) }
      }
    });
  }

  async decrementStorage(userId, bytes, countDelta = 1) {
    if (!userId) return null;
    return prisma.user.update({
      where: { id: String(userId) },
      data: {
        storageUsed: { decrement: Math.max(0, Number(bytes)) },
        fileCount: { decrement: Math.max(0, Number(countDelta)) }
      }
    });
  }

  async updateRole(userId, newRole) {
    if (!userId) return null;
    return prisma.user.update({
      where: { id: String(userId) },
      data: { role: newRole }
    });
  }

  async setBanStatus(userId, isBanned, banReason = null) {
    if (!userId) return null;
    return prisma.user.update({
      where: { id: String(userId) },
      data: {
        isBanned,
        banReason: isBanned ? banReason : null
      }
    });
  }

  async listUsers({ search, role, limit = 20, offset = 0 }) {
    const where = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { username: { contains: search } },
        { firstName: { contains: search } },
        { telegramId: { contains: search } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        take: Number(limit),
        skip: Number(offset),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    return { users, total };
  }

  async getGlobalUserStats() {
    const totalUsers = await prisma.user.count();
    const premiumUsers = await prisma.user.count({ where: { isPremium: true } });
    const aggregations = await prisma.user.aggregate({
      _sum: {
        storageUsed: true,
        fileCount: true
      }
    });

    return {
      totalUsers,
      premiumUsers,
      totalStorageUsed: aggregations._sum.storageUsed || 0,
      totalFilesCount: aggregations._sum.fileCount || 0
    };
  }
}

module.exports = new UserRepository();
