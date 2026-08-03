/**
 * RBAC Role Checking Middleware
 */
const { ROLES } = require('../constants/permissions');
const { ERR_FORBIDDEN } = require('../constants/error-codes');

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'ERR_UNAUTHORIZED',
          message: 'Not authenticated'
        }
      });
    }

    // Super Admin has access to all admin endpoints
    if (req.user.role === ROLES.SUPER_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: ERR_FORBIDDEN,
          message: `Forbidden: Requires role(s) [${allowedRoles.join(', ')}]`
        }
      });
    }

    next();
  };
}

module.exports = {
  requireRole
};
