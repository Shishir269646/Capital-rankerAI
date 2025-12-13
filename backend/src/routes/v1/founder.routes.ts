// src/routes/v1/founder.routes.ts
import { Router as FounderRouter } from 'express';
import { founderController } from '../../controllers/founder.controller';
import { authMiddleware as founderAuth } from '../../middleware/auth.middleware';
import { validateRequest as founderValidate } from '../../middleware/validation.middleware';
import { updateFounderValidator, createFounderValidator } from '../../validators/founder.validator';

const founderRouter = FounderRouter();
founderRouter.use(founderAuth);

/**
 * @route   POST /api/v1/founders
 * @desc    Create a new founder profile
 * @access  Private
 */
founderRouter.post(
  '/',
  founderValidate(createFounderValidator), // Assuming a validator exists or will be created
  founderController.createFounder.bind(founderController)
);

/**
 * @route   POST /api/v1/founders/evaluate/:founderId
 * @desc    Evaluate a founder using AI/ML
 * @access  Private
 */
founderRouter.post(
  '/evaluate/:founderId',
  founderController.evaluateFounder.bind(founderController)
);

/**
 * @route   GET /api/v1/founders/:id
 * @desc    Get founder profile
 * @access  Private
 */
founderRouter.get('/:id', founderController.getFounderProfile.bind(founderController));

/**
 * @route   GET /api/v1/founders/startup/:startupId
 * @desc    Get all founders by startup
 * @access  Private
 */
founderRouter.get(
  '/startup/:startupId',
  founderController.getFoundersByStartup.bind(founderController)
);

/**
 * @route   PUT /api/v1/founders/:id
 * @desc    Update founder information
 * @access  Private
 */
founderRouter.put(
  '/:id',
  founderValidate(updateFounderValidator),
  founderController.updateFounder.bind(founderController)
);

export { founderRouter };
