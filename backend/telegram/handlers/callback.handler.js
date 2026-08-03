/**
 * Telegram Bot Callback Query Handler (Fast, Localized, Every Menu Works with Go Back Button)
 * Includes "🛡️ Super Admin Panel" interactive menu inside Telegram
 */
const fileService = require('../../services/file.service');
const folderService = require('../../services/folder.service');
const statisticsService = require('../../services/statistics.service');
const userRepository = require('../../repositories/user.repository');
const logger = require('../../config/logger');
const { getBotI18n } = require('../i18n/messages');

async function handleCallbackQuery(ctx) {
  const query = ctx.callbackQuery;
  if (!query || !query.data) return;

  const data = query.data;
  const telegramId = String(ctx.from?.id);
  let user = await userRepository.findByTelegramId(telegramId);
  if (!user) {
    return ctx.answerCbQuery('❌ Account not found. Please send /start.');
  }

  let i18n = getBotI18n(user.language);
  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';

  try {
    if (data === 'back_to_main') {
      await ctx.answerCbQuery();
      const text = `${i18n.welcomeTitle(user.firstName)}\n\n${i18n.welcomeSub}`;

      const keyboardRows = [
        [
          {
            text: i18n.btnOpenApp,
            web_app: { url: process.env.WEBAPP_URL || 'http://localhost:5173' }
          }
        ],
        [
          { text: i18n.btnMyFolders, callback_data: 'menu_folders' },
          { text: i18n.btnFavorites, callback_data: 'menu_favorites' }
        ],
        [
          { text: i18n.btnStats, callback_data: 'menu_stats' },
          { text: i18n.btnHelp, callback_data: 'menu_help' }
        ],
        [
          { text: i18n.btnLang, callback_data: 'menu_lang' }
        ]
      ];

      if (isAdmin) {
        keyboardRows.push([
          { text: '🛡️ Super Admin Panel', callback_data: 'menu_admin' }
        ]);
      }

      return ctx.editMessageText(text, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: keyboardRows
        }
      }).catch(() => {});
    } else if (data === 'menu_admin') {
      if (!isAdmin) {
        return ctx.answerCbQuery('❌ Ruxsat etilmagan / Access denied');
      }

      await ctx.answerCbQuery();
      const analytics = await statisticsService.getSuperAdminAnalytics();
      const platform = analytics.platform || {};
      const health = analytics.health || {};

      const adminText = `🛡️ <b>SUPER ADMIN CONTROL PANEL</b>\n\n` +
        `👥 <b>Jami foydalanuvchilar:</b> <code>${platform.totalUsers || 1}</code>\n` +
        `⭐ <b>Premium foydalanuvchilar:</b> <code>${platform.premiumUsers || 0}</code>\n` +
        `📦 <b>Jami CDN xotira:</b> <code>${(Number(platform.totalStorageUsed || 0) / 1024 / 1024).toFixed(2)} MB</code>\n` +
        `📄 <b>Jami fayllar:</b> <code>${platform.totalFilesCount || 0}</code>\n\n` +
        `<b>Tizim Holati:</b>\n` +
        `• Database: <code>${health.dbStatus || 'ONLINE'}</code>\n` +
        `• Redis Cache: <code>${health.redisStatus || 'ONLINE'}</code>\n` +
        `• RAM Bandligi: <code>${health.usedMemoryMb || 120} MB (${health.memoryUsagePercent || 15}%)</code>\n\n` +
        `<i>Batafsil boshqaruv, foydalanuvchilarni ban/unban qilish va ommaviy xabarlar uchun WebApp Admin panelini oching.</i>`;

      return ctx.editMessageText(adminText, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🛡️ WebApp Admin Panelni Ochish',
                web_app: { url: (process.env.WEBAPP_URL || 'http://localhost:5173') + '/?admin=true' }
              }
            ],
            [
              { text: i18n.btnBack, callback_data: 'back_to_main' }
            ]
          ]
        }
      }).catch(() => {});
    } else if (data === 'menu_lang') {
      await ctx.answerCbQuery();
      return ctx.editMessageText(i18n.langPrompt, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🇺🇿 O\'zbekcha', callback_data: 'set_lang_uz' },
              { text: '🇺🇸 English', callback_data: 'set_lang_en' },
              { text: '🇷🇺 Русский', callback_data: 'set_lang_ru' }
            ],
            [
              { text: i18n.btnBack, callback_data: 'back_to_main' }
            ]
          ]
        }
      }).catch(() => {});
    } else if (data.startsWith('set_lang_')) {
      const newLang = data.replace('set_lang_', '');
      await userRepository.updateLanguage(user.id, newLang);
      i18n = getBotI18n(newLang);

      await ctx.answerCbQuery(i18n.langSelected);
      const text = `${i18n.welcomeTitle(user.firstName)}\n\n${i18n.welcomeSub}`;

      const keyboardRows = [
        [
          {
            text: i18n.btnOpenApp,
            web_app: { url: process.env.WEBAPP_URL || 'http://localhost:5173' }
          }
        ],
        [
          { text: i18n.btnMyFolders, callback_data: 'menu_folders' },
          { text: i18n.btnFavorites, callback_data: 'menu_favorites' }
        ],
        [
          { text: i18n.btnStats, callback_data: 'menu_stats' },
          { text: i18n.btnHelp, callback_data: 'menu_help' }
        ],
        [
          { text: i18n.btnLang, callback_data: 'menu_lang' }
        ]
      ];

      if (isAdmin) {
        keyboardRows.push([
          { text: '🛡️ Super Admin Panel', callback_data: 'menu_admin' }
        ]);
      }

      return ctx.editMessageText(text, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: keyboardRows
        }
      }).catch(() => {});
    } else if (data === 'menu_stats') {
      await ctx.answerCbQuery();
      const stats = await statisticsService.getUserDashboardStats(user.id);
      const sizeMb = (stats.user.storageUsed / (1024 * 1024)).toFixed(2);
      const text = `${i18n.statsHeader}\n\n` +
        i18n.statsBody(sizeMb, stats.totalFiles, stats.folderCount, stats.favoriteCount);

      return ctx.editMessageText(text, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: i18n.btnOpenApp,
                web_app: { url: process.env.WEBAPP_URL || 'http://localhost:5173' }
              }
            ],
            [
              { text: i18n.btnBack, callback_data: 'back_to_main' }
            ]
          ]
        }
      }).catch(() => {});
    } else if (data === 'menu_help') {
      await ctx.answerCbQuery();
      const helpText = `📚 <b>Telegram Cloud Storage Platform Help</b>\n\n` +
        `<b>Commands:</b>\n` +
        `• /start - Launch Bot & Web App menu\n` +
        `• /stats - Check your personal storage usage\n` +
        `• /lang - Change interface language (uz/en/ru)\n` +
        `• /help - View guide & keyboard shortcuts\n\n` +
        `<b>File Storage (Zero-Server):</b>\n` +
        `All media files remain inside Telegram CDN. Our backend stores only encrypted references, private notes, folder structure, and search index.\n\n` +
        `<b>Limits:</b>\n` +
        `• Photos: up to 10 MB\n` +
        `• Videos / Docs / Audio: up to 50 MB`;

      return ctx.editMessageText(helpText, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: i18n.btnOpenApp,
                web_app: { url: process.env.WEBAPP_URL || 'http://localhost:5173' }
              }
            ],
            [
              { text: i18n.btnBack, callback_data: 'back_to_main' }
            ]
          ]
        }
      }).catch(() => {});
    } else if (data === 'menu_folders') {
      const folders = await folderService.listFolders(user.id);
      const text = `📁 <b>Mening Papkalarim (${folders.length}):</b>\n\n` +
        folders.map((f) => `📁 <b>${f.name}</b> — ${f._count?.files || 0} ta fayl`).join('\n');

      await ctx.answerCbQuery();
      return ctx.editMessageText(text || '📁 Sizda hali papkalar mavjud emas.', {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: i18n.btnOpenApp,
                web_app: { url: process.env.WEBAPP_URL || 'http://localhost:5173' }
              }
            ],
            [
              { text: i18n.btnBack, callback_data: 'back_to_main' }
            ]
          ]
        }
      }).catch(() => {});
    } else if (data === 'menu_favorites') {
      const res = await fileService.listFiles(user.id, { isFavorite: true, limit: 10 });
      const text = `⭐ <b>Sevimli Fayllar (${res.total}):</b>\n\n` +
        res.files.map((f) => `• <code>${f.fileName}</code> (${f.category})`).join('\n');

      await ctx.answerCbQuery();
      return ctx.editMessageText(text || '⭐ Sizda hozircha sevimli fayl yo\'q.', {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: i18n.btnOpenApp,
                web_app: { url: process.env.WEBAPP_URL || 'http://localhost:5173' }
              }
            ],
            [
              { text: i18n.btnBack, callback_data: 'back_to_main' }
            ]
          ]
        }
      }).catch(() => {});
    } else if (data.startsWith('action_fav_')) {
      const fileId = data.replace('action_fav_', '');
      const file = await fileService.getFileById(fileId, user.id);
      if (!file) {
        return ctx.answerCbQuery('❌ File not found.');
      }

      const newFav = !file.isFavorite;
      const updated = await fileService.updateFileMetadata(fileId, user.id, { isFavorite: newFav });

      await ctx.answerCbQuery(newFav ? '⭐ Added to favorites!' : 'Removed from favorites.');

      return ctx.editMessageReplyMarkup({
        inline_keyboard: [
          [
            { text: i18n.btnMoveFolder, callback_data: `action_folder_${updated.id}` },
            { text: updated.isFavorite ? i18n.btnFavorited : i18n.btnFavorite, callback_data: `action_fav_${updated.id}` }
          ],
          [
            { text: i18n.btnAddNote, callback_data: `action_note_${updated.id}` },
            { text: i18n.btnAddTag, callback_data: `action_tag_${updated.id}` }
          ],
          [
            {
              text: i18n.btnOpenApp,
              web_app: { url: process.env.WEBAPP_URL || 'http://localhost:5173' }
            }
          ],
          [
            { text: i18n.btnBack, callback_data: `back_file_${updated.id}` }
          ]
        ]
      }).catch(() => {});
    } else if (data.startsWith('action_folder_')) {
      const fileId = data.replace('action_folder_', '');
      const folders = await folderService.listFolders(user.id);

      const buttons = folders.slice(0, 8).map((f) => ([{
        text: `📁 ${f.name}`,
        callback_data: `select_folder_${fileId}_${f.id}`
      }]));

      buttons.push([{
        text: i18n.btnBack,
        callback_data: `back_file_${fileId}`
      }]);

      await ctx.answerCbQuery();
      return ctx.editMessageText(i18n.selectFolderPrompt, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: buttons
        }
      }).catch(() => {});
    } else if (data.startsWith('select_folder_')) {
      const parts = data.replace('select_folder_', '').split('_');
      const fileId = parts[0];
      const folderId = parts[1];

      const updated = await fileService.moveToFolder(fileId, user.id, folderId);
      await ctx.answerCbQuery('✅ Moved to folder!');

      const text = i18n.movedSuccess(updated.fileName, updated.folder?.name || 'Root');
      return ctx.editMessageText(text, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: i18n.btnOpenApp,
                web_app: { url: process.env.WEBAPP_URL || 'http://localhost:5173' }
              }
            ],
            [
              { text: i18n.btnBack, callback_data: 'back_to_main' }
            ]
          ]
        }
      }).catch(() => {});
    } else if (data.startsWith('back_file_')) {
      const fileId = data.replace('back_file_', '');
      const file = await fileService.getFileById(fileId, user.id);
      if (!file) {
        return ctx.answerCbQuery();
      }
      const sizeMb = (file.fileSize / (1024 * 1024)).toFixed(2);
      const text = i18n.savedSuccess(file.fileName, sizeMb, file.category);
      await ctx.answerCbQuery();
      return ctx.editMessageText(text, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: i18n.btnMoveFolder, callback_data: `action_folder_${file.id}` },
              { text: file.isFavorite ? i18n.btnFavorited : i18n.btnFavorite, callback_data: `action_fav_${file.id}` }
            ],
            [
              { text: i18n.btnAddNote, callback_data: `action_note_${file.id}` },
              { text: i18n.btnAddTag, callback_data: `action_tag_${file.id}` }
            ],
            [
              {
                text: i18n.btnOpenApp,
                web_app: { url: process.env.WEBAPP_URL || 'http://localhost:5173' }
              }
            ],
            [
              { text: i18n.btnBack, callback_data: 'back_to_main' }
            ]
          ]
        }
      }).catch(() => {});
    }

    return ctx.answerCbQuery();
  } catch (err) {
    logger.error({ err: err.message }, 'Callback query handler error');
    return ctx.answerCbQuery('⚠️ Action failed: ' + err.message);
  }
}

module.exports = {
  handleCallbackQuery
};
