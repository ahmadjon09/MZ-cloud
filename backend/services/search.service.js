/**
 * Global Search Service
 * Full-Text Search + Redis Cache for Instant Telegram Cloud Storage Search
 */
const fileRepository = require('../repositories/file.repository');
const folderRepository = require('../repositories/folder.repository');
const redisClient = require('../config/redis');

class SearchService {
  /**
   * Global search across files, folders, notes, tags, captions, and extensions
   * Cached in Redis for instant responsiveness
   */
  async globalSearch(userId, query, options = {}) {
    const {
      category,
      folderId,
      tag,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 30,
      offset = 0
    } = options;

    const cacheKey = `tgcloud:search:${userId}:${query || 'ALL'}:${category || 'ALL'}:${folderId || 'ALL'}:${tag || 'NONE'}:${sortBy}:${sortOrder}:${limit}:${offset}`;

    // 1. Check Redis cache
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      // Continue without cache if error
    }

    // 2. Perform File search
    const fileResults = await fileRepository.listFiles(userId, {
      search: query,
      category,
      folderId,
      tag,
      sortBy,
      sortOrder,
      limit,
      offset,
      isDeleted: false
    });

    // 3. If searching by query, also search user folders
    let matchedFolders = [];
    if (query && query.trim() !== '' && offset === 0) {
      const allFolders = await folderRepository.listByUser(userId);
      const lowerQ = query.trim().toLowerCase();
      matchedFolders = allFolders.filter((f) => f.name.toLowerCase().includes(lowerQ));
    }

    const payload = {
      query: query || '',
      totalFiles: fileResults.total,
      files: fileResults.files,
      folders: matchedFolders,
      limit: Number(limit),
      offset: Number(offset)
    };

    // 4. Cache in Redis for 60 seconds
    try {
      await redisClient.setex(cacheKey, 60, JSON.stringify(payload));
    } catch (e) {
      // ignore non-fatal cache errors
    }

    return payload;
  }
}

module.exports = new SearchService();
