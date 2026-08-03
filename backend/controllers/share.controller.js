/**
 * Share Link Controller
 */
const fileService = require('../services/file.service');

class ShareController {
  async getSharedFile(req, res, next) {
    try {
      const file = await fileService.getByShareToken(req.params.token);
      if (!file || file.isDeleted) {
        return res.status(404).json({
          success: false,
          error: { code: 'ERR_NOT_FOUND', message: 'Shared file not found or has been revoked.' }
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          file: {
            id: file.id,
            fileName: file.fileName,
            fileSize: file.fileSize,
            mimeType: file.mimeType,
            category: file.category,
            caption: file.caption,
            createdAt: file.createdAt,
            sharedBy: {
              firstName: file.user?.firstName || 'Telegram User',
              username: file.user?.username || null
            }
          }
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ShareController();
