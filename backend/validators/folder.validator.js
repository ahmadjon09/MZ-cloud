/**
 * Folder Validation Schemas using Zod (MZ-CLOUD)
 * Resilient schema that transforms empty strings to null and allows any icon name
 */
const { z } = require('zod');

const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(100, 'Folder name too long'),
  parentId: z.string().nullable().optional().transform((val) => (val === '' ? null : val)),
  color: z.string().default('#2481cc'),
  emoji: z.string().default('Folder'),
  isSmart: z.boolean().default(false),
  smartFilter: z.string().nullable().optional().transform((val) => (val === '' ? null : val))
});

const updateFolderSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  parentId: z.string().nullable().optional().transform((val) => (val === '' ? null : val)),
  color: z.string().optional(),
  emoji: z.string().optional(),
  isFavorite: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  isHidden: z.boolean().optional()
});

function validateFolderRequest(schema) {
  return (req, res, next) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ERR_VALIDATION',
          message: 'Invalid folder payload: ' + (err.errors?.[0]?.message || 'Validation error'),
          details: err.errors
        }
      });
    }
  };
}

module.exports = {
  createFolderSchema,
  updateFolderSchema,
  validateFolderRequest
};
