/**
 * File Controller (Production Quality - MZ-CLOUD)
 * API endpoints for managing Saved Messages / File items & parallel upload batching
 * Features HTTP Range-supporting Telegram CDN media streaming (/preview, /stream, /thumbnail, /download)
 * Zero default audio/video fallbacks; streams real Telegram CDN media
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
   * Universal Telegram CDN Media Streamer (HTTP Range Supported)
   * Handles /preview, /stream, /thumbnail, /download
   * Forwards Range headers (bytes=0-) so <video> and <audio> seeking works natively
   */
  async streamTelegramFile(req, res, next) {
    try {
      const file = await fileService.getFileById(req.params.id, req.user.id);
      if (!file) {
        return res.status(404).json({
          success: false,
          error: { code: 'ERR_NOT_FOUND', message: 'File not found or access denied' }
        });
      }

      if (file.thumbnailUrl && req.path.includes('thumbnail')) {
        return res.redirect(file.thumbnailUrl);
      }

      const bot = telegramBot.getBot();
      if (!bot || !bot.telegram || !file.fileId) {
        return res.status(502).json({
          success: false,
          error: {
            code: 'ERR_TELEGRAM_CDN',
            message: 'Telegram Bot CDN token is offline or fileId missing. Connect a live TELEGRAM_BOT_TOKEN to stream original CDN files.'
          }
        });
      }

      try {
        const cdnLink = await bot.telegram.getFileLink(file.fileId);
        const cdnUrl = cdnLink.href || cdnLink.toString();

        const range = req.headers.range; // e.g. "bytes=0-"
        const requestHeaders = {};
        if (range) {
          requestHeaders['Range'] = range;
        }

        const cdnResponse = await axios({
          url: cdnUrl,
          method: 'GET',
          headers: requestHeaders,
          responseType: 'stream',
          validateStatus: (status) => status === 200 || status === 206
        });

        // Forward HTTP status (200 OK or 206 Partial Content)
        res.status(cdnResponse.status);

        const ct = file.mimeType || cdnResponse.headers['content-type'] || 'application/octet-stream';
        res.setHeader('Content-Type', ct);

        const isDownload = req.query.download === 'true';
        res.setHeader(
          'Content-Disposition',
          `${isDownload ? 'attachment' : 'inline'}; filename="${encodeURIComponent(file.fileName)}"`
        );

        // Forward Range and caching headers essential for HTML5 <video> & <audio> seeking
        const cr = cdnResponse.headers['content-range'];
        const al = cdnResponse.headers['accept-ranges'] || 'bytes';
        const cl = cdnResponse.headers['content-length'];

        if (cr) res.setHeader('Content-Range', cr);
        if (al) res.setHeader('Accept-Ranges', al);
        if (cl) res.setHeader('Content-Length', cl);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

        return cdnResponse.data.pipe(res);
      } catch (cdnErr) {
        logger.error({ err: cdnErr.message, fileId: file.fileId }, 'Telegram CDN stream failed');
        const msg = String(cdnErr?.message || cdnErr);
        if (msg.includes('file is too big')) {
          return res.status(413).json({ error: 'FILE_TOO_BIG_FOR_PREVIEW' });
        }
        return res.status(502).json({ error: 'Telegram fetch failed: ' + msg });
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * "Send by Telegram" — Sends/forwards the Telegram CDN file directly back to the user's own Telegram chat
   */
  async sendToTelegram(req, res, next) {
    try {
      const file = await fileService.getFileById(req.params.id, req.user.id);
      if (!file) {
        return res.status(404).json({
          success: false,
          error: { code: 'ERR_NOT_FOUND', message: 'File not found or access denied' }
        });
      }

      const bot = telegramBot.getBot();
      const targetTelegramId = req.user.telegramId;

      const sizeMb = (file.fileSize / 1024 / 1024).toFixed(2);
      const captionText = `☁️ <b>MZ-CLOUD — Telegram CDN Fayl:</b>\n\n` +
        `📄 <b>Nomi:</b> <code>${file.fileName}</code>\n` +
        `📦 <b>Hajmi:</b> <code>${sizeMb} MB</code>\n` +
        `🏷️ <b>Toifa:</b> <code>#${file.category}</code>\n` +
        (file.caption ? `💬 <b>Izoh:</b> <i>${file.caption}</i>\n` : '') +
        `\nFaylni ko'rish va boshqarish uchun MZ-CLOUD ilovasini oching:`;

      const replyMarkup = {
        inline_keyboard: [
          [
            {
              text: '🌐 MZ-CLOUD da ochish / Open App',
              web_app: { url: (process.env.WEBAPP_URL || 'https://mz-cloud.vercel.app') + `/?file=${file.id}` }
            }
          ]
        ]
      };

      if (bot && bot.telegram && file.fileId) {
        try {
          if (file.category === 'PHOTO') {
            await bot.telegram.sendPhoto(targetTelegramId, file.fileId, {
              caption: captionText,
              parse_mode: 'HTML',
              reply_markup: replyMarkup
            });
          } else if (file.category === 'VIDEO') {
            await bot.telegram.sendVideo(targetTelegramId, file.fileId, {
              caption: captionText,
              parse_mode: 'HTML',
              reply_markup: replyMarkup
            });
          } else if (file.category === 'AUDIO') {
            await bot.telegram.sendAudio(targetTelegramId, file.fileId, {
              caption: captionText,
              parse_mode: 'HTML',
              reply_markup: replyMarkup
            });
          } else if (file.category === 'VOICE') {
            await bot.telegram.sendVoice(targetTelegramId, file.fileId, {
              caption: captionText,
              parse_mode: 'HTML',
              reply_markup: replyMarkup
            });
          } else {
            await bot.telegram.sendDocument(targetTelegramId, file.fileId, {
              caption: captionText,
              parse_mode: 'HTML',
              reply_markup: replyMarkup
            });
          }

          logger.info({ userId: req.user.id, telegramId: targetTelegramId, fileId: file.id }, '✈️ File sent by Telegram to user chat');

          return res.status(200).json({
            success: true,
            data: {
              sent: true,
              message: 'Fayl Telegram chatingizga yuborildi!'
            }
          });
        } catch (tgErr) {
          logger.warn({ err: tgErr.message, fileId: file.id }, 'Failed to send file via Telegram API');
          return res.status(500).json({
            success: false,
            error: {
              code: 'ERR_TELEGRAM_API',
              message: 'Telegram chatingizga yuborishda xatolik: ' + tgErr.message
            }
          });
        }
      }

      logger.info({ fileId: file.id }, '✈️ Simulated sendToTelegram in dev mode');
      return res.status(200).json({
        success: true,
        data: {
          sent: true,
          simulated: true,
          message: 'Fayl Telegram testing bot rejimida yuborildi (simulated)!'
        }
      });
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
