"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const error_util_1 = require("../utils/error.util");
const authorizeRole = (requiredRoles) => {
    return (req, _res, _next) => {
        if (!req.user) {
            return _next(new error_util_1.CustomError(500, 'User role check failed: Authentication middleware did not run.'));
        }
        const userRole = req.user.role;
        if (!requiredRoles.includes(userRole)) {
            return _next(new error_util_1.CustomError(403, `Access denied. Role "${userRole}" cannot access this resource.`));
        }
        _next();
    };
};
exports.authorizeRole = authorizeRole;
//# sourceMappingURL=role.middleware.js.map