/**
 * Versioned API Router - /api/v1 (MZ-CLOUD)
 * Complete RESTful routes for Telegram Cloud Storage Platform
 * Includes HTTP Range-supported Telegram CDN streaming endpoints (/preview, /stream, /thumbnail, /download)
 */
const express = require('express');
const authController = require('../controllers/auth.controller');
const fileController = require('../controllers/file.controller');
const folderController = require('../controllers/folder.controller');
const searchController = require('../controllers/search.controller');
const adminController = require('../controllers/admin.controller');
const shareController = require('../controllers/share.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const { createRateLimiter } = require('../middlewares/rate-limit.middleware');
const { ROLES } = require('../constants/permissions');
const docsRouter = require('./docs.route');

const {
  createFileSchema,
  bulkCreateFilesSchema,
  updateFileSchema,
  validateRequest
} = require('../validators/file.validator');
const {
  createFolderSchema,
  updateFolderSchema,
  validateFolderRequest
} = require('../validators/folder.validator');

const router = express.Router();

// OpenAPI Swagger Documentation
router.use('/docs', docsRouter);

// Authentication Routes
router.post('/auth/telegram-login', authController.telegramLogin);
router.post('/auth/refresh', authController.refreshToken);
router.get('/auth/me', authMiddleware, authController.getCurrentUser);

// Public Share Link Route
router.get('/share/:token', shareController.getSharedFile);

// File Management Routes (Authenticated + Rate Limited)
const apiLimiter = createRateLimiter({ windowMs: 60000, max: 300, keyPrefix: 'api:' });
router.use(apiLimiter);

router.get('/files', authMiddleware, fileController.listFiles);
router.post('/files', authMiddleware, validateRequest(createFileSchema), fileController.createSingleFile);
router.post('/files/parallel-upload', authMiddleware, validateRequest(bulkCreateFilesSchema), fileController.parallelUpload);
router.delete('/files/recycle-bin/empty', authMiddleware, fileController.emptyRecycleBin);
router.get('/files/:id', authMiddleware, fileController.getFileById);
router.get('/files/:id/thumbnail', authMiddleware, fileController.streamTelegramFile);
router.get('/files/:id/preview', authMiddleware, fileController.streamTelegramFile);
router.get('/files/:id/stream', authMiddleware, fileController.streamTelegramFile);
router.get('/files/:id/download', authMiddleware, fileController.streamTelegramFile);
router.post('/files/:id/send-to-telegram', authMiddleware, fileController.sendToTelegram);
router.patch('/files/:id', authMiddleware, validateRequest(updateFileSchema), fileController.updateFile);
router.post('/files/:id/move', authMiddleware, fileController.moveFile);
router.post('/files/:id/share', authMiddleware, fileController.shareFile);
router.delete('/files/:id', authMiddleware, fileController.deleteToRecycleBin);
router.post('/files/:id/restore', authMiddleware, fileController.restoreFromRecycleBin);
router.delete('/files/:id/permanent', authMiddleware, fileController.permanentDelete);

// Folder Management Routes
router.get('/folders', authMiddleware, folderController.listFolders);
router.post('/folders', authMiddleware, validateFolderRequest(createFolderSchema), folderController.createFolder);
router.get('/folders/:id', authMiddleware, folderController.getFolderById);
router.get('/folders/:id/breadcrumbs', authMiddleware, folderController.getBreadcrumbs);
router.patch('/folders/:id', authMiddleware, validateFolderRequest(updateFolderSchema), folderController.updateFolder);
router.delete('/folders/:id', authMiddleware, folderController.deleteFolder);

// Global Search Route
router.get('/search', authMiddleware, searchController.search);

// Super Admin Panel Routes (Requires ADMIN or SUPER_ADMIN Role)
router.get('/admin/analytics', authMiddleware, requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN), adminController.getAnalytics);
router.get('/admin/users', authMiddleware, requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN), adminController.listUsers);
router.post('/admin/add-admin', authMiddleware, requireRole(ROLES.SUPER_ADMIN), adminController.addAdmin);
router.patch('/admin/users/:id/ban', authMiddleware, requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN), adminController.setUserBanStatus);
router.patch('/admin/users/:id/role', authMiddleware, requireRole(ROLES.SUPER_ADMIN), adminController.updateUserRole);
router.post('/admin/broadcast', authMiddleware, requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN), adminController.broadcastMessage);

module.exports = router;
