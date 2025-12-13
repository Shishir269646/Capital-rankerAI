// src/routes/v1/portfolio.routes.ts
import { Router as PortfolioRouter } from 'express';
import { portfolioController } from '../../controllers/portfolio.controller';
import { authMiddleware as portfolioAuth } from '../../middleware/auth.middleware';
import { validateRequest as portfolioValidate } from '../../middleware/validation.middleware';
import { updateMetricsValidator } from '../../validators/portfolio.validator';

const portfolioRouter = PortfolioRouter();
portfolioRouter.use(portfolioAuth);

/**
 * @route   GET /api/v1/portfolio
 * @desc    Get all portfolio companies
 * @access  Private
 * @query   status, page, limit
 */
portfolioRouter.get('/', portfolioController.getPortfolio.bind(portfolioController));

/**
 * @route   POST /api/v1/portfolio
 * @desc    Create a new portfolio item linked to a startup
 * @access  Private
 * @body    startup_id: string
 */
portfolioRouter.post('/', portfolioController.createPortfolioItem.bind(portfolioController));

/**
 * @route   GET /api/v1/portfolio/analytics
 * @desc    Get portfolio analytics/summary
 * @access  Private
 */
portfolioRouter.get('/analytics', portfolioController.getAnalytics.bind(portfolioController));

/**
 * @route   GET /api/v1/portfolio/:id
 * @desc    Get single portfolio company by ID
 * @access  Private
 */
portfolioRouter.get('/:id', portfolioController.getPortfolioById.bind(portfolioController));

/**
 * @route   GET /api/v1/portfolio/:id/performance
 * @desc    Get portfolio company performance
 * @access  Private
 */
portfolioRouter.get(
  '/:id/performance',
  portfolioController.getPerformance.bind(portfolioController)
);

/**
 * @route   POST /api/v1/portfolio/:id/update
 * @desc    Update portfolio company metrics
 * @access  Private
 */
portfolioRouter.post(
  '/:id/update',
  portfolioValidate(updateMetricsValidator),
  portfolioController.updateMetrics.bind(portfolioController)
);

export { portfolioRouter };
