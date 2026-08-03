/**
 * Audit Log Repository
 */
const prisma = require('../config/database');

class AuditRepository {
  async createLog({ userId, action, resourceType, resourceId, details, ipAddress }) {
    try {
      return await prisma.auditLog.create({
        data: {
          userId: userId || null,
          action,
          resourceType,
          resourceId: resourceId || null,
          details: typeof details === 'object' ? JSON.stringify(details) : details || null,
          ipAddress: ipAddress || null
        }
      });
    } catch (err) {
      // Avoid failing main transaction on audit log errors
      console.error('AuditLog error:', err.message);
      return null;
    }
  }

  async listLogs({ limit = 50, offset = 0, action, userId }) {
    const where = {};
    if (action) where.action = action;
    if (userId) where.userId = userId;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        take: Number(limit),
        skip: Number(offset),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              telegramId: true,
              username: true,
              firstName: true
            }
          }
        }
      }),
      prisma.auditLog.count({ where })
    ]);

    return { logs, total };
  }
}

module.exports = new AuditRepository();
