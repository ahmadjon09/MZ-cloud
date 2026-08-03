/**
 * Telegram Bot Manager (Production Quality, Fast, No Custom Emojis - MZ-CLOUD)
 */
const { Telegraf } = require('telegraf');
const appConfig = require('../config/app.config');
const logger = require('../config/logger');
const { handleStartCommand } = require('./commands/start.command');
const { handleHelpCommand, handleStatsCommand } = require('./commands/help.command');
const { handleLangCommand } = require('./commands/lang.command');
const { handleIncomingMedia } = require('./handlers/file.handler');
const { handleCallbackQuery } = require('./handlers/callback.handler');
const { handleIncomingText } = require('./handlers/text.handler');
const { handleInlineQuery } = require('./handlers/inline.handler');

class TelegramBotManager {
  constructor() {
    this.bot = null;
    this.io = null;
    this.isSimulated = false;
  }

  init(io) {
    this.io = io;
    const token = appConfig.botToken;

    if (!token || token.length < 20 || token.includes('123456789:ABCdefGHI')) {
      logger.warn('⚡ Telegram Bot Token is placeholder; running Bot in simulation / webhook mode');
      this.isSimulated = true;
      return;
    }

    try {
      this.bot = new Telegraf(token);

      this.bot.use((ctx, next) => {
        ctx.io = this.io;
        return next();
      });

      // Command Handlers
      this.bot.command('start', handleStartCommand);
      this.bot.command('help', handleHelpCommand);
      this.bot.command('stats', handleStatsCommand);
      this.bot.command('lang', handleLangCommand);

      // Media Handlers
      this.bot.on(['document', 'photo', 'video', 'audio', 'voice', 'video_note'], handleIncomingMedia);

      // Inline Search Mode Handler (@MZCloudBot <query>)
      this.bot.on('inline_query', handleInlineQuery);

      // Text Message Handler (Notes Reply & Search)
      this.bot.on('text', handleIncomingText);

      // Callback Queries
      this.bot.on('callback_query', handleCallbackQuery);

      this.bot.catch((err, ctx) => {
        logger.error({ err: err.message, updateType: ctx.updateType }, 'Telegram bot error');
      });

      this.bot.launch(() => {
        logger.info('🤖 Telegram Bot launched successfully');
      });

      process.once('SIGINT', () => this.bot && this.bot.stop('SIGINT'));
      process.once('SIGTERM', () => this.bot && this.bot.stop('SIGTERM'));
    } catch (err) {
      logger.error({ err: err.message }, 'Failed to initialize Telegraf bot');
      this.isSimulated = true;
    }
  }

  getBot() {
    return this.bot;
  }

  async simulateIncomingMedia(userId, telegramUser, filePayload) {
    const fakeCtx = {
      from: telegramUser,
      message: {
        message_id: Math.floor(Math.random() * 100000),
        ...filePayload
      },
      reply: async (text) => ({ text, simulated: true }),
      io: this.io
    };

    return handleIncomingMedia(fakeCtx);
  }
}

module.exports = new TelegramBotManager();
