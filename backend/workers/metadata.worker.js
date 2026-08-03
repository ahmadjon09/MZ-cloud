/**
 * Background Metadata Extraction Worker
 * Extracts metadata, tags, and classifies Telegram files
 */
const { classifyFileType } = require('../constants/file-types');

class MetadataWorker {
  extractMetadata(filePayload) {
    const category = classifyFileType(filePayload.fileName, filePayload.mimeType);
    const ext = filePayload.fileName?.split('.').pop()?.toLowerCase() || 'bin';

    let width = filePayload.width || null;
    let height = filePayload.height || null;
    let duration = filePayload.duration || null;

    // Default heuristics for sample media
    if (category === 'PHOTO' && (!width || !height)) {
      width = 1920;
      height = 1080;
    } else if (category === 'VIDEO' && (!width || !height || !duration)) {
      width = 1920;
      height = 1080;
      duration = duration || 45;
    } else if ((category === 'AUDIO' || category === 'VOICE') && !duration) {
      duration = duration || 180;
    }

    return {
      category,
      extension: ext,
      width,
      height,
      duration,
      processedAt: new Date().toISOString()
    };
  }
}

module.exports = new MetadataWorker();
