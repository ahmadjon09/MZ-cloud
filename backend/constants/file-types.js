/**
 * Complete classification of Telegram File Types and Extensions
 * Senior Node.js / Enterprise Storage Architecture
 */

const FILE_CATEGORIES = {
  PHOTO: 'PHOTO',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  VOICE: 'VOICE',
  DOCUMENT: 'DOCUMENT',
  ARCHIVE: 'ARCHIVE',
  CODE: 'CODE',
  OTHER: 'OTHER'
};

// Telegram Bot Media Size Limits (enforced so files never exceed Telegram CDN bot upload limits)
const MEDIA_SIZE_LIMITS = {
  PHOTO_MAX_BYTES: 10 * 1024 * 1024,      // 10 MB max for Photos / Images
  GENERAL_MAX_BYTES: 50 * 1024 * 1024     // 50 MB max for Video, Audio, Voice, Document, Archive, Code
};

const EXTENSION_CATEGORY_MAP = {
  // Images / Photos (Max 10 MB)
  jpg: FILE_CATEGORIES.PHOTO,
  jpeg: FILE_CATEGORIES.PHOTO,
  png: FILE_CATEGORIES.PHOTO,
  webp: FILE_CATEGORIES.PHOTO,
  gif: FILE_CATEGORIES.PHOTO,
  bmp: FILE_CATEGORIES.PHOTO,
  svg: FILE_CATEGORIES.PHOTO,
  tgs: FILE_CATEGORIES.PHOTO, // Telegram animated sticker

  // Video (Max 50 MB)
  mp4: FILE_CATEGORIES.VIDEO,
  mov: FILE_CATEGORIES.VIDEO,
  avi: FILE_CATEGORIES.VIDEO,
  mkv: FILE_CATEGORIES.VIDEO,
  webm: FILE_CATEGORIES.VIDEO,
  m4v: FILE_CATEGORIES.VIDEO,

  // Audio / Music (Max 50 MB)
  mp3: FILE_CATEGORIES.AUDIO,
  flac: FILE_CATEGORIES.AUDIO,
  wav: FILE_CATEGORIES.AUDIO,
  aac: FILE_CATEGORIES.AUDIO,
  m4a: FILE_CATEGORIES.AUDIO,
  ogg: FILE_CATEGORIES.AUDIO,

  // Voice Notes (Max 50 MB)
  oga: FILE_CATEGORIES.VOICE,
  opus: FILE_CATEGORIES.VOICE,

  // Archives (Max 50 MB)
  zip: FILE_CATEGORIES.ARCHIVE,
  rar: FILE_CATEGORIES.ARCHIVE,
  '7z': FILE_CATEGORIES.ARCHIVE,
  tar: FILE_CATEGORIES.ARCHIVE,
  gz: FILE_CATEGORIES.ARCHIVE,
  iso: FILE_CATEGORIES.ARCHIVE,

  // Code & Developer Files (Max 50 MB)
  js: FILE_CATEGORIES.CODE,
  ts: FILE_CATEGORIES.CODE,
  jsx: FILE_CATEGORIES.CODE,
  tsx: FILE_CATEGORIES.CODE,
  html: FILE_CATEGORIES.CODE,
  css: FILE_CATEGORIES.CODE,
  json: FILE_CATEGORIES.CODE,
  xml: FILE_CATEGORIES.CODE,
  py: FILE_CATEGORIES.CODE,
  java: FILE_CATEGORIES.CODE,
  cpp: FILE_CATEGORIES.CODE,
  c: FILE_CATEGORIES.CODE,
  go: FILE_CATEGORIES.CODE,
  rs: FILE_CATEGORIES.CODE,
  sql: FILE_CATEGORIES.CODE,
  sh: FILE_CATEGORIES.CODE,
  yml: FILE_CATEGORIES.CODE,
  yaml: FILE_CATEGORIES.CODE,
  md: FILE_CATEGORIES.CODE,

  // Documents & Designers (Max 50 MB)
  pdf: FILE_CATEGORIES.DOCUMENT,
  doc: FILE_CATEGORIES.DOCUMENT,
  docx: FILE_CATEGORIES.DOCUMENT,
  xls: FILE_CATEGORIES.DOCUMENT,
  xlsx: FILE_CATEGORIES.DOCUMENT,
  ppt: FILE_CATEGORIES.DOCUMENT,
  pptx: FILE_CATEGORIES.DOCUMENT,
  csv: FILE_CATEGORIES.DOCUMENT,
  txt: FILE_CATEGORIES.DOCUMENT,
  psd: FILE_CATEGORIES.DOCUMENT,
  ai: FILE_CATEGORIES.DOCUMENT,
  fig: FILE_CATEGORIES.DOCUMENT,
  apk: FILE_CATEGORIES.DOCUMENT,
  exe: FILE_CATEGORIES.DOCUMENT
};

/**
 * Identify file category from extension and mime type
 * @param {string} fileName
 * @param {string} mimeType
 * @returns {string} FILE_CATEGORIES
 */
function classifyFileType(fileName = '', mimeType = '') {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (EXTENSION_CATEGORY_MAP[ext]) {
    return EXTENSION_CATEGORY_MAP[ext];
  }
  if (mimeType.startsWith('image/')) return FILE_CATEGORIES.PHOTO;
  if (mimeType.startsWith('video/')) return FILE_CATEGORIES.VIDEO;
  if (mimeType.startsWith('audio/')) return FILE_CATEGORIES.AUDIO;
  if (mimeType.includes('pdf') || mimeType.includes('document')) return FILE_CATEGORIES.DOCUMENT;
  if (mimeType.includes('zip') || mimeType.includes('compressed') || mimeType.includes('archive')) {
    return FILE_CATEGORIES.ARCHIVE;
  }
  return FILE_CATEGORIES.OTHER;
}

/**
 * Verify that media file size complies with Telegram CDN bot limits
 * Photos: max 10 MB
 * Video/Audio/Document/Other: max 50 MB
 * @param {string} category - FILE_CATEGORIES
 * @param {number} sizeBytes - file size in bytes
 * @returns {{ valid: boolean, message?: string, maxBytes: number }}
 */
function validateTelegramMediaLimits(category, sizeBytes = 0) {
  const size = Number(sizeBytes || 0);

  if (category === FILE_CATEGORIES.PHOTO) {
    if (size > MEDIA_SIZE_LIMITS.PHOTO_MAX_BYTES) {
      return {
        valid: false,
        message: `Rasm hajmi 10 MB dan oshishi mumkin emas! (Hozirgi: ${(size / 1024 / 1024).toFixed(2)} MB, Telegram Bot limiti)`,
        maxBytes: MEDIA_SIZE_LIMITS.PHOTO_MAX_BYTES
      };
    }
  } else {
    if (size > MEDIA_SIZE_LIMITS.GENERAL_MAX_BYTES) {
      return {
        valid: false,
        message: `Video / Audio / Hujjat hajmi 50 MB dan oshishi mumkin emas! (Hozirgi: ${(size / 1024 / 1024).toFixed(2)} MB, Telegram Bot limiti)`,
        maxBytes: MEDIA_SIZE_LIMITS.GENERAL_MAX_BYTES
      };
    }
  }

  return { valid: true, maxBytes: category === FILE_CATEGORIES.PHOTO ? MEDIA_SIZE_LIMITS.PHOTO_MAX_BYTES : MEDIA_SIZE_LIMITS.GENERAL_MAX_BYTES };
}

module.exports = {
  FILE_CATEGORIES,
  MEDIA_SIZE_LIMITS,
  EXTENSION_CATEGORY_MAP,
  classifyFileType,
  validateTelegramMediaLimits
};
