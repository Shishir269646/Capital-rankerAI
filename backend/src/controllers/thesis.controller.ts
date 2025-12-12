// ============================================
// src/controllers/thesis.controller.ts
import { thesisService } from '../services/thesis.service';

import { successResponse, errorResponse } from '../utils/response.util';
import ActivityLog from '../model/ActivityLog';
import {
  Request as ErrorRequest,
  Response as ErrorResponse,
  NextFunction as ErrorNext,
} from 'express';

export class ThesisController {
  /**
   * Create new investment thesis
   * POST /api/v1/thesis
   */
  async createThesis(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }
      const thesisData = {
        ...req.body,
        investor_id: userId,
      };

      const thesis = await thesisService.createThesis(thesisData);

      // Log activity
      await ActivityLog.create({
        user_id: userId,
        action: 'create',
        entity_type: 'thesis',
        entity_id: thesis._id,
        ip_address: req.ip,
      });

      res.status(201).json(successResponse('Thesis created successfully', { thesis }, 201));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update existing thesis
   * PUT /api/v1/thesis/:id
   */
  async updateThesis(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }
      const updateData = req.body;

      const thesis = await thesisService.updateThesis(id, userId, updateData);

      if (!thesis) {
        res.status(404).json(errorResponse('Thesis not found or unauthorized', 404));
        return;
      }

      // Trigger re-matching for all active deals
      await thesisService.triggerReMatching(thesis._id);

      res.status(200).json(successResponse('Thesis updated successfully', { thesis }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get investor thesis by ID
   * GET /api/v1/thesis/:id
   */
  async getInvestorThesisById(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }

      const thesis = await thesisService.getInvestorThesisById(id, userId);

      if (!thesis) {
        res.status(404).json(errorResponse('Investor Thesis not found', 404));
        return;
      }

      res.status(200).json(successResponse('Investor Thesis retrieved', thesis));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get thesis matches for a deal
   * GET /api/v1/thesis/matches/:dealId
   */
  async getThesisMatches(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { dealId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }

      const matches = await thesisService.matchDealWithThesis(dealId, userId);

      res.status(200).json(successResponse('Thesis matches retrieved', matches));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get top matching deals for investor's thesis
   * GET /api/v1/thesis/investor/:investorId/matches
   */
  async getInvestorMatches(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { investorId } = req.params;
      const { limit = 20, min_score = 60 } = req.query;

      const matches = await thesisService.getTopMatchesForInvestor(
        investorId,
        Number(limit),
        Number(min_score)
      );

      res.status(200).json(successResponse('Top matches retrieved', matches));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all theses for an investor
   * GET /api/v1/thesis/investor/:investorId
   */
  async getInvestorTheses(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { investorId } = req.params;
      const { include_inactive = false } = req.query;

      const theses = await thesisService.getInvestorTheses(investorId, include_inactive === 'true');

      res.status(200).json(successResponse('Theses retrieved', { theses }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Analyze thesis-deal alignment
   * POST /api/v1/thesis/analyze
   */
  async analyzeAlignment(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { thesis_id, deal_id } = req.body;

      const analysis = await thesisService.analyzeThesisDealAlignment(thesis_id, deal_id);

      res.status(200).json(successResponse('Alignment analysis completed', analysis));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deactivate thesis
   * DELETE /api/v1/thesis/:id
   */
  async deactivateThesis(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }

      const thesis = await thesisService.deactivateThesis(id, userId);

      if (!thesis) {
        res.status(404).json(errorResponse('Thesis not found or unauthorized', 404));
        return;
      }

      res.status(200).json(successResponse('Thesis deactivated successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export const thesisController = new ThesisController();
