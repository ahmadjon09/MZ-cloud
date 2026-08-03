/**
 * Telegram Bot /lang Command Handler (Fast Language Selector with Go Back Button)
 */
const userRepository = require('../../repositories/user.repository');
const { getBotI18n } = require('../i18n/messages');

async function handleLangCommand(ctx) {
  const telegramId = String(ctx.from?.id);
  const user = await userRepository.findByTelegramId(telegramId) || { language: 'uz' };
  const i18n = getBotI18n(user.language);

  return ctx.reply(i18n.langPrompt, {
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
  });
}

module.exports = {
  handleLangCommand
};
