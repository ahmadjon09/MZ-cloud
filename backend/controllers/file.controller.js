/**
 * File Controller (Production Quality)
 * API endpoints for managing Saved Messages / File items & parallel upload batching
 * Includes live Telegram CDN thumbnail streaming
 */
const axios = require('axios');
const fileService = require('../services/file.service');
const uploadQueue = require('../queues/upload.queue');
const telegramBot = require('../telegram/bot');
const logger = require('../config/logger');

class FileController {
  async listFiles(req, res, next) {
    try {
      const options = {
        category: req.query.category || 'ALL',
        folderId: req.query.folderId,
        isFavorite: req.query.isFavorite ? req.query.isFavorite === 'true' : undefined,
        isPinned: req.query.isPinned ? req.query.isPinned === 'true' : undefined,
        isArchived: req.query.isArchived ? req.query.isArchived === 'true' : undefined,
        isDeleted: req.query.isDeleted === 'true',
        search: req.query.search || req.query.q,
        tag: req.query.tag,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc',
        limit: parseInt(req.query.limit || '50', 10),
        offset: parseInt(req.query.offset || '0', 10)
      };

      const result = await fileService.listFiles(req.user.id, options);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async getFileById(req, res, next) {
    try {
      const file = await fileService.getFileById(req.params.id, req.user.id);
      if (!file) {
        return res.status(404).json({
          success: false,
          error: { code: 'ERR_NOT_FOUND', message: 'File not found' }
        });
      }
      return res.status(200).json({
        success: true,
        data: { file }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Securely stream Telegram CDN photo or thumbnail to the WebApp gallery
   */
  async getThumbnail(req, res, next) {
    try {
      const file = await fileService.getFileById(req.params.id, req.user.id);
      if (!file) {
        return res.status(404).json({
          success: false,
          error: { code: 'ERR_NOT_FOUND', message: 'File not found or access denied' }
        });
      }

      // If file has an explicit thumbnail URL, redirect to it
      if (file.thumbnailUrl) {
        return res.redirect(file.thumbnailUrl);
      }

      // Attempt to stream live image from Telegram CDN via Bot API
      const bot = telegramBot.getBot();
      if (bot && bot.telegram && file.fileId) {
        try {
          const cdnLink = await bot.telegram.getFileLink(file.fileId);
          const cdnUrl = cdnLink.href || cdnLink.toString();

          const cdnResponse = await axios({
            url: cdnUrl,
            method: 'GET',
            responseType: 'stream'
          });

          res.setHeader('Content-Type', cdnResponse.headers['content-type'] || 'image/jpeg');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return cdnResponse.data.pipe(res);
        } catch (cdnErr) {
          logger.warn({ err: cdnErr.message, fileId: file.fileId }, 'Could not stream from Telegram CDN, using fallback image');
        }
      }

      // Fallback clean SVG if Telegram API is offline/simulated
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
        <rect width="600" height="400" fill="#1e2329"/>
        <circle cx="300" cy="180" r="48" fill="#2481cc" opacity="0.2"/>
        <path d="M280 180L320 180M300 160L300 200" stroke="#2481cc" stroke-width="6" stroke-linecap="round"/>
        <text x="300" y="270" fill="#a0aec0" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">${file.fileName}</text>
        <text x="300" y="300" fill="#718096" font-family="sans-serif" font-size="14" text-anchor="middle">Telegram CDN Cloud Photo</text>
      </svg>`;

      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.status(200).send(svg);
    } catch (err) {
      next(err);
    }
  }

  async createSingleFile(req, res, next) {
    try {
      const created = await fileService.registerTelegramFile(
        req.user.id,
        req.validatedBody || req.body,
        req.app.get('io')
      );
      return res.status(201).json({
        success: true,
        data: { file: created }
      });
    } catch (err) {
      next(err);
    }
  }

  async parallelUpload(req, res, next) {
    try {
      const { files } = req.validatedBody || req.body;
      if (!Array.isArray(files) || files.length === 0) {
        return res.status(400).json({
          success: false,
          error: { code: 'ERR_VALIDATION', message: 'Array of files is required' }
        });
      }

      if (files.length <= 20) {
        const createdFiles = await fileService.registerParallelTelegramFiles(
          req.user.id,
          files,
          req.app.get('io')
        );
        return res.status(201).json({
          success: true,
          data: {
            count: createdFiles.length,
            files: createdFiles,
            processedImmediately: true
          }
        });
      }

      const jobId = await uploadQueue.enqueueBatch(req.user.id, files, req.app.get('io'));

      return res.status(202).json({
        success: true,
        data: {
          jobId,
          message: `${files.length} files queued for parallel background processing`,
          processedImmediately: false
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async updateFile(req, res, next) {
    try {
      const updated = await fileService.updateFileMetadata(
        req.params.id,
        req.user.id,
        req.validatedBody || req.body,
        req.app.get('io')
      );
      return res.status(200).json({
        success: true,
        data: { file: updated }
      });
    } catch (err) {
      next(err);
    }
  }

  async moveFile(req, res, next) {
    try {
      const { folderId } = req.body;
      const updated = await fileService.moveToFolder(
        req.params.id,
        req.user.id,
        folderId,
        req.app.get('io')
      );
      return res.status(200).json({
        success: true,
        data: { file: updated }
      });
    } catch (err) {
      next(err);
    }
  }

  async shareFile(req, res, next) {
    try {
      const shareResult = await fileService.generateShareLink(req.params.id, req.user.id);
      return res.status(200).json({
        success: true,
        data: shareResult
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteToRecycleBin(req, res, next) {
    try {
      await fileService.softDeleteFile(req.params.id, req.user.id, req.app.get('io'));
      return res.status(200).json({
        success: true,
        data: { message: 'File moved to recycle bin' }
      });
    } catch (err) {
      next(err);
    }
  }

  async restoreFromRecycleBin(req, res, next) {
    try {
      const restored = await fileService.restoreFile(req.params.id, req.user.id, req.app.get('io'));
      return res.status(200).json({
        success: true,
        data: { file: restored, message: 'File restored successfully' }
      });
    } catch (err) {
      next(err);
    }
  }

  async permanentDelete(req, res, next) {
    try {
      const result = await fileService.permanentDeleteFile(
        req.params.id,
        req.user.id,
        req.app.get('io')
      );
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async emptyRecycleBin(req, res, next) {
    try {
      const result = await fileService.emptyRecycleBin(req.user.id, req.app.get('io'));
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new FileController();
