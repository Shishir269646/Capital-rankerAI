// src/controllers/founder.controller.ts
import { founderService } from '../services/founder.service';
import { successResponse, errorResponse } from '../utils/response.util';
import ActivityLog from '../model/ActivityLog';
import {
  Request as ErrorRequest,
  Response as ErrorResponse,
  NextFunction as ErrorNext,
} from 'express';

export class FounderController {
  /**
   * Evaluate a founder
   * POST /api/v1/founders/evaluate/:founderId
   */
  async evaluateFounder(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { founderId } = req.params;
      const userId = req.user?.userId;

      const evaluation = await founderService.evaluateFounder(founderId);

      if (!evaluation) {
        res.status(404).json(errorResponse('Founder not found or evaluation failed', 404));
        return;
      }

      await ActivityLog.create({
        user_id: userId,
        action: 'founder_evaluated',
        entity_type: 'founder',
        entity_id: founderId,
        details: { score: evaluation.founder_score?.overall_score },
        ip_address: req.ip,
      });

      res.status(200).json(successResponse('Founder evaluated successfully', { evaluation }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get founder profile
   * GET /api/v1/founders/:id
   */
  async getFounderProfile(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { id } = req.params;
      const founder = await founderService.getFounderById(id);

      if (!founder) {
        res.status(404).json(errorResponse('Founder not found', 404));
        return;
      }

      res.status(200).json(successResponse('Founder profile retrieved', { founder }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update founder information
   * PUT /api/v1/founders/:id
   */
  async updateFounder(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user?.userId;

      const founder = await founderService.updateFounder(id, updateData);

      if (!founder) {
        res.status(404).json(errorResponse('Founder not found', 404));
        return;
      }

      await ActivityLog.create({
        user_id: userId,
        action: 'update',
        entity_type: 'founder',
        entity_id: founder._id,
        ip_address: req.ip,
      });

      res.status(200).json(successResponse('Founder updated successfully', { founder }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get founders by startup
   * GET /api/v1/founders/startup/:startupId
   */
  async getFoundersByStartup(
    req: ErrorRequest,
    res: ErrorResponse,
    next: ErrorNext
  ): Promise<void> {
    try {
      const { startupId } = req.params;
      const founders = await founderService.getFoundersByStartup(startupId);

      res.status(200).json(successResponse('Founders retrieved', { founders }));
    } catch (error) {
      next(error);
    }
  }
}

export const founderController = new FounderController();
