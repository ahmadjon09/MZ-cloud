/**
 * Folder Controller
 */
const folderService = require('../services/folder.service');

class FolderController {
  async listFolders(req, res, next) {
    try {
      const tree = req.query.tree === 'true';
      const includeHidden = req.query.includeHidden === 'true';
      const folders = await folderService.listFolders(req.user.id, { tree, includeHidden });
      return res.status(200).json({
        success: true,
        data: { folders }
      });
    } catch (err) {
      next(err);
    }
  }

  async createFolder(req, res, next) {
    try {
      const created = await folderService.createFolder(
        req.user.id,
        req.validatedBody || req.body,
        req.app.get('io')
      );
      return res.status(201).json({
        success: true,
        data: { folder: created }
      });
    } catch (err) {
      next(err);
    }
  }

  async getFolderById(req, res, next) {
    try {
      const folder = await folderService.getFolderById(req.params.id, req.user.id);
      if (!folder) {
        return res.status(404).json({
          success: false,
          error: { code: 'ERR_NOT_FOUND', message: 'Folder not found' }
        });
      }
      return res.status(200).json({
        success: true,
        data: { folder }
      });
    } catch (err) {
      next(err);
    }
  }

  async getBreadcrumbs(req, res, next) {
    try {
      const breadcrumbs = await folderService.getBreadcrumbs(req.params.id, req.user.id);
      return res.status(200).json({
        success: true,
        data: { breadcrumbs }
      });
    } catch (err) {
      next(err);
    }
  }

  async updateFolder(req, res, next) {
    try {
      const updated = await folderService.updateFolder(
        req.params.id,
        req.user.id,
        req.validatedBody || req.body,
        req.app.get('io')
      );
      return res.status(200).json({
        success: true,
        data: { folder: updated }
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteFolder(req, res, next) {
    try {
      await folderService.deleteFolder(req.params.id, req.user.id, req.app.get('io'));
      return res.status(200).json({
        success: true,
        data: { message: 'Folder deleted successfully' }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new FolderController();
