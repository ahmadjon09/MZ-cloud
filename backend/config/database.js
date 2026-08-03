/**
 * Singleton Prisma Database Connection
 */
const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});

prisma
  .$connect()
  .then(() => {
    logger.info('✅ Database connected successfully');
  })
  .catch((err) => {
    logger.error({ err }, '❌ Database connection failed');
  });

module.exports = prisma;
