/**
 * Telegram Bot /help and /stats Command Handlers (Fast & Localized with Go Back Button)
 */
const statisticsService = require('../../services/statistics.service');
const userRepository = require('../../repositories/user.repository');
const { getBotI18n } = require('../i18n/messages');

async function handleHelpCommand(ctx) {
  const telegramId = String(ctx.from?.id);
  const user = await userRepository.findByTelegramId(telegramId) || { language: 'uz' };
  const i18n = getBotI18n(user.language);

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

  return ctx.reply(helpText, {
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
  });
}

async function handleStatsCommand(ctx) {
  const telegramId = String(ctx.from?.id);
  const user = await userRepository.findByTelegramId(telegramId);
  if (!user) {
    return ctx.reply('❌ Iltimos /start buyrug\'ini yuboring.');
  }

  const i18n = getBotI18n(user.language);
  const stats = await statisticsService.getUserDashboardStats(user.id);
  const sizeMb = (stats.user.storageUsed / (1024 * 1024)).toFixed(2);

  const statsText = `${i18n.statsHeader}\n\n` +
    i18n.statsBody(sizeMb, stats.totalFiles, stats.folderCount, stats.favoriteCount);

  return ctx.reply(statsText, {
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
  });
}

module.exports = {
  handleHelpCommand,
  handleStatsCommand
};
