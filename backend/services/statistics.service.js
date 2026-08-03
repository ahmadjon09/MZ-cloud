/**
 * Statistics & System Health Service
 * Provides user analytics and Super Admin live system monitoring
 */
const os = require('os');
const prisma = require('../config/database');
const userRepository = require('../repositories/user.repository');
const fileRepository = require('../repositories/file.repository');
const redisClient = require('../config/redis');

class StatisticsService {
  /**
   * Get storage and media category statistics for an individual user
   */
  async getUserDashboardStats(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const mediaStats = await fileRepository.getUserMediaStatistics(userId);

    const folderCount = await prisma.folder.count({
      where: { userId, deletedAt: null }
    });

    const favoriteCount = await prisma.fileItem.count({
      where: { userId, isFavorite: true, isDeleted: false }
    });

    const pinnedCount = await prisma.fileItem.count({
      where: { userId, isPinned: true, isDeleted: false }
    });

    const trashCount = await prisma.fileItem.count({
      where: { userId, isDeleted: true }
    });

    return {
      user: {
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        role: user.role,
        isPremium: user.isPremium,
        storageUsed: user.storageUsed,
        fileCount: user.fileCount
      },
      folderCount,
      favoriteCount,
      pinnedCount,
      trashCount,
      mediaBreakdown: mediaStats.categories,
      totalFiles: mediaStats.totalFiles,
      totalSize: mediaStats.totalSize
    };
  }

  /**
   * Get comprehensive platform metrics & server health for the Super Admin Panel
   */
  async getSuperAdminAnalytics() {
    const globalUserStats = await userRepository.getGlobalUserStats();

    // Check DB status
    let dbStatus = 'ONLINE';
    let dbLatencyMs = 0;
    try {
      const start = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Date.now() - start;
    } catch (e) {
      dbStatus = 'OFFLINE';
    }

    // Check Redis status
    let redisStatus = 'ONLINE';
    let redisLatencyMs = 0;
    try {
      const start = Date.now();
      await redisClient.set('tgcloud:health_ping', '1');
      await redisClient.del('tgcloud:health_ping');
      redisLatencyMs = Date.now() - start;
    } catch (e) {
      redisStatus = 'FALLBACK_IN_MEMORY';
    }

    // System resource usage
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryUsagePercent = ((usedMem / totalMem) * 100).toFixed(1);
    const loadAvg = os.loadavg();

    // Overall file categories
    const globalMediaStats = await prisma.fileItem.groupBy({
      by: ['category'],
      where: { isDeleted: false },
      _count: { _all: true },
      _sum: { fileSize: true }
    });

    const categoriesBreakdown = {};
    globalMediaStats.forEach((r) => {
      categoriesBreakdown[r.category] = {
        count: r._count._all,
        size: r._sum.fileSize || 0
      };
    });

    // Recent audit logs
    const recentLogs = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { username: true, firstName: true }
        }
      }
    });

    return {
      platform: {
        totalUsers: globalUserStats.totalUsers,
        premiumUsers: globalUserStats.premiumUsers,
        totalStorageUsed: globalUserStats.totalStorageUsed,
        totalFilesCount: globalUserStats.totalFilesCount
      },
      health: {
        serverStatus: 'HEALTHY',
        dbStatus,
        dbLatencyMs,
        redisStatus,
        redisLatencyMs,
        cpuLoadAverage: loadAvg[0].toFixed(2),
        memoryUsagePercent,
        totalMemoryMb: Math.round(totalMem / (1024 * 1024)),
        usedMemoryMb: Math.round(usedMem / (1024 * 1024)),
        uptimeSeconds: Math.round(process.uptime())
      },
      mediaDistribution: categoriesBreakdown,
      recentLogs
    };
  }
}

module.exports = new StatisticsService();
