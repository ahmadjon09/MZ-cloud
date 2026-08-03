/**
 * File Service
 * Business Logic for Telegram File Items & Parallel Upload Processing
 * Enforces Telegram Bot CDN Size Limits (Photos <= 10MB, Videos/Docs/Audio <= 50MB)
 * NEVER stores media files on server disk; stores ONLY Telegram CDN references in PostgreSQL
 */
const crypto = require('crypto');
const fileRepository = require('../repositories/file.repository');
const userRepository = require('../repositories/user.repository');
const auditRepository = require('../repositories/audit.repository');
const redisClient = require('../config/redis');
const { classifyFileType, validateTelegramMediaLimits } = require('../constants/file-types');
const { UPLOAD_COMPLETED, FILE_UPDATED, FILE_DELETED, FILE_RESTORED } = require('../constants/events');

class FileService {
  /**
   * Process single file item registration from Telegram CDN
   */
  async registerTelegramFile(userId, filePayload, io = null) {
    const category = classifyFileType(filePayload.fileName, filePayload.mimeType);

    // Verify Telegram CDN Bot size limits (10 MB for Photo, 50 MB for general)
    const limitCheck = validateTelegramMediaLimits(category, filePayload.fileSize);
    if (!limitCheck.valid) {
      throw new Error(limitCheck.message);
    }

    const fileData = {
      ...filePayload,
      userId,
      category,
      extension: filePayload.fileName?.split('.').pop()?.toLowerCase() || 'bin',
      tags: Array.isArray(filePayload.tags) ? filePayload.tags : []
    };

    const file = await fileRepository.createFile(fileData);

    // Update user storage footprint
    await userRepository.incrementStorage(userId, file.fileSize, 1);

    // Invalidate user search cache
    await this.invalidateUserSearchCache(userId);

    // Create audit log
    await auditRepository.createLog({
      userId,
      action: 'FILE_UPLOAD',
      resourceType: 'FILE',
      resourceId: file.id,
      details: { fileName: file.fileName, category, fileSize: file.fileSize, cdnStorage: true }
    });

    if (io) {
      io.to(`user:${userId}`).emit(UPLOAD_COMPLETED, { file });
    }

    return file;
  }

  /**
   * Process batch parallel upload of multiple Telegram CDN files
   * Used when user sends 10, 100, 500 files or demo uploader is triggered
   */
  async registerParallelTelegramFiles(userId, filesPayloadArray, io = null) {
    if (!Array.isArray(filesPayloadArray) || filesPayloadArray.length === 0) {
      return [];
    }

    let totalBytes = 0;
    const recordsToCreate = [];

    for (const f of filesPayloadArray) {
      const category = classifyFileType(f.fileName, f.mimeType);
      const ext = f.fileName?.split('.').pop()?.toLowerCase() || 'bin';
      const size = Number(f.fileSize || 0);

      // Verify Telegram CDN Bot size limits (10 MB for Photo, 50 MB for general)
      const limitCheck = validateTelegramMediaLimits(category, size);
      if (!limitCheck.valid) {
        // Skip files exceeding Telegram Bot size limit in bulk upload or throw
        console.warn(`Skipping file [${f.fileName}] in batch: ${limitCheck.message}`);
        continue;
      }

      totalBytes += size;
      recordsToCreate.push({
        ...f,
        userId,
        category,
        extension: ext,
        tags: Array.isArray(f.tags) ? f.tags : []
      });
    }

    if (recordsToCreate.length === 0) {
      throw new Error('Barcha fayllar hajmi Telegram Bot limitlaridan (10 MB rasm / 50 MB boshqalar) oshadi!');
    }

    const createdFiles = await fileRepository.bulkCreateFiles(recordsToCreate);

    // Batch update storage
    await userRepository.incrementStorage(userId, totalBytes, createdFiles.length);

    // Invalidate user cache
    await this.invalidateUserSearchCache(userId);

    // Create audit log
    await auditRepository.createLog({
      userId,
      action: 'BULK_FILE_UPLOAD',
      resourceType: 'FILE',
      details: { count: createdFiles.length, totalBytes, cdnStorage: true }
    });

    if (io) {
      io.to(`user:${userId}`).emit(UPLOAD_COMPLETED, { count: createdFiles.length, files: createdFiles });
    }

    return createdFiles;
  }

  async getFileById(id, userId) {
    return fileRepository.findById(id, userId);
  }

  async listFiles(userId, options = {}) {
    return fileRepository.listFiles(userId, options);
  }

  async updateFileMetadata(id, userId, updateData, io = null) {
    const updated = await fileRepository.updateFile(id, userId, updateData);
    await this.invalidateUserSearchCache(userId);

    if (io) {
      io.to(`user:${userId}`).emit(FILE_UPDATED, { file: updated });
    }
    return updated;
  }

  async moveToFolder(id, userId, folderId, io = null) {
    const updated = await fileRepository.updateFile(id, userId, { folderId });
    if (io) {
      io.to(`user:${userId}`).emit(FILE_UPDATED, { file: updated });
    }
    return updated;
  }

  async generateShareLink(id, userId) {
    const shareToken = crypto.randomBytes(16).toString('hex');
    const updated = await fileRepository.updateFile(id, userId, { shareToken });
    return {
      shareToken,
      shareUrl: `${process.env.WEBAPP_URL || 'http://localhost:5173'}/share/${shareToken}`,
      file: updated
    };
  }

  async getByShareToken(token) {
    return fileRepository.findByShareToken(token);
  }

  async softDeleteFile(id, userId, io = null) {
    const file = await fileRepository.findById(id, userId);
    if (!file) {
      throw new Error('File not found');
    }
    const updated = await fileRepository.softDeleteFile(id, userId);
    await this.invalidateUserSearchCache(userId);

    if (io) {
      io.to(`user:${userId}`).emit(FILE_DELETED, { id, userId });
    }
    return updated;
  }

  async restoreFile(id, userId, io = null) {
    const updated = await fileRepository.restoreFile(id, userId);
    await this.invalidateUserSearchCache(userId);

    if (io) {
      io.to(`user:${userId}`).emit(FILE_RESTORED, { file: updated });
    }
    return updated;
  }

  async permanentDeleteFile(id, userId, io = null) {
    const file = await fileRepository.findById(id, userId);
    if (!file) {
      throw new Error('File not found');
    }

    await fileRepository.permanentDeleteFile(id, userId);
    await userRepository.decrementStorage(userId, file.fileSize, 1);
    await this.invalidateUserSearchCache(userId);

    if (io) {
      io.to(`user:${userId}`).emit(FILE_DELETED, { id, userId, permanent: true });
    }
    return { success: true, deletedId: id };
  }

  async emptyRecycleBin(userId, io = null) {
    const count = await fileRepository.emptyRecycleBin(userId);
    await this.invalidateUserSearchCache(userId);

    if (io) {
      io.to(`user:${userId}`).emit(FILE_DELETED, { emptyRecycleBin: true, count });
    }
    return { success: true, count };
  }

  async invalidateUserSearchCache(userId) {
    try {
      const keys = await redisClient.keys(`tgcloud:search:${userId}:*`);
      if (keys && keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (e) {
      // ignore non-fatal cache clear errors
    }
  }
}

module.exports = new FileService();
