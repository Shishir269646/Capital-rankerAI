import {
  Request as ErrorRequest,
  Response as ErrorResponse,
  NextFunction as ErrorNext,
} from 'express';
import morgan from 'morgan';
import { logger } from '../config/logger';

/**
 * HTTP request logger using Morgan
 */
export const httpLogger = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: {
    write: (message: string) => {
      logger.http(message.trim());
    },
  },
  skip: (req) => {
    // Skip logging for health check endpoint
    return req.url === '/api/health';
  },
});

/**
 * Request logger middleware
 * Logs detailed request information
 */
export const requestLogger = (req: ErrorRequest, res: ErrorResponse, next: ErrorNext): void => {
  const start = Date.now();

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      userId: req.user?.userId || 'anonymous',
    };

    if (res.statusCode >= 400) {
      logger.error('Request failed', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });

  next();
};

/**
 * Async error wrapper
 * Catches async errors and passes to error handler
 */
export const asyncHandler = (
  fn: (req: ErrorRequest, res: ErrorResponse, next: ErrorNext) => Promise<any>
) => {
  return (req: ErrorRequest, res: ErrorResponse, next: ErrorNext): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
