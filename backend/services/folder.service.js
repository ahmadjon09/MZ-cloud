/**
 * Folder Service
 * Manage folders, nested folder tree, smart folders, and breadcrumb navigation
 */
const folderRepository = require('../repositories/folder.repository');
const { FOLDER_CREATED, FOLDER_UPDATED, FOLDER_DELETED } = require('../constants/events');

class FolderService {
  async createFolder(userId, { name, parentId, color, emoji, isSmart, smartFilter }, io = null) {
    if (!name || name.trim() === '') {
      throw new Error('Folder name is required');
    }

    const folder = await folderRepository.createFolder({
      userId,
      name: name.trim(),
      parentId: parentId || null,
      color: color || '#2481cc',
      emoji: emoji || '📁',
      isSmart: Boolean(isSmart),
      smartFilter: smartFilter || null
    });

    if (io) {
      io.to(`user:${userId}`).emit(FOLDER_CREATED, { folder });
    }

    return folder;
  }

  async listFolders(userId, { tree = false, includeHidden = false } = {}) {
    const folders = await folderRepository.listByUser(userId, { includeHidden });
    if (tree) {
      return folderRepository.buildTree(folders);
    }
    return folders;
  }

  async getFolderById(folderId, userId) {
    return folderRepository.findById(folderId, userId);
  }

  async getBreadcrumbs(folderId, userId) {
    if (!folderId || folderId === 'ROOT') {
      return [];
    }

    const breadcrumbs = [];
    let currentId = folderId;
    const maxDepth = 10;
    let depth = 0;

    while (currentId && depth < maxDepth) {
      const folder = await folderRepository.findById(currentId, userId);
      if (!folder) break;
      breadcrumbs.unshift({
        id: folder.id,
        name: folder.name,
        emoji: folder.emoji,
        color: folder.color
      });
      currentId = folder.parentId;
      depth++;
    }

    return breadcrumbs;
  }

  async updateFolder(folderId, userId, updateData, io = null) {
    const updated = await folderRepository.updateFolder(folderId, userId, updateData);

    if (io) {
      io.to(`user:${userId}`).emit(FOLDER_UPDATED, { folder: updated });
    }
    return updated;
  }

  async deleteFolder(folderId, userId, io = null) {
    const updated = await folderRepository.softDeleteFolder(folderId, userId);

    if (io) {
      io.to(`user:${userId}`).emit(FOLDER_DELETED, { id: folderId });
    }
    return updated;
  }
}

module.exports = new FolderService();
