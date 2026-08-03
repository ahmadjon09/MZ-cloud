/**
 * Telegram Bot /premium Command Handler (MZ-CLOUD)
 * Allows users to upgrade to MZ-CLOUD custom Premium membership using Telegram Stars (XTR)
 */
const userRepository = require('../../repositories/user.repository');
const { getBotI18n } = require('../i18n/messages');
const logger = require('../../config/logger');

async function handlePremiumCommand(ctx) {
  const telegramUser = ctx.from;
  if (!telegramUser) return;

  const user = await userRepository.findByTelegramId(String(telegramUser.id));
  if (!user) {
    return ctx.reply('❌ Iltimos /start buyrug\'ini yuboring.');
  }

  const i18n = getBotI18n(user.language);

  if (user.isPremium) {
    return ctx.reply(`⭐ <b>Siz allaqachon MZ-CLOUD Premium a'zosisiz!</b>\n\n100% reklamasiz interfeys, cheksiz tezlik va VIP oltin yulduz statusi faollashtirilgan.`, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: i18n.btnOpenApp,
              web_app: { url: process.env.WEBAPP_URL || 'https://mz-cloud.vercel.app' }
            }
          ],
          [
            { text: i18n.btnBack, callback_data: 'back_to_main' }
          ]
        ]
      }
    });
  }

  const title = 'MZ-CLOUD Premium Membership';
  const description = '100% reklamasiz bulutli xotira, VIP oltin yulduz statusi va parallel yozish ustuvorligi!';
  const payload = JSON.stringify({ userId: user.id, action: 'MZ_CLOUD_PREMIUM_UPGRADE' });
  const currency = 'XTR'; // Telegram Stars currency code
  const prices = [{ label: 'MZ-CLOUD Premium (1 Year)', amount: 50 }];

  try {
    return ctx.replyWithInvoice({
      title,
      description,
      payload,
      provider_token: '', // Must be empty string for Telegram Stars
      currency,
      prices
    });
  } catch (err) {
    logger.warn({ err: err.message, telegramId: user.telegramId }, 'Failed to send Telegram Stars invoice');
    return ctx.reply(`⭐ <b>MZ-CLOUD Premium to'lovi</b>\n\nTelegram Stars orqali to'lov yuborish uchun botni jonli rejimda ishga tushiring yoki WebApp ilovasidan foydalaning.`, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '⭐ WebApp orqali Premium Olish',
              web_app: { url: (process.env.WEBAPP_URL || 'https://mz-cloud.vercel.app') + '/?premium=true' }
            }
          ],
          [
            { text: i18n.btnBack, callback_data: 'back_to_main' }
          ]
        ]
      }
    });
  }
}

module.exports = {
  handlePremiumCommand
};
