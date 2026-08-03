/**
 * Realtime Event Constants for Socket.IO & Internal Bus
 */
module.exports = {
  UPLOAD_STARTED: 'upload:started',
  UPLOAD_PROGRESS: 'upload:progress',
  UPLOAD_COMPLETED: 'upload:completed',
  UPLOAD_FAILED: 'upload:failed',
  FILE_CREATED: 'file:created',
  FILE_UPDATED: 'file:updated',
  FILE_MOVED: 'file:moved',
  FILE_DELETED: 'file:deleted',
  FILE_RESTORED: 'file:restored',
  FOLDER_CREATED: 'folder:created',
  FOLDER_UPDATED: 'folder:updated',
  FOLDER_DELETED: 'folder:deleted',
  SEARCH_INDEXED: 'search:indexed',
  STATS_UPDATED: 'stats:updated',
  NOTIFICATION: 'notification'
};
