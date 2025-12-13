"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = exports.AppError = void 0;
const response_util_1 = require("../utils/response.util");
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (error, req, res, _next) => {
    console.error('Error:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
    });
    let statusCode = 500;
    let message = 'Internal server error';
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    }
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation error';
        const mongoError = error;
        const errors = Object.values(mongoError.errors).map((err) => ({
            field: err.path,
            message: err.message,
        }));
        res.status(statusCode).json((0, response_util_1.errorResponse)(message, statusCode, errors));
        return;
    }
    if (error.name === 'MongoServerError' && error.code === 11000) {
        statusCode = 409;
        message = 'Duplicate entry found';
        const field = Object.keys(error.keyPattern)[0];
        res
            .status(statusCode)
            .json((0, response_util_1.errorResponse)(message, statusCode, [{ field, message: `${field} already exists` }]));
        return;
    }
    if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }
    if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }
    res.status(statusCode).json({
        status: 'error',
        message,
        code: statusCode,
        ...(process.env.NODE_ENV === 'development' && {
            stack: error.stack,
            error,
        }),
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res, _next) => {
    res.status(404).json((0, response_util_1.errorResponse)(`Route ${req.originalUrl} not found`, 404));
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=error.middleware.js.map