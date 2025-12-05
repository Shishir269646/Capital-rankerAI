// src/controllers/auth.controller.ts
import { authService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response.util';
import ActivityLog from '../model/ActivityLog';
import {
  Request as ErrorRequest,
  Response as ErrorResponse,
  NextFunction as ErrorNext,
} from 'express';

export class AuthController {
  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  async register(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { email, password, name, firm_name, role } = req.body;

      // Check if user already exists
      const existingUser = await authService.findUserByEmail(email);
      if (existingUser) {
        res.status(400).json(errorResponse('User with this email already exists', 400));
        return;
      }

      // Create new user
      const user = await authService.registerUser({
        email,
        password,
        name,
        firm_name,
        role: role || 'analyst',
      });

      // Generate JWT tokens
      const tokens = authService.generateTokens(user._id.toString());

      // Save refresh token to Redis
      await authService.saveRefreshToken(user._id.toString(), tokens.refreshToken);

      // Log activity
      await ActivityLog.create({
        user_id: user._id,
        action: 'create',
        entity_type: 'user',
        entity_id: user._id,
        details: { email, firm_name },
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
      });

      res.status(201).json(
        successResponse(
          'User registered successfully',
          {
            user: {
              id: user._id,
              email: user.email,
              name: user.name,
              firm_name: user.firm_name,
              role: user.role,
            },
            tokens,
          },
          201
        )
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  async login(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user and include password field
      const user = await authService.findUserByEmailWithPassword(email);
      if (!user) {
        res.status(401).json(errorResponse('Invalid email or password', 401));
        return;
      }

      // Check if user is active
      if (!user.is_active) {
        res.status(403).json(errorResponse('Account is deactivated. Please contact support.', 403));
        return;
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json(errorResponse('Invalid email or password', 401));
        return;
      }

      // Generate tokens
      const tokens = authService.generateTokens(user._id.toString());

      // Save refresh token
      await authService.saveRefreshToken(user._id.toString(), tokens.refreshToken);

      // Update last login
      user.last_login = new Date();
      await user.save();

      // Log activity
      await ActivityLog.create({
        user_id: user._id,
        action: 'login',
        entity_type: 'user',
        entity_id: user._id,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
      });

      res.status(200).json(
        successResponse('Login successful', {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            firm_name: user.firm_name,
            role: user.role,
            last_login: user.last_login,
          },
          tokens,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh-token
   */
  async refreshToken(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        res.status(400).json(errorResponse('Refresh token is required', 400));
        return;
      }

      // Verify refresh token
      const decoded = authService.verifyRefreshToken(refresh_token);
      if (!decoded) {
        res.status(401).json(errorResponse('Invalid or expired refresh token', 401));
        return;
      }

      // Check if refresh token exists in Redis
      const storedToken = await authService.getRefreshToken(decoded.userId);
      if (storedToken !== refresh_token) {
        res.status(401).json(errorResponse('Invalid refresh token', 401));
        return;
      }

      // Generate new access token
      const newAccessToken = authService.generateAccessToken(decoded.userId);

      res.status(200).json(
        successResponse('Token refreshed successfully', {
          access_token: newAccessToken,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  async logout(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const userId = req.user?.userId; // From auth middleware

      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }

      // Delete refresh token from Redis
      await authService.deleteRefreshToken(userId);

      // Blacklist current access token
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        await authService.blacklistToken(token);
      }

      // Log activity
      await ActivityLog.create({
        user_id: userId,
        action: 'logout',
        entity_type: 'user',
        entity_id: userId,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
      });

      res.status(200).json(successResponse('Logout successful'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   * GET /api/v1/auth/me
   */
  async getCurrentUser(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }

      const user = await authService.findUserById(userId);
      if (!user) {
        res.status(404).json(errorResponse('User not found', 404));
        return;
      }

      res.status(200).json(
        successResponse('User profile retrieved', {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            firm_name: user.firm_name,
            role: user.role,
            preferences: user.preferences,
            profile_picture: user.profile_picture,
            phone: user.phone,
            linkedin_url: user.linkedin_url,
            is_active: user.is_active,
            last_login: user.last_login,
            created_at: user.created_at,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user preferences
   * PUT /api/v1/auth/preferences
   */
  async updatePreferences(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }
      const preferences = req.body;

      const updatedUser = await authService.updateUserPreferences(userId, preferences);

      res.status(200).json(
        successResponse('Preferences updated successfully', {
          preferences: updatedUser.preferences,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password
   * PUT /api/v1/auth/change-password
   */
  async changePassword(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }
      const { current_password, new_password } = req.body;

      const user = await authService.findUserByIdWithPassword(userId);
      if (!user) {
        res.status(404).json(errorResponse('User not found', 404));
        return;
      }

      // Verify current password
      const isPasswordValid = await user.comparePassword(current_password);
      if (!isPasswordValid) {
        res.status(401).json(errorResponse('Current password is incorrect', 401));
        return;
      }

      // Update password
      user.password_hash = new_password;
      await user.save();

      // Invalidate all existing refresh tokens
      await authService.deleteRefreshToken(userId);

      res.status(200).json(successResponse('Password changed successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
