import { Request } from 'express';
import rateLimit from 'express-rate-limit';

/**
 * General API Rate Limiter
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increased for development purposes
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.',
    code: 429,
  },
  standardHeaders: true,
});

/**
 * Authentication Route Rate Limiter
 * 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later.',
    code: 429,
  },
});

/**
 * Login Rate Limiter
 * 5 requests per 1 minute per IP
 */
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50, // Increased for development purposes
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again later.',
    code: 429,
  },
});

/**
 * Signup Rate Limiter
 * 3 requests per 1 minute per IP
 */
export const signupLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: {
    status: 'error',
    message: 'Too many signup attempts, please try again later.',
    code: 429,
  },
});

/**
 * Scoring Limiter
 * 20 scoring requests per hour per user
 */
export const scoringLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    status: 'error',
    message: 'Scoring quota exceeded. Please upgrade your plan or try again later.',
    code: 429,
  },
  keyGenerator: (req: Request) => {
    // userId for logged-in users, otherwise fallback to IP
    return req.user?.userId || req.ip || 'anonymous';
  },
});
