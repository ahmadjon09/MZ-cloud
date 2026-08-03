/**
 * Telegram Bot /start Command Handler (Fast & Localized without custom <tg-emoji> tags)
 * Adds "🛡️ Super Admin Panel" button if user ID matches Admin IDs
 */
const userRepository = require('../../repositories/user.repository');
const fileRepository = require('../../repositories/file.repository');
const { getBotI18n } = require('../i18n/messages');

async function handleStartCommand(ctx) {
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
  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';

  const startPayload = ctx.payload;
  if (startPayload && startPayload.startsWith('share_')) {
    const token = startPayload.replace('share_', '');
    const fileItem = await fileRepository.findByShareToken(token);
    if (fileItem) {
      return ctx.reply(
        `📁 <b>Shared File:</b> <code>${fileItem.fileName}</code>\n📦 Size: ${(fileItem.fileSize / 1024 / 1024).toFixed(2)} MB\n\nClick below to view:`,
        {
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
        }
      );
    }
  }

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

  // Add Admin Panel button if user ID matches Admin IDs
  if (isAdmin) {
    keyboardRows.push([
      { text: '🛡️ Super Admin Panel', callback_data: 'menu_admin' }
    ]);
  }

  return ctx.reply(text, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: keyboardRows
    }
  });
}

module.exports = {
  handleStartCommand
};
