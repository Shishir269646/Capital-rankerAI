// src/routes/v1/auth.routes.ts
import { Router } from 'express';
import { authController } from '../../controllers/auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  changePasswordValidator,
  updatePreferencesValidator,
} from '../../validators/auth.validator';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  validateRequest(registerValidator),
  authController.register.bind(authController)
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user & get JWT tokens
 * @access  Public
 */
router.post('/login', validateRequest(loginValidator), authController.login.bind(authController));

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post(
  '/refresh-token',
  validateRequest(refreshTokenValidator),
  authController.refreshToken.bind(authController)
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user & invalidate tokens
 * @access  Private
 */
router.post('/logout', authMiddleware, authController.logout.bind(authController));

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authMiddleware, authController.getCurrentUser.bind(authController));

/**
 * @route   PUT /api/v1/auth/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.put(
  '/preferences',
  authMiddleware,
  validateRequest(updatePreferencesValidator),
  authController.updatePreferences.bind(authController)
);

/**
 * @route   PUT /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put(
  '/change-password',
  authMiddleware,
  validateRequest(changePasswordValidator),
  authController.changePassword.bind(authController)
);

export default router;
