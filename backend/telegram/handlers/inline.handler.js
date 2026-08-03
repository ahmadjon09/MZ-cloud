/**
 * Telegram Bot Inline Query Handler (MZ-CLOUD)
 * Allows users to search and send their cloud files in any Telegram chat via "@MZCloudBot <query>"
 */
const fileService = require('../../services/file.service');
const userRepository = require('../../repositories/user.repository');
const logger = require('../../config/logger');

async function handleInlineQuery(ctx) {
  const inlineQuery = ctx.inlineQuery;
  if (!inlineQuery) return;

  const telegramUser = inlineQuery.from;
  const queryText = (inlineQuery.query || '').trim();

  try {
    const user = await userRepository.findByTelegramId(String(telegramUser.id));
    if (!user || user.isBanned) {
      return ctx.answerInlineQuery([], {
        cache_time: 10,
        is_personal: true,
        switch_pm_text: '☁️ MZ-CLOUD ni ishga tushiring / Start MZ-CLOUD',
        switch_pm_parameter: 'inline_start'
      });
    }

    // Query user's files matching queryText (up to 20 results)
    const searchRes = await fileService.listFiles(user.id, {
      search: queryText,
      limit: 20,
      isDeleted: false
    });

    const files = searchRes.files || [];

    if (files.length === 0) {
      return ctx.answerInlineQuery([], {
        cache_time: 5,
        is_personal: true,
        switch_pm_text: `"${queryText}" bo'yicha fayl topilmadi / No files found`,
        switch_pm_parameter: 'inline_empty'
      });
    }

    const results = files.map((file) => {
      const sizeMb = (file.fileSize / 1024 / 1024).toFixed(2);
      const webAppUrl = (process.env.WEBAPP_URL || 'https://mz-cloud.vercel.app') + `/?file=${file.id}`;

      // Universal article representation for reliable Inline Mode sending across all Telegram clients
      return {
        type: 'article',
        id: file.id,
        title: `${file.fileName}`,
        description: `${sizeMb} MB • ${file.category} • ${new Date(file.createdAt).toLocaleDateString()}`,
        input_message_content: {
          message_text: `☁️ <b>MZ-CLOUD Fayl / File:</b>\n\n` +
            `📄 <b>Nomi:</b> <code>${file.fileName}</code>\n` +
            `📦 <b>Hajmi:</b> <code>${sizeMb} MB</code>\n` +
            `🏷️ <b>Toifa:</b> <code>${file.category}</code>\n` +
            (file.caption ? `💬 <b>Izoh:</b> <i>${file.caption}</i>\n` : '') +
            `\nFaylni ko'rish yoki yuklab olish uchun MZ-CLOUD ilovasini oching:`,
          parse_mode: 'HTML'
        },
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🌐 MZ-CLOUD da ochish / Open File',
                web_app: { url: webAppUrl }
              }
            ]
          ]
        }
      };
    });

    return ctx.answerInlineQuery(results, {
      cache_time: 10,
      is_personal: true
    });
  } catch (err) {
    logger.error({ err: err.message }, 'Inline query handler error');
    return ctx.answerInlineQuery([], { cache_time: 5, is_personal: true });
  }
}

module.exports = {
  handleInlineQuery
};
