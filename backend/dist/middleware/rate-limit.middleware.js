"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoringLimiter = exports.signupLimiter = exports.loginLimiter = exports.authLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again later.',
        code: 429,
    },
    standardHeaders: true,
});
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        status: 'error',
        message: 'Too many authentication attempts, please try again later.',
        code: 429,
    },
});
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        status: 'error',
        message: 'Too many login attempts, please try again later.',
        code: 429,
    },
});
exports.signupLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 3,
    message: {
        status: 'error',
        message: 'Too many signup attempts, please try again later.',
        code: 429,
    },
});
exports.scoringLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: {
        status: 'error',
        message: 'Scoring quota exceeded. Please upgrade your plan or try again later.',
        code: 429,
    },
    keyGenerator: (req) => {
        return req.user?.userId || req.ip || 'anonymous';
    },
});
//# sourceMappingURL=rate-limit.middleware.js.map