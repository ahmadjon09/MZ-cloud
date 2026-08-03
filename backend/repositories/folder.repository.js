/**
 * Folder Repository
 * Strict Multi-Tenant Data Isolation: Every query enforces userId matching
 */
const prisma = require('../config/database');

class FolderRepository {
  async createFolder({ userId, name, parentId, color, emoji, isSmart = false, smartFilter = null }) {
    return prisma.folder.create({
      data: {
        userId: String(userId),
        name,
        parentId: parentId || null,
        color: color || '#2481cc',
        emoji: emoji || '📁',
        isSmart: Boolean(isSmart),
        smartFilter: smartFilter || null
      }
    });
  }

  async findById(folderId, userId) {
    if (!folderId || !userId) return null;
    return prisma.folder.findFirst({
      where: {
        id: String(folderId),
        userId: String(userId),
        deletedAt: null
      },
      include: {
        _count: {
          select: { files: true, children: true }
        }
      }
    });
  }

  async listByUser(userId, { includeHidden = false } = {}) {
    if (!userId) {
      throw new Error('UserId is required for folder isolation');
    }

    const where = {
      userId: String(userId),
      deletedAt: null
    };
    if (!includeHidden) {
      where.isHidden = false;
    }

    return prisma.folder.findMany({
      where,
      orderBy: [
        { isPinned: 'desc' },
        { isFavorite: 'desc' },
        { name: 'asc' }
      ],
      include: {
        _count: {
          select: { files: true }
        }
      }
    });
  }

  async updateFolder(folderId, userId, data) {
    const existing = await this.findById(folderId, userId);
    if (!existing) {
      throw new Error('Folder not found or access denied');
    }

    return prisma.folder.update({
      where: { id: String(folderId) },
      data: {
        name: data.name,
        color: data.color,
        emoji: data.emoji,
        parentId: data.parentId !== undefined ? data.parentId : undefined,
        isFavorite: data.isFavorite !== undefined ? data.isFavorite : undefined,
        isPinned: data.isPinned !== undefined ? data.isPinned : undefined,
        isHidden: data.isHidden !== undefined ? data.isHidden : undefined
      }
    });
  }

  async softDeleteFolder(folderId, userId) {
    const existing = await this.findById(folderId, userId);
    if (!existing) {
      throw new Error('Folder not found or access denied');
    }

    const now = new Date();
    // First update files in this folder to have null folderId so they aren't orphaned
    await prisma.fileItem.updateMany({
      where: { folderId: String(folderId), userId: String(userId) },
      data: { folderId: null }
    });

    return prisma.folder.update({
      where: { id: String(folderId) },
      data: { deletedAt: now }
    });
  }

  /**
   * Build nested tree from flat list of folders
   */
  buildTree(flatFolders) {
    const folderMap = new Map();
    const rootFolders = [];

    flatFolders.forEach((f) => {
      folderMap.set(f.id, { ...f, children: [] });
    });

    flatFolders.forEach((f) => {
      const node = folderMap.get(f.id);
      if (f.parentId && folderMap.has(f.parentId)) {
        folderMap.get(f.parentId).children.push(node);
      } else {
        rootFolders.push(node);
      }
    });

    return rootFolders;
  }
}

module.exports = new FolderRepository();
