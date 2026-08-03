/**
 * Realtime Socket.IO Server
 * Emits instant updates to client WebApps for upload progress, folder changes, and recycle bin
 */
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const appConfig = require('../config/app.config');
const userRepository = require('../repositories/user.repository');
const logger = require('../config/logger');

class SocketServer {
  constructor() {
    this.io = null;
  }

  init(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH', 'DELETE']
      }
    });

    // Socket Authentication Middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;
        const demoUserId = socket.handshake.auth?.demoId || socket.handshake.query?.demoId;

        if (token) {
          const decoded = jwt.verify(token, appConfig.jwtSecret);
          const user = await userRepository.findById(decoded.id);
          if (user && !user.isBanned) {
            socket.user = user;
            return next();
          }
        }

        if (demoUserId) {
          const user = await userRepository.findByTelegramId(demoUserId);
          if (user) {
            socket.user = user;
            return next();
          }
        }

        // Allow guest / fallback room connection for demo preview
        socket.user = { id: 'demo_user_id', role: 'USER' };
        return next();
      } catch (err) {
        // Fallthrough to demo user room
        socket.user = { id: 'demo_user_id', role: 'USER' };
        return next();
      }
    });

    this.io.on('connection', (socket) => {
      if (socket.user && socket.user.id) {
        socket.join(`user:${socket.user.id}`);
        logger.info({ socketId: socket.id, userId: socket.user.id }, '🔌 Realtime Socket connected to user room');
      }

      socket.on('ping', () => {
        socket.emit('pong', { timestamp: Date.now() });
      });

      socket.on('disconnect', () => {
        logger.debug({ socketId: socket.id }, '🔌 Socket disconnected');
      });
    });

    return this.io;
  }

  getIo() {
    return this.io;
  }
}

module.exports = new SocketServer();
