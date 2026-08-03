/**
 * Telegram Bot Text & Note Handler (MZ-CLOUD)
 * Allows users to reply to messages to save private Markdown notes to files
 */
const fileService = require('../../services/file.service');
const userRepository = require('../../repositories/user.repository');
const logger = require('../../config/logger');
const { getBotI18n } = require('../i18n/messages');

async function handleIncomingText(ctx) {
  const telegramUser = ctx.from;
  if (!telegramUser) return;

  // Ignore command messages
  const text = ctx.message?.text;
  if (!text || text.startsWith('/')) return;

  const user = await userRepository.findByTelegramId(String(telegramUser.id));
  if (!user) return;

  const i18n = getBotI18n(user.language);

  // If replying to a bot message that contains "Fayl:" or "File:", parse filename and update notes
  const replyTo = ctx.message.reply_to_message;
  if (replyTo && replyTo.text && (replyTo.text.includes('Fayl:') || replyTo.text.includes('File:') || replyTo.text.includes('Файл:'))) {
    try {
      // Get user's most recent file or find by matching filename in reply
      const res = await fileService.listFiles(user.id, { limit: 1 });
      const recentFile = res.files?.[0];

      if (recentFile) {
        const updated = await fileService.updateFileMetadata(recentFile.id, user.id, {
          userNotes: text
        });

        return ctx.reply(`✅ <b>Eslatma saqlandi!</b>\n\n📄 <b>Fayl:</b> <code>${updated.fileName}</code>\n💬 <b>Eslatma:</b>\n<i>${updated.userNotes}</i>`, {
          parse_mode: 'HTML',
          reply_to_message_id: ctx.message.message_id,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🌐 WebApp da ko\'rish',
                  web_app: { url: process.env.WEBAPP_URL || 'https://mz-cloud.vercel.app' }
                }
              ]
            ]
          }
        });
      }
    } catch (err) {
      logger.error({ err: err.message }, 'Failed to save note via reply');
    }
  }

  // Otherwise, treat as a global search query in Telegram
  try {
    const searchRes = await fileService.listFiles(user.id, { search: text, limit: 5 });
    const count = searchRes.total || 0;

    if (count === 0) {
      return ctx.reply(`🔍 <b>"${text}"</b> bo'yicha fayl topilmadi.`, { parse_mode: 'HTML' });
    }

    const replyText = `🔍 <b>Qidiruv natijalari (${count} ta):</b>\n\n` +
      searchRes.files.map((f, idx) => `${idx + 1}. <code>${f.fileName}</code> (${f.category})`).join('\n');

    return ctx.reply(replyText, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🌐 WebApp da ochish',
              web_app: { url: (process.env.WEBAPP_URL || 'https://mz-cloud.vercel.app') + `/?q=${encodeURIComponent(text)}` }
            }
          ]
        ]
      }
    });
  } catch (err) {
    // ignore search error
  }
}

module.exports = {
  handleIncomingText
};
