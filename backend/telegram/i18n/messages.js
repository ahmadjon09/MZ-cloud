/**
 * Telegram Bot Internationalization (i18n)
 * Localized messages in Uzbek ('uz'), English ('en'), and Russian ('ru')
 * Formatted cleanly without custom <tg-emoji> tags
 */
const { getEmoji } = require('../utils/emojis');

const DICTIONARIES = {
  uz: {
    welcomeTitle: (name) => `${getEmoji('CLOUD')} <b>Telegram Bulutli Xotiraga Xush Kelibsiz, ${name}!</b>`,
    welcomeSub: `Sizning shaxsiy, tezkor va cheksiz bulutli xotirangiz to'g'ridan-to'g'ri Telegram CDN (Saved Messages) da ishlaydi.\n\n` +
      `📥 <b>Qanday ishlaydi:</b>\n` +
      `• Har qanday Rasm (10 MB gacha), Video/Audio/Hujjat (50 MB gacha) ni ushbu botga yuboring.\n` +
      `• Biz faqat fayl identifikatori (file_id), teglari va eslatmalarni indekslaymiz. Haqiqiy fayl Telegram CDN da qoladi.\n` +
      `• WebApp ilovasini ochib barchasini papkalarga ajrating va tezkor qidiring!`,
    btnOpenApp: `${getEmoji('LINK')} Telegram Bulut Ilovasini Ochish`,
    btnMyFolders: `${getEmoji('FOLDER')} Mening Papkalarim`,
    btnFavorites: `${getEmoji('FAVORITE')} Sevimlilar`,
    btnStats: `${getEmoji('STATS')} Xotira statistikasi`,
    btnHelp: `❓ Yordam`,
    btnLang: `${getEmoji('LANG')} Tilni o'zgartirish`,
    savedSuccess: (name, size, cat) => `${getEmoji('SUCCESS')} <b>Telegram CDN Bulutga Saqlandi</b>\n\n` +
      `📄 <b>Fayl:</b> <code>${name}</code>\n` +
      `📦 <b>Hajmi:</b> <code>${size} MB</code>\n` +
      `🏷️ <b>Toifa:</b> <code>${cat}</code>\n` +
      `☁️ <b>Saqlash turi:</b> <code>Telegram CDN (Zero-Server)</code>`,
    btnMoveFolder: `${getEmoji('FOLDER')} Papkaga ko'chirish`,
    btnFavorite: `${getEmoji('FAVORITE')} Sevimlilarga`,
    btnFavorited: `${getEmoji('FAVORITE')} Sevimlilarda`,
    btnAddNote: `${getEmoji('NOTE')} Eslatma`,
    btnAddTag: `${getEmoji('TAG')} Teglar`,
    errorLimit: (msg) => `${getEmoji('ERROR')} <b>Telegram Bot Fayl Limiti Raddiyasi!</b>\n\n${msg}\n\n` +
      `💡 <i>Eslatma:</i> Rasmlar maksimal <b>10 MB</b>, video/audio/hujjatlar esa maksimal <b>50 MB</b> bo'lishi shart!`,
    errorUnsupported: `${getEmoji('WARNING')} Qo'llab-quvvatlanmaydigan format. Iltimos Rasm, Video, Hujjat yoki Audio yuboring.`,
    statsHeader: `${getEmoji('STATS')} <b>Sizning Xotira Ko'rsatkichlaringiz</b>`,
    statsBody: (mb, files, folders, favs) => `📦 <b>Jami xotira:</b> <code>${mb} MB</code>\n` +
      `📂 <b>Fayllar:</b> <code>${files}</code>\n` +
      `📁 <b>Papkalar:</b> <code>${folders}</code>\n` +
      `⭐ <b>Sevimlilar:</b> <code>${favs}</code>`,
    selectFolderPrompt: `📁 <b>Qaysi papkaga ko'chirmoqchisiz?</b>`,
    movedSuccess: (file, folder) => `${getEmoji('SUCCESS')} <code>${file}</code> fayli <b>${folder}</b> papkasiga ko'chirildi!`,
    btnBack: `${getEmoji('BACK')} Asosiy menyuga qaytish`,
    langPrompt: `${getEmoji('LANG')} <b>Iltimos, tilni tanlang / Please select language / Выберите язык:</b>`,
    langSelected: `🇺🇿 O'zbek tili tanlandi!`
  },
  en: {
    welcomeTitle: (name) => `${getEmoji('CLOUD')} <b>Welcome to Telegram Cloud Storage, ${name}!</b>`,
    welcomeSub: `Your personal, unlimited, lightning-fast cloud storage built on Telegram CDN (Saved Messages).\n\n` +
      `📥 <b>How it works:</b>\n` +
      `• Send any Photo (up to 10 MB), Video/Audio/Doc (up to 50 MB) to this bot.\n` +
      `• We only store the file_id and metadata. Real media stays inside Telegram CDN.\n` +
      `• Open the WebApp below to organize folders and search globally!`,
    btnOpenApp: `${getEmoji('LINK')} Open Telegram Cloud App`,
    btnMyFolders: `${getEmoji('FOLDER')} My Folders`,
    btnFavorites: `${getEmoji('FAVORITE')} Favorites`,
    btnStats: `${getEmoji('STATS')} Storage Stats`,
    btnHelp: `❓ Help & Support`,
    btnLang: `${getEmoji('LANG')} Change Language`,
    savedSuccess: (name, size, cat) => `${getEmoji('SUCCESS')} <b>Saved to Telegram CDN Cloud</b>\n\n` +
      `📄 <b>File:</b> <code>${name}</code>\n` +
      `📦 <b>Size:</b> <code>${size} MB</code>\n` +
      `🏷️ <b>Category:</b> <code>${cat}</code>\n` +
      `☁️ <b>Storage:</b> <code>Telegram CDN (Zero-Server)</code>`,
    btnMoveFolder: `${getEmoji('FOLDER')} Move to Folder`,
    btnFavorite: `${getEmoji('FAVORITE')} Favorite`,
    btnFavorited: `${getEmoji('FAVORITE')} Favorited`,
    btnAddNote: `${getEmoji('NOTE')} Note`,
    btnAddTag: `${getEmoji('TAG')} Tags`,
    errorLimit: (msg) => `${getEmoji('ERROR')} <b>Telegram Bot File Size Limit Exceeded!</b>\n\n${msg}\n\n` +
      `💡 <i>Note:</i> Photos must not exceed <b>10 MB</b>, videos/audio/docs must not exceed <b>50 MB</b>!`,
    errorUnsupported: `${getEmoji('WARNING')} Unsupported file format. Please send Photo, Video, Document, or Audio.`,
    statsHeader: `${getEmoji('STATS')} <b>Your Storage Usage</b>`,
    statsBody: (mb, files, folders, favs) => `📦 <b>Total used:</b> <code>${mb} MB</code>\n` +
      `📂 <b>Files:</b> <code>${files}</code>\n` +
      `📁 <b>Folders:</b> <code>${folders}</code>\n` +
      `⭐ <b>Favorites:</b> <code>${favs}</code>`,
    selectFolderPrompt: `📁 <b>Select destination folder:</b>`,
    movedSuccess: (file, folder) => `${getEmoji('SUCCESS')} Moved <code>${file}</code> to <b>${folder}</b>!`,
    btnBack: `${getEmoji('BACK')} Back to main menu`,
    langPrompt: `${getEmoji('LANG')} <b>Please select language / Iltimos, tilni tanlang / Выберите язык:</b>`,
    langSelected: `🇺🇸 English language selected!`
  },
  ru: {
    welcomeTitle: (name) => `${getEmoji('CLOUD')} <b>Добро пожаловать в Telegram Облако, ${name}!</b>`,
    welcomeSub: `Ваше личное, неограниченное и быстрое облако на базе Telegram CDN (Избранное).\n\n` +
      `📥 <b>Как это работает:</b>\n` +
      `• Отправьте любое Фото (до 10 МБ), Видео/Аудио/Файл (до 50 МБ) в этот бот.\n` +
      `• Мы сохраняем только file_id и теги. Файлы хранятся в Telegram CDN.\n` +
      `• Откройте WebApp ниже для организации по папкам и поиска!`,
    btnOpenApp: `${getEmoji('LINK')} Открыть WebApp`,
    btnMyFolders: `${getEmoji('FOLDER')} Мои Папки`,
    btnFavorites: `${getEmoji('FAVORITE')} Избранное`,
    btnStats: `${getEmoji('STATS')} Статистика`,
    btnHelp: `❓ Помощь`,
    btnLang: `${getEmoji('LANG')} Сменить язык`,
    savedSuccess: (name, size, cat) => `${getEmoji('SUCCESS')} <b>Сохранено в Telegram CDN</b>\n\n` +
      `📄 <b>Файл:</b> <code>${name}</code>\n` +
      `📦 <b>Размер:</b> <code>${size} МБ</code>\n` +
      `🏷️ <b>Категория:</b> <code>${cat}</code>\n` +
      `☁️ <b>Хранение:</b> <code>Telegram CDN (Zero-Server)</code>`,
    btnMoveFolder: `${getEmoji('FOLDER')} В папку`,
    btnFavorite: `${getEmoji('FAVORITE')} В избранное`,
    btnFavorited: `${getEmoji('FAVORITE')} В избранном`,
    btnAddNote: `${getEmoji('NOTE')} Заметка`,
    btnAddTag: `${getEmoji('TAG')} Теги`,
    errorLimit: (msg) => `${getEmoji('ERROR')} <b>Превышен лимит размера файла Telegram!</b>\n\n${msg}\n\n` +
      `💡 <i>Внимание:</i> Фото до <b>10 МБ</b>, видео/аудио/документы до <b>50 МБ</b>!`,
    errorUnsupported: `${getEmoji('WARNING')} Неподдерживаемый формат. Пожалуйста, отправьте Фото, Видео, Документ или Аудио.`,
    statsHeader: `${getEmoji('STATS')} <b>Ваша статистика облака</b>`,
    statsBody: (mb, files, folders, favs) => `📦 <b>Общий объем:</b> <code>${mb} МБ</code>\n` +
      `📂 <b>Файлов:</b> <code>${files}</code>\n` +
      `📁 <b>Папок:</b> <code>${folders}</code>\n` +
      `⭐ <b>Избранных:</b> <code>${favs}</code>`,
    selectFolderPrompt: `📁 <b>Выберите папку для перемещения:</b>`,
    movedSuccess: (file, folder) => `${getEmoji('SUCCESS')} Файл <code>${file}</code> перемещен в <b>${folder}</b>!`,
    btnBack: `${getEmoji('BACK')} Назад в главное меню`,
    langPrompt: `${getEmoji('LANG')} <b>Выберите язык / Please select language / Iltimos, tilni tanlang:</b>`,
    langSelected: `🇷🇺 Выбран русский язык!`
  }
};

function getBotI18n(langCode = 'uz') {
  const code = (langCode || 'uz').toLowerCase().substring(0, 2);
  return DICTIONARIES[code] || DICTIONARIES.uz;
}

module.exports = {
  getBotI18n
};
