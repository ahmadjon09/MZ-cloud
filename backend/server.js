/**
 * MZ-CLOUD - Telegram CDN Cloud Storage Platform API Server
 * Production-ready Enterprise Architecture (Render & Vercel compatible)
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const pinoHttp = require('pino-http');

const appConfig = require('./config/app.config');
const logger = require('./config/logger');
const prisma = require('./config/database');
const redisClient = require('./config/redis');
const socketServer = require('./socket/socket.server');
const telegramBot = require('./telegram/bot');
const { initCronJobs } = require('./cron/cleanup.cron');
const { default: axios } = require('axios');
const securityMiddleware = require('./middlewares/security.middleware');
const errorHandler = require('./middlewares/error.middleware');
const apiV1Router = require('./routes/api.v1');

const app = express();
const server = http.createServer(app);

// Initialize Realtime Socket.IO Server
const io = socketServer.init(server);
app.set('io', io);

// Security & Performance Middlewares
app.use(securityMiddleware);

// Explicit Cross-Origin Headers for Vercel -> Render Media Streams
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Telegram-Init-Data, X-Telegram-User-Id, X-Telegram-User-Data, X-Demo-User-Id');
  next();
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Telegram-Init-Data',
    'X-Telegram-User-Id',
    'X-Telegram-User-Data',
    'X-Demo-User-Id'
  ],
  exposedHeaders: ['X-Access-Token', 'X-Refresh-Token']
}));
app.use(compression());

// Body Parsers
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(pinoHttp({ logger }));
}

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  let dbStatus = 'ONLINE';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (e) {
    dbStatus = 'OFFLINE';
  }

  res.status(200).json({
    status: 'HEALTHY',
    appName: 'MZ-CLOUD',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
    database: dbStatus,
    redis: 'ACTIVE',
    cdnStorage: 'TELEGRAM_CDN_ONLY'
  });
});

// API Version 1 Routes
app.use('/api/v1', apiV1Router);

const keepServerAlive = () => {
  if (!process.env.BASE_URL) {
    console.warn('⚠️ BASE_URL is not set. Skipping ping.')
    return
  }

  setInterval(() => {
    axios
      .get(`${process.env.BASE_URL}/api/health`)
      .then(() => console.log('🔄 Server active'))
      .catch(err => console.log('⚠️ Ping failed:', err.message))
  }, 10 * 60 * 1000)
}

keepServerAlive()
// Serve Frontend build in Production if present
const clientDistPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDistPath));
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api/') || req.originalUrl.startsWith('/socket.io/')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).json({
        success: false,
        error: {
          code: 'ERR_NOT_FOUND',
          message: 'MZ-CLOUD frontend bundle not found. Please build client using npm run build:client.'
        }
      });
    }
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Initialize Telegram Bot and Scheduled Cron Tasks
telegramBot.init(io);
initCronJobs();

// Start HTTP Server
const PORT = appConfig.port || 5000;
server.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 ==========================================================`);
  logger.info(`✨ MZ-CLOUD Server running on port ${PORT}`);
  logger.info(`📚 OpenAPI Documentation available at http://localhost:${PORT}/api/v1/docs`);
  logger.info(`🔍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🚀 ==========================================================`);
});

// Graceful Shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = { app, server };
