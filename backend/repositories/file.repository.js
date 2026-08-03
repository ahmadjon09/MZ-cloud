/**
 * File Repository (MZ-CLOUD)
 * Enterprise Data Access for Telegram File Items
 * Strict Multi-Tenant Data Isolation: Matches by user CUID OR user.telegramId to guarantee zero missing files
 */
const prisma = require('../config/database');

class FileRepository {
  async createFile(data) {
    return prisma.fileItem.create({
      data: {
        userId: data.userId,
        folderId: data.folderId || null,
        fileId: data.fileId,
        uniqueFileId: data.uniqueFileId,
        fileName: data.fileName,
        fileSize: Number(data.fileSize || 0),
        mimeType: data.mimeType || 'application/octet-stream',
        extension: data.extension || 'bin',
        category: data.category || 'OTHER',
        duration: data.duration ? Number(data.duration) : null,
        width: data.width ? Number(data.width) : null,
        height: data.height ? Number(data.height) : null,
        thumbnailUrl: data.thumbnailUrl || null,
        caption: data.caption || null,
        userNotes: data.userNotes || null,
        tags: Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags || '[]',
        telegramMessageId: data.telegramMessageId ? Number(data.telegramMessageId) : null,
        searchVector: `${data.fileName || ''} ${data.caption || ''} ${data.userNotes || ''} ${data.extension || ''}`.toLowerCase()
      }
    });
  }

  async bulkCreateFiles(filesArray) {
    const records = filesArray.map((data) => ({
      userId: data.userId,
      folderId: data.folderId || null,
      fileId: data.fileId,
      uniqueFileId: data.uniqueFileId,
      fileName: data.fileName,
      fileSize: Number(data.fileSize || 0),
      mimeType: data.mimeType || 'application/octet-stream',
      extension: data.extension || 'bin',
      category: data.category || 'OTHER',
      duration: data.duration ? Number(data.duration) : null,
      width: data.width ? Number(data.width) : null,
      height: data.height ? Number(data.height) : null,
      thumbnailUrl: data.thumbnailUrl || null,
      caption: data.caption || null,
      userNotes: data.userNotes || null,
      tags: Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags || '[]',
      telegramMessageId: data.telegramMessageId ? Number(data.telegramMessageId) : null,
      searchVector: `${data.fileName || ''} ${data.caption || ''} ${data.userNotes || ''} ${data.extension || ''}`.toLowerCase()
    }));

    return prisma.$transaction(async (tx) => {
      const results = [];
      for (const rec of records) {
        const created = await tx.fileItem.create({ data: rec });
        results.push(created);
      }
      return results;
    });
  }

  /**
   * Strictly find by id AND (userId OR telegramId) to guarantee data isolation
   */
  async findById(id, userId) {
    if (!id || !userId) return null;
    return prisma.fileItem.findFirst({
      where: {
        id: String(id),
        OR: [
          { userId: String(userId) },
          { user: { telegramId: String(userId) } }
        ]
      },
      include: {
        folder: {
          select: { id: true, name: true, color: true, emoji: true }
        }
      }
    });
  }

  async findByTelegramUniqueId(uniqueFileId, userId) {
    return prisma.fileItem.findFirst({
      where: {
        uniqueFileId: String(uniqueFileId),
        OR: [
          { userId: String(userId) },
          { user: { telegramId: String(userId) } }
        ],
        isDeleted: false
      }
    });
  }

  async findByShareToken(shareToken) {
    return prisma.fileItem.findUnique({
      where: { shareToken },
      include: {
        user: {
          select: { username: true, firstName: true }
        }
      }
    });
  }

  async listFiles(userId, options = {}) {
    if (!userId) {
      throw new Error('UserId is required for data isolation');
    }

    const {
      category,
      folderId,
      isFavorite,
      isPinned,
      isArchived,
      isDeleted = false,
      search,
      tag,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 50,
      offset = 0
    } = options;

    // Multi-tenant isolation: matches userId OR user's telegramId
    const where = {
      isDeleted: Boolean(isDeleted),
      OR: [
        { userId: String(userId) },
        { user: { telegramId: String(userId) } }
      ]
    };

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (folderId !== undefined && folderId !== null && folderId !== 'ALL') {
      if (folderId === 'ROOT' || folderId === 'NONE') {
        where.folderId = null;
      } else {
        where.folderId = folderId;
      }
    }

    if (isFavorite !== undefined && isFavorite !== null) {
      where.isFavorite = Boolean(isFavorite);
    }
    if (isPinned !== undefined && isPinned !== null) {
      where.isPinned = Boolean(isPinned);
    }
    if (isArchived !== undefined && isArchived !== null) {
      where.isArchived = Boolean(isArchived);
    }

    if (tag) {
      where.tags = {
        contains: `"${tag}"`
      };
    }

    if (search && search.trim() !== '') {
      const query = search.trim().toLowerCase();
      where.AND = [
        {
          OR: [
            { fileName: { contains: search } },
            { caption: { contains: search } },
            { userNotes: { contains: search } },
            { extension: { equals: query } },
            { tags: { contains: query } }
          ]
        }
      ];
    }

    const orderBy = {};
    if (sortBy === 'name' || sortBy === 'fileName') {
      orderBy.fileName = sortOrder === 'asc' ? 'asc' : 'desc';
    } else if (sortBy === 'size' || sortBy === 'fileSize') {
      orderBy.fileSize = sortOrder === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.createdAt = sortOrder === 'asc' ? 'asc' : 'desc';
    }

    const [files, total] = await Promise.all([
      prisma.fileItem.findMany({
        where,
        take: Number(limit),
        skip: Number(offset),
        orderBy: [
          { isPinned: 'desc' },
          orderBy
        ],
        include: {
          folder: {
            select: { id: true, name: true, color: true, emoji: true }
          }
        }
      }),
      prisma.fileItem.count({ where })
    ]);

    return {
      files,
      total,
      limit: Number(limit),
      offset: Number(offset)
    };
  }

  async updateFile(id, userId, data) {
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new Error('File not found or access denied');
    }

    const updatePayload = {};
    if (data.fileName !== undefined) updatePayload.fileName = data.fileName;
    if (data.folderId !== undefined) updatePayload.folderId = data.folderId || null;
    if (data.caption !== undefined) updatePayload.caption = data.caption;
    if (data.userNotes !== undefined) updatePayload.userNotes = data.userNotes;
    if (data.tags !== undefined) {
      updatePayload.tags = Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags;
    }
    if (data.isFavorite !== undefined) updatePayload.isFavorite = Boolean(data.isFavorite);
    if (data.isPinned !== undefined) updatePayload.isPinned = Boolean(data.isPinned);
    if (data.isArchived !== undefined) updatePayload.isArchived = Boolean(data.isArchived);
    if (data.shareToken !== undefined) updatePayload.shareToken = data.shareToken;

    if (data.fileName || data.caption || data.userNotes) {
      updatePayload.searchVector = `${data.fileName || ''} ${data.caption || ''} ${data.userNotes || ''}`.toLowerCase();
    }

    return prisma.fileItem.update({
      where: { id: String(id) },
      data: updatePayload,
      include: {
        folder: {
          select: { id: true, name: true, color: true, emoji: true }
        }
      }
    });
  }

  async softDeleteFile(id, userId) {
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new Error('File not found or access denied');
    }

    return prisma.fileItem.update({
      where: { id: String(id) },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    });
  }

  async restoreFile(id, userId) {
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new Error('File not found or access denied');
    }

    return prisma.fileItem.update({
      where: { id: String(id) },
      data: {
        isDeleted: false,
        deletedAt: null
      }
    });
  }

  async permanentDeleteFile(id, userId) {
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new Error('File not found or access denied');
    }

    return prisma.fileItem.delete({
      where: { id: String(id) }
    });
  }

  async emptyRecycleBin(userId) {
    if (!userId) return 0;
    const deletedItems = await prisma.fileItem.findMany({
      where: {
        isDeleted: true,
        OR: [
          { userId: String(userId) },
          { user: { telegramId: String(userId) } }
        ]
      }
    });
    const count = deletedItems.length;
    await prisma.fileItem.deleteMany({
      where: {
        isDeleted: true,
        OR: [
          { userId: String(userId) },
          { user: { telegramId: String(userId) } }
        ]
      }
    });
    return count;
  }

  async getUserMediaStatistics(userId) {
    if (!userId) return { totalFiles: 0, totalSize: 0, categories: {} };
    const stats = await prisma.fileItem.groupBy({
      by: ['category'],
      where: {
        isDeleted: false,
        OR: [
          { userId: String(userId) },
          { user: { telegramId: String(userId) } }
        ]
      },
      _count: { _all: true },
      _sum: { fileSize: true }
    });

    const categoryBreakdown = {};
    let totalFiles = 0;
    let totalSize = 0;

    stats.forEach((row) => {
      categoryBreakdown[row.category] = {
        count: row._count._all,
        size: row._sum.fileSize || 0
      };
      totalFiles += row._count._all;
      totalSize += row._sum.fileSize || 0;
    });

    return {
      totalFiles,
      totalSize,
      categories: categoryBreakdown
    };
  }
}

module.exports = new FileRepository();
