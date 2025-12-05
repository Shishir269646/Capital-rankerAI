import { portfolioService } from '../services/portfolio.service';

import { successResponse, errorResponse } from '../utils/response.util';
import {
  Request as ErrorRequest,
  Response as ErrorResponse,
  NextFunction as ErrorNext,
} from 'express';

export class PortfolioController {
  /**
   * Get all portfolio companies
   * GET /api/v1/portfolio
   */
  async getPortfolio(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }
      const { status, page = 1, limit = 20 } = req.query;

      const portfolio = await portfolioService.getPortfolio(userId, {
        status: status as string,
        page: Number(page),
        limit: Number(limit),
      });

      res.status(200).json(successResponse('Portfolio retrieved', portfolio));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get portfolio company performance
   * GET /api/v1/portfolio/:id/performance
   */
  async getPerformance(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }

      const performance = await portfolioService.getPortfolioPerformance(id, userId);

      if (!performance) {
        res.status(404).json(errorResponse('Portfolio company not found', 404));
        return;
      }

      res.status(200).json(successResponse('Performance data retrieved', performance));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update portfolio company metrics
   * POST /api/v1/portfolio/:id/update
   */
  async updateMetrics(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }
      const metrics = req.body;

      const updated = await portfolioService.updatePortfolioMetrics(id, userId, metrics);

      if (!updated) {
        res.status(404).json(errorResponse('Portfolio company not found', 404));
        return;
      }

      res.status(200).json(successResponse('Metrics updated', { portfolio: updated }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get portfolio analytics/summary
   * GET /api/v1/portfolio/analytics
   */
  async getAnalytics(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }

      const analytics = await portfolioService.getPortfolioAnalytics(userId);

      res.status(200).json(successResponse('Analytics retrieved', analytics));
    } catch (error) {
      next(error);
    }
  }
}

export const portfolioController = new PortfolioController();
