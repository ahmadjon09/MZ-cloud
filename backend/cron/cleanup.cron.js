/**
 * Enterprise Scheduled Tasks - Node Cron
 * Auto-purge Recycle Bin items older than 30 days & system health logging
 */
const cron = require('node-cron');
const prisma = require('../config/database');
const logger = require('../config/logger');

function initCronJobs() {
  // Midnight daily cleanup task
  cron.schedule('0 0 * * *', async () => {
    logger.info('🧹 Starting scheduled Recycle Bin cleanup (>30 days)...');
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const deletedItems = await prisma.fileItem.findMany({
        where: {
          isDeleted: true,
          deletedAt: {
            lt: thirtyDaysAgo
          }
        },
        select: { id: true, userId: true, fileSize: true }
      });

      if (deletedItems.length > 0) {
        // Group by user to decrement storage
        const userStorageDelta = new Map();
        for (const item of deletedItems) {
          const current = userStorageDelta.get(item.userId) || { bytes: 0, count: 0 };
          current.bytes += Number(item.fileSize || 0);
          current.count += 1;
          userStorageDelta.set(item.userId, current);
        }

        const idsToDelete = deletedItems.map((i) => i.id);
        const { count } = await prisma.fileItem.deleteMany({
          where: {
            id: {
              in: idsToDelete
            }
          }
        });

        // Decrement storage for each affected user
        for (const [userId, delta] of userStorageDelta.entries()) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              storageUsed: { decrement: delta.bytes },
              fileCount: { decrement: delta.count }
            }
          }).catch(() => {});
        }

        logger.info({ purgedCount: count }, '✅ Successfully purged expired recycle bin items');
      }
    } catch (err) {
      logger.error({ err: err.message }, '❌ Error in scheduled cleanup task');
    }
  });

  logger.info('🕒 Enterprise Cron Jobs initialized');
}

module.exports = {
  initCronJobs
};
