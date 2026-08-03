/**
 * Upload Processing Async Queue & Worker Pool
 * Handles parallel upload processing without blocking the Event Loop
 */
const logger = require('../config/logger');
const fileService = require('../services/file.service');
const redisClient = require('../config/redis');

class UploadQueue {
  constructor() {
    this.queueKey = 'tgcloud:queue:uploads';
    this.processing = false;
    this.concurrency = parseInt(process.env.WORKER_POOL_SIZE || '4', 10);
    this.activeWorkers = 0;
  }

  /**
   * Enqueue a batch of file upload tasks for a user
   * @param {string} userId
   * @param {Array} filesPayloadArray
   */
  async enqueueBatch(userId, filesPayloadArray, io = null) {
    const job = {
      id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      files: filesPayloadArray,
      timestamp: Date.now()
    };

    await redisClient.rpush(this.queueKey, JSON.stringify(job));
    logger.info({ jobId: job.id, count: filesPayloadArray.length }, '📥 Enqueued upload batch');

    // Trigger processing asynchronously without blocking event loop
    setImmediate(() => this.processNext(io));

    return job.id;
  }

  async processNext(io = null) {
    if (this.activeWorkers >= this.concurrency) {
      return;
    }

    const rawJob = await redisClient.lpop(this.queueKey);
    if (!rawJob) {
      return;
    }

    this.activeWorkers++;

    try {
      const job = JSON.parse(rawJob);
      logger.info({ jobId: job.id }, '⚙️ Processing batch upload job');

      const createdFiles = await fileService.registerParallelTelegramFiles(
        job.userId,
        job.files,
        io
      );

      logger.info(
        { jobId: job.id, createdCount: createdFiles.length },
        '✅ Batch upload job completed'
      );
    } catch (err) {
      logger.error({ err: err.message }, '❌ Error processing upload job');
    } finally {
      this.activeWorkers--;
      // Check for remaining items
      setImmediate(() => this.processNext(io));
    }
  }

  async getQueueLength() {
    return redisClient.llen(this.queueKey);
  }
}

module.exports = new UploadQueue();
