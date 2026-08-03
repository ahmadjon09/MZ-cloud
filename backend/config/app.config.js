/**
 * Centralized Application Configuration
 */
module.exports = {
  port: parseInt(process.env.PORT || '5000', 10),
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'tg_cloud_super_secret_jwt_key_2026_enterprise',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'tg_cloud_super_secret_refresh_jwt_key_2026_enterprise',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  adminTelegramId: process.env.ADMIN_TELEGRAM_ID || '777000',
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  botUsername: process.env.TELEGRAM_BOT_USERNAME || 'TGCloudStorageBot',
  webAppUrl: process.env.WEBAPP_URL || 'http://localhost:5173',
  maxParallelUploads: parseInt(process.env.MAX_PARALLEL_UPLOADS || '10', 10),
  workerPoolSize: parseInt(process.env.WORKER_POOL_SIZE || '4', 10),
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '2000', 10)
};
