/**
 * Telegram Bot Media / File Handler
 * Enforces Telegram CDN bot size limits (Photos <= 10MB, Videos/Audio/Docs <= 50MB)
 * NEVER stores real files on disk; stores ONLY Telegram CDN fileId & uniqueFileId in PostgreSQL
 */
const userRepository = require('../../repositories/user.repository');
const fileService = require('../../services/file.service');
const logger = require('../../config/logger');
const { classifyFileType, validateTelegramMediaLimits } = require('../../constants/file-types');
const { getBotI18n } = require('../i18n/messages');

async function handleIncomingMedia(ctx) {
  const telegramUser = ctx.from;
  if (!telegramUser) return;

  const user = await userRepository.upsertFromTelegram({
    telegramId: telegramUser.id,
    username: telegramUser.username,
    firstName: telegramUser.first_name,
    lastName: telegramUser.last_name,
    language: telegramUser.language_code,
    isPremium: telegramUser.is_premium
  });

  const i18n = getBotI18n(user.language);

  if (user.isBanned) {
    return ctx.reply('❌ You are banned from using this cloud storage platform.');
  }

  const message = ctx.message;
  let filePayload = null;

  if (message.document) {
    const doc = message.document;
    filePayload = {
      fileId: doc.file_id,
      uniqueFileId: doc.file_unique_id,
      fileName: doc.file_name || `document_${doc.file_unique_id}.bin`,
      fileSize: doc.file_size || 0,
      mimeType: doc.mime_type || 'application/octet-stream',
      caption: message.caption || null,
      telegramMessageId: message.message_id
    };
  } else if (message.photo && message.photo.length > 0) {
    const bestPhoto = message.photo[message.photo.length - 1];
    filePayload = {
      fileId: bestPhoto.file_id,
      uniqueFileId: bestPhoto.file_unique_id,
      fileName: `photo_${bestPhoto.file_unique_id}.jpg`,
      fileSize: bestPhoto.file_size || 0,
      mimeType: 'image/jpeg',
      width: bestPhoto.width,
      height: bestPhoto.height,
      caption: message.caption || null,
      telegramMessageId: message.message_id
    };
  } else if (message.video) {
    const vid = message.video;
    filePayload = {
      fileId: vid.file_id,
      uniqueFileId: vid.file_unique_id,
      fileName: vid.file_name || `video_${vid.file_unique_id}.mp4`,
      fileSize: vid.file_size || 0,
      mimeType: vid.mime_type || 'video/mp4',
      duration: vid.duration,
      width: vid.width,
      height: vid.height,
      caption: message.caption || null,
      telegramMessageId: message.message_id
    };
  } else if (message.audio) {
    const aud = message.audio;
    filePayload = {
      fileId: aud.file_id,
      uniqueFileId: aud.file_unique_id,
      fileName: aud.file_name || `audio_${aud.file_unique_id}.mp3`,
      fileSize: aud.file_size || 0,
      mimeType: aud.mime_type || 'audio/mpeg',
      duration: aud.duration,
      caption: message.caption || null,
      telegramMessageId: message.message_id
    };
  } else if (message.voice) {
    const voi = message.voice;
    filePayload = {
      fileId: voi.file_id,
      uniqueFileId: voi.file_unique_id,
      fileName: `voice_${voi.file_unique_id}.ogg`,
      fileSize: voi.file_size || 0,
      mimeType: voi.mime_type || 'audio/ogg',
      duration: voi.duration,
      caption: message.caption || null,
      telegramMessageId: message.message_id
    };
  } else if (message.video_note) {
    const vn = message.video_note;
    filePayload = {
      fileId: vn.file_id,
      uniqueFileId: vn.file_unique_id,
      fileName: `video_note_${vn.file_unique_id}.mp4`,
      fileSize: vn.file_size || 0,
      mimeType: 'video/mp4',
      duration: vn.duration,
      width: vn.length,
      height: vn.length,
      caption: message.caption || null,
      telegramMessageId: message.message_id
    };
  }

  if (!filePayload) {
    return ctx.reply(i18n.errorUnsupported, { parse_mode: 'HTML' });
  }

  // 1. Classify Category and check Telegram CDN Bot size limits
  // Photo <= 10 MB | Video / Audio / Document / Archive <= 50 MB
  const category = classifyFileType(filePayload.fileName, filePayload.mimeType);
  const sizeCheck = validateTelegramMediaLimits(category, filePayload.fileSize);

  if (!sizeCheck.valid) {
    logger.warn({
      userId: user.id,
      category,
      fileSize: filePayload.fileSize
    }, '🚫 Rejected media item exceeding Telegram Bot CDN size limit');

    return ctx.reply(i18n.errorLimit(sizeCheck.message), {
      parse_mode: 'HTML',
      reply_to_message_id: message.message_id
    });
  }

  try {
    // 2. Register ONLY metadata (fileId, uniqueFileId, etc.) into PostgreSQL without saving file to disk
    const fileItem = await fileService.registerTelegramFile(
      user.id,
      filePayload,
      ctx.io
    );

    const sizeMb = (fileItem.fileSize / (1024 * 1024)).toFixed(2);
    const replyText = i18n.savedSuccess(fileItem.fileName, sizeMb, fileItem.category);

    return ctx.reply(replyText, {
      parse_mode: 'HTML',
      reply_to_message_id: message.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            { text: i18n.btnMoveFolder, callback_data: `action_folder_${fileItem.id}` },
            { text: fileItem.isFavorite ? i18n.btnFavorited : i18n.btnFavorite, callback_data: `action_fav_${fileItem.id}` }
          ],
          [
            { text: i18n.btnAddNote, callback_data: `action_note_${fileItem.id}` },
            { text: i18n.btnAddTag, callback_data: `action_tag_${fileItem.id}` }
          ],
          [
            {
              text: i18n.btnOpenApp,
              web_app: { url: process.env.WEBAPP_URL || 'http://localhost:5173' }
            }
          ]
        ]
      }
    });
  } catch (err) {
    logger.error({ err: err.message }, 'Failed to save media item from telegram bot');
    return ctx.reply('❌ Could not save file reference: ' + err.message);
  }
}

module.exports = {
  handleIncomingMedia
};
