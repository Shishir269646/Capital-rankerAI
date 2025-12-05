// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { errorResponse } from '../utils/response.util';
import User from '../model/User';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json(errorResponse('No token provided. Please authenticate.', 401));
      return;
    }

    const token = authHeader.split(' ')[1];

    // Check if token is blacklisted
    const isBlacklisted = await authService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      res.status(401).json(errorResponse('Token has been invalidated. Please login again.', 401));
      return;
    }

    // Verify token
    const decoded = authService.verifyAccessToken(token);

    if (!decoded) {
      res.status(401).json(errorResponse('Invalid or expired token. Please login again.', 401));
      return;
    }

    // Get user from database
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json(errorResponse('User not found. Please login again.', 401));
      return;
    }

    // Check if user is active
    if (!user.is_active) {
      res
        .status(403)
        .json(errorResponse('Your account has been deactivated. Please contact support.', 403));
      return;
    }

    // Attach user to request
    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json(errorResponse('Authentication failed', 500));
  }
};

/**
 * Role-based authorization middleware
 * Checks if user has required role
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(errorResponse('Authentication required', 401));
      return;
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      res
        .status(403)
        .json(errorResponse(`Access denied. Required role: ${allowedRoles.join(' or ')}`, 403));
      return;
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require authentication
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = authService.verifyAccessToken(token);

      if (decoded) {
        const user = await User.findById(decoded.userId);
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
  } catch (error) {
    // Continue without authentication
    next();
  }
};
