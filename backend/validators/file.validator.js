/**
 * File Request Validation Schemas using Zod
 * Enforces Telegram CDN bot upload size limits (Photos <= 10MB, General Media <= 50MB)
 */
const { z } = require('zod');
const { classifyFileType, validateTelegramMediaLimits } = require('../constants/file-types');

const createFileSchema = z.object({
  fileId: z.string().min(1, 'Telegram fileId is required'),
  uniqueFileId: z.string().min(1, 'Telegram uniqueFileId is required'),
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().nonnegative().default(0),
  mimeType: z.string().default('application/octet-stream'),
  folderId: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  userNotes: z.string().nullable().optional(),
  tags: z.array(z.string()).default([])
}).superRefine((val, ctx) => {
  const category = classifyFileType(val.fileName, val.mimeType);
  const sizeCheck = validateTelegramMediaLimits(category, val.fileSize);
  if (!sizeCheck.valid) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: sizeCheck.message,
      path: ['fileSize']
    });
  }
});

const bulkCreateFilesSchema = z.object({
  files: z.array(createFileSchema).min(1, 'At least one file is required')
});

const updateFileSchema = z.object({
  fileName: z.string().min(1).optional(),
  folderId: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  userNotes: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  isFavorite: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  isArchived: z.boolean().optional()
});

function validateRequest(schema) {
  return (req, res, next) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERR_VALIDATION',
          message: 'Invalid request payload or media size exceeds Telegram Bot limits',
          details: err.errors
        }
      });
    }
  };
}

module.exports = {
  createFileSchema,
  bulkCreateFilesSchema,
  updateFileSchema,
  validateRequest
};
