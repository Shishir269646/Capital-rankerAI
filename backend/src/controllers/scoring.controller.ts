// src/controllers/scoring.controller.ts

import { scoringService } from '../services/scoring.service';
import { successResponse, errorResponse } from '../utils/response.util';
import ActivityLog from '../model/ActivityLog';
import {
  Request as ErrorRequest,
  Response as ErrorResponse,
  NextFunction as ErrorNext,
} from 'express';

export class ScoringController {
  /**
   * Score a deal using AI/ML
   * POST /api/v1/scoring/deal/:dealId
   */
  async scoreDeal(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { dealId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }

      // Get user preferences for custom weights
      const customWeights = req.body.custom_weights;

      const score = await scoringService.scoreDeal(dealId, userId, customWeights);

      if (!score) {
        res.status(404).json(errorResponse('Deal not found or scoring failed', 404));
        return;
      }

      // Log activity
      await ActivityLog.create({
        user_id: userId,
        action: 'score_generated',
        entity_type: 'score',
        entity_id: score._id,
        details: { startup_id: dealId, score: score.investment_fit_score },
        ip_address: req.ip,
      });

      res.status(200).json(successResponse('Deal scored successfully', { score }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get scoring history for a deal
   * GET /api/v1/scoring/deal/:dealId/history
   */
  async getScoringHistory(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { dealId } = req.params;
      const { limit = 10 } = req.query;

      const history = await scoringService.getScoringHistory(dealId, Number(limit));

      res.status(200).json(successResponse('Scoring history retrieved', { history }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Batch score multiple deals
   * POST /api/v1/scoring/batch
   */
  async batchScore(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { deal_ids } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }

      if (!Array.isArray(deal_ids) || deal_ids.length === 0) {
        res.status(400).json(errorResponse('deal_ids array is required', 400));
        return;
      }

      // Queue batch scoring job
      const job = await scoringService.queueBatchScoring(deal_ids, userId);

      res.status(202).json(
        successResponse('Batch scoring job queued', {
          job_id: job.jobId,
          status: 'pending',
          total_deals: deal_ids.length,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get batch scoring job status
   * GET /api/v1/scoring/batch/:jobId/status
   */
  async getBatchJobStatus(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { jobId } = req.params;

      const status = await scoringService.getBatchJobStatus(jobId);

      if (!status) {
        res.status(404).json(errorResponse('Job not found', 404));
        return;
      }

      res.status(200).json(successResponse('Job status retrieved', status));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Recalculate all scores (admin only)
   * POST /api/v1/scoring/recalculate-all
   */
  async recalculateAll(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }
      const userRole = req.user?.role;

      if (userRole !== 'admin') {
        res.status(403).json(errorResponse('Admin access required', 403));
        return;
      }

      const job = await scoringService.recalculateAllScores(userId);

      res.status(202).json(
        successResponse('Recalculation job started', {
          job_id: job.jobId,
          status: 'pending',
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get score comparison between deals
   * POST /api/v1/scoring/compare
   */
  async compareScores(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { deal_ids } = req.body;

      if (!Array.isArray(deal_ids) || deal_ids.length < 2) {
        res.status(400).json(errorResponse('At least 2 deal IDs required for comparison', 400));
        return;
      }

      const comparison = await scoringService.compareDeals(deal_ids);

      res.status(200).json(successResponse('Deals compared successfully', comparison));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all batch scoring job statuses
   * GET /api/v1/scoring/batch/status
   */
  async getAllBatchScoringJobStatuses(_req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const jobs = await scoringService.getAllBatchScoringJobs(); // Access scoringService directly
      res.status(200).json(successResponse('Batch scoring jobs retrieved successfully', jobs));
    } catch (error) {
      next(error);
    }
  }
}

export const scoringController = new ScoringController();
