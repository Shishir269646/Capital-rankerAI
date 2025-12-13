"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.authMiddleware = void 0;
const auth_service_1 = require("../services/auth.service");
const response_util_1 = require("../utils/response.util");
const User_1 = __importDefault(require("../model/User"));
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json((0, response_util_1.errorResponse)('No token provided. Please authenticate.', 401));
            return;
        }
        const token = authHeader.split(' ')[1];
        const isBlacklisted = await auth_service_1.authService.isTokenBlacklisted(token);
        if (isBlacklisted) {
            res.status(401).json((0, response_util_1.errorResponse)('Token has been invalidated. Please login again.', 401));
            return;
        }
        const decoded = auth_service_1.authService.verifyAccessToken(token);
        if (!decoded) {
            res.status(401).json((0, response_util_1.errorResponse)('Invalid or expired token. Please login again.', 401));
            return;
        }
        const user = await User_1.default.findById(decoded.userId);
        if (!user) {
            res.status(401).json((0, response_util_1.errorResponse)('User not found. Please login again.', 401));
            return;
        }
        if (!user.is_active) {
            res
                .status(403)
                .json((0, response_util_1.errorResponse)('Your account has been deactivated. Please contact support.', 403));
            return;
        }
        req.user = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json((0, response_util_1.errorResponse)('Authentication failed', 500));
    }
};
exports.authMiddleware = authMiddleware;
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json((0, response_util_1.errorResponse)('Authentication required', 401));
            return;
        }
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            res
                .status(403)
                .json((0, response_util_1.errorResponse)(`Access denied. Required role: ${allowedRoles.join(' or ')}`, 403));
            return;
        }
        next();
    };
};
exports.authorize = authorize;
const optionalAuth = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = auth_service_1.authService.verifyAccessToken(token);
            if (decoded) {
                const user = await User_1.default.findById(decoded.userId);
                if (user && user.is_active) {
                    req.user = {
                        userId: user._id.toString(),
                        email: user.email,
                        role: user.role,
                    };
                }
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.middleware.js.map