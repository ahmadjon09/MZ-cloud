/**
 * Telegram Symbols Helper
 * Generates clean symbols for Telegram Bot messages without custom HTML <tg-emoji> tags
 */

const SYMBOLS = {
  CLOUD: '☁️',
  FOLDER: '📁',
  FAVORITE: '⭐',
  SUCCESS: '✅',
  STATS: '📊',
  WARNING: '⚠️',
  ERROR: '❌',
  NOTE: '📝',
  TAG: '🏷️',
  LINK: '🌐',
  PHOTO: '🖼️',
  VIDEO: '🎬',
  DOCUMENT: '📄',
  AUDIO: '🎵',
  BACK: '🔙',
  LANG: '🌍'
};

/**
 * Returns a clean symbol
 * @param {string} name - Key of SYMBOLS
 * @returns {string}
 */
function getEmoji(name) {
  return SYMBOLS[name] || '•';
}

module.exports = {
  getEmoji,
  SYMBOLS
};
