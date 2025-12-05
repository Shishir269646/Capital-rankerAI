// src/routes/v1/thesis.routes.ts
import { Router as ThesisRouter } from 'express';
import { thesisController } from '../../controllers/thesis.controller';
import { authMiddleware as thesisAuth } from '../../middleware/auth.middleware';
import { validateRequest as thesisValidate } from '../../middleware/validation.middleware';
import {
  createThesisValidator,
  updateThesisValidator,
  analyzeAlignmentValidator,
} from '../../validators/thesis.validator';

const thesisRouter = ThesisRouter();
thesisRouter.use(thesisAuth);

/**
 * @route   POST /api/v1/thesis
 * @desc    Create new investment thesis
 * @access  Private
 */
thesisRouter.post(
  '/',
  thesisValidate(createThesisValidator),
  thesisController.createThesis.bind(thesisController)
);

/**
 * @route   PUT /api/v1/thesis/:id
 * @desc    Update existing thesis
 * @access  Private
 */
thesisRouter.put(
  '/:id',
  thesisValidate(updateThesisValidator),
  thesisController.updateThesis.bind(thesisController)
);

/**
 * @route   GET /api/v1/thesis/matches/:dealId
 * @desc    Get thesis matches for a deal
 * @access  Private
 */
thesisRouter.get('/matches/:dealId', thesisController.getThesisMatches.bind(thesisController));

/**
 * @route   GET /api/v1/thesis/investor/:investorId/matches
 * @desc    Get top matching deals for investor's thesis
 * @access  Private
 */
thesisRouter.get(
  '/investor/:investorId/matches',
  thesisController.getInvestorMatches.bind(thesisController)
);

/**
 * @route   GET /api/v1/thesis/investor/:investorId
 * @desc    Get all theses for an investor
 * @access  Private
 */
thesisRouter.get(
  '/investor/:investorId',
  thesisController.getInvestorTheses.bind(thesisController)
);

/**
 * @route   POST /api/v1/thesis/analyze
 * @desc    Analyze thesis-deal alignment in detail
 * @access  Private
 */
thesisRouter.post(
  '/analyze',
  thesisValidate(analyzeAlignmentValidator),
  thesisController.analyzeAlignment.bind(thesisController)
);

/**
 * @route   DELETE /api/v1/thesis/:id
 * @desc    Deactivate thesis
 * @access  Private
 */
thesisRouter.delete('/:id', thesisController.deactivateThesis.bind(thesisController));

export { thesisRouter };
