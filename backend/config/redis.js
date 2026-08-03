/**
 * Resilient Redis Client with transparent in-memory fallback for local/sandbox environments
 * Senior Node.js / Infrastructure Engineering
 */
const Redis = require('ioredis');
const logger = require('./logger');

class InMemoryRedisFallback {
  constructor() {
    this.store = new Map();
    this.expiry = new Map();
    this.lists = new Map();
    logger.warn('⚡ Using high-performance InMemoryRedisFallback (Sandbox/Dev mode)');
  }

  async get(key) {
    if (this.isExpired(key)) return null;
    return this.store.get(key) || null;
  }

  async set(key, value, mode, duration) {
    this.store.set(key, String(value));
    if (mode === 'EX' && duration) {
      this.expiry.set(key, Date.now() + duration * 1000);
    }
    return 'OK';
  }

  async setex(key, seconds, value) {
    return this.set(key, value, 'EX', seconds);
  }

  async del(key) {
    let deleted = 0;
    const keys = Array.isArray(key) ? key : [key];
    for (const k of keys) {
      if (this.store.has(k)) {
        this.store.delete(k);
        this.expiry.delete(k);
        deleted++;
      }
    }
    return deleted;
  }

  async keys(pattern) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    const result = [];
    for (const k of this.store.keys()) {
      if (!this.isExpired(k) && regex.test(k)) {
        result.push(k);
      }
    }
    return result;
  }

  async flushall() {
    this.store.clear();
    this.expiry.clear();
    this.lists.clear();
    return 'OK';
  }

  async rpush(key, ...values) {
    if (!this.lists.has(key)) {
      this.lists.set(key, []);
    }
    const list = this.lists.get(key);
    for (const v of values) {
      list.push(String(v));
    }
    return list.length;
  }

  async lpop(key) {
    if (!this.lists.has(key)) return null;
    const list = this.lists.get(key);
    const item = list.shift() || null;
    return item;
  }

  async llen(key) {
    if (!this.lists.has(key)) return 0;
    return this.lists.get(key).length;
  }

  isExpired(key) {
    if (!this.expiry.has(key)) return false;
    if (Date.now() > this.expiry.get(key)) {
      this.store.delete(key);
      this.expiry.delete(key);
      return true;
    }
    return false;
  }
}

let redisClient = null;

try {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  const realRedis = new Redis(url, {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 2) {
        return null; // Stop retrying and fallback
      }
      return Math.min(times * 100, 1000);
    }
  });

  realRedis.on('connect', () => {
    logger.info('✅ Redis Server connected');
  });

  realRedis.on('error', (err) => {
    if (!redisClient || !(redisClient instanceof InMemoryRedisFallback)) {
      logger.warn('⚠️ Redis server unreachable, switching to InMemoryRedisFallback');
      redisClient = new InMemoryRedisFallback();
    }
  });

  redisClient = realRedis;
} catch (err) {
  logger.warn('⚡ Using InMemoryRedisFallback due to init error');
  redisClient = new InMemoryRedisFallback();
}

module.exports = redisClient;
