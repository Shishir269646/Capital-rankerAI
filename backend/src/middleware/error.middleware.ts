import {
  Request as ErrorRequest,
  Response as ErrorResponse,
  NextFunction as ErrorNext,
} from 'express';
import { errorResponse } from '../utils/response.util';

/**
 * Custom error class
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  error: Error | AppError,
  req: ErrorRequest,
  res: ErrorResponse,
  _next: ErrorNext // eslint-disable-line @typescript-eslint/no-unused-vars -- Next is required for error handling middleware
): void => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
  });

  // Default error values
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle custom AppError
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Handle Mongoose validation errors
  if ((error as any).name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    const mongoError = error as any;
    const errors = Object.values(mongoError.errors).map((err: any) => ({
      field: err.path,
      message: err.message,
    }));
    res.status(statusCode).json(errorResponse(message, statusCode, errors));
    return;
  }

  // Handle Mongoose duplicate key error
  if ((error as any).name === 'MongoServerError' && (error as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry found';
    const field = Object.keys((error as any).keyPattern)[0];
    res
      .status(statusCode)
      .json(errorResponse(message, statusCode, [{ field, message: `${field} already exists` }]));
    return;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if ((error as any).name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Handle JWT errors
  if ((error as any).name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if ((error as any).name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Send error response
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

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: ErrorRequest, res: ErrorResponse, _next: ErrorNext): void => {
  res.status(404).json(errorResponse(`Route ${req.originalUrl} not found`, 404));
};
