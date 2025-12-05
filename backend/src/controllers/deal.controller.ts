// src/controllers/deal.controller.ts
import { dealService } from '../services/deal.service';
import { successResponse, errorResponse } from '../utils/response.util';
import ActivityLog from '../model/ActivityLog';
import {
  Request as ErrorRequest,
  Response as ErrorResponse,
  NextFunction as ErrorNext,
} from 'express';

export class DealController {
  /**
   * Get all deals with pagination, filtering, and sorting
   * GET /api/v1/deals?page=1&limit=20&sector=fintech&score_min=70
   */
  async getAllDeals(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        sector,
        stage,
        status,
        score_min,
        score_max,
        country,
        search,
        sort_by = 'created_at',
        sort_order = 'desc',
      } = req.query;

      const filters: any = {};

      // Build filters
      if (sector) {
        filters.sector = Array.isArray(sector) ? { $in: sector } : sector;
      }
      if (stage) {
        filters.stage = stage;
      }
      if (status) {
        filters.status = status;
      }
      if (country) {
        filters['location.country'] = country;
      }
      if (search) {
        filters.$text = { $search: search as string };
      }

      // Get deals with pagination
      const result = await dealService.getAllDeals({
        page: Number(page),
        limit: Number(limit),
        filters,
        sortBy: sort_by as string,
        sortOrder: sort_order as 'asc' | 'desc',
        scoreMin: score_min ? Number(score_min) : undefined,
        scoreMax: score_max ? Number(score_max) : undefined,
      });

      res.status(200).json(successResponse('Deals retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single deal by ID with full details
   * GET /api/v1/deals/:id
   */
  async getDealById(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const deal = await dealService.getDealById(id);

      if (!deal) {
        res.status(404).json(errorResponse('Deal not found', 404));
        return;
      }

      // Log view activity
      await ActivityLog.create({
        user_id: userId,
        action: 'view',
        entity_type: 'startup',
        entity_id: deal._id,
        ip_address: req.ip,
      });

      res.status(200).json(successResponse('Deal retrieved successfully', { deal }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new deal (manual entry)
   * POST /api/v1/deals
   */
  async createDeal(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const userId = req.user?.userId;
      const dealData = {
        ...req.body,
        source: 'manual',
      };

      const deal = await dealService.createDeal(dealData);

      // Log activity
      await ActivityLog.create({
        user_id: userId,
        action: 'create',
        entity_type: 'startup',
        entity_id: deal._id,
        details: { name: deal.name, sector: deal.sector },
        ip_address: req.ip,
      });

      res.status(201).json(successResponse('Deal created successfully', { deal }, 201));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update deal information
   * PUT /api/v1/deals/:id
   */
  async updateDeal(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const updateData = req.body;

      const deal = await dealService.updateDeal(id, updateData);

      if (!deal) {
        res.status(404).json(errorResponse('Deal not found', 404));
        return;
      }

      // Log activity
      await ActivityLog.create({
        user_id: userId,
        action: 'update',
        entity_type: 'startup',
        entity_id: deal._id,
        details: { updated_fields: Object.keys(updateData) },
        ip_address: req.ip,
      });

      res.status(200).json(successResponse('Deal updated successfully', { deal }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete/Archive a deal
   * DELETE /api/v1/deals/:id
   */
  async deleteDeal(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      // Soft delete - change status to archived
      const deal = await dealService.updateDeal(id, { status: 'archived' });

      if (!deal) {
        res.status(404).json(errorResponse('Deal not found', 404));
        return;
      }

      // Log activity
      await ActivityLog.create({
        user_id: userId,
        action: 'delete',
        entity_type: 'startup',
        entity_id: deal._id,
        ip_address: req.ip,
      });

      res.status(200).json(successResponse('Deal archived successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add note to a deal
   * POST /api/v1/deals/:id/notes
   */
  async addNote(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }

      const deal = await dealService.addNote(id, userId, content);

      if (!deal) {
        res.status(404).json(errorResponse('Deal not found', 404));
        return;
      }

      res.status(200).json(successResponse('Note added successfully', { notes: deal.notes }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get deal statistics/analytics
   * GET /api/v1/deals/stats
   */
  async getDealStats(_req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const stats = await dealService.getDealStatistics();

      res.status(200).json(successResponse('Deal statistics retrieved', stats));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search deals with advanced filters
   * POST /api/v1/deals/search
   */
  async searchDeals(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const {
        query,
        sectors,
        stages,
        min_revenue,
        max_revenue,
        min_growth_rate,
        countries,
        technologies,
        page = 1,
        limit = 20,
      } = req.body;

      const results = await dealService.advancedSearch({
        query,
        sectors,
        stages,
        minRevenue: min_revenue,
        maxRevenue: max_revenue,
        minGrowthRate: min_growth_rate,
        countries,
        technologies,
        page: Number(page),
        limit: Number(limit),
      });

      res.status(200).json(successResponse('Search completed', results));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get top ranked deals
   * GET /api/v1/deals/top-ranked?limit=10
   */
  async getTopRankedDeals(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { limit = 10 } = req.query;

      const deals = await dealService.getTopRankedDeals(Number(limit));

      res.status(200).json(successResponse('Top ranked deals retrieved', { deals }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get similar deals based on a deal
   * GET /api/v1/deals/:id/similar
   */
  async getSimilarDeals(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { id } = req.params;
      const { limit = 5 } = req.query;

      const similarDeals = await dealService.getSimilarDeals(id, Number(limit));

      res.status(200).json(successResponse('Similar deals retrieved', { deals: similarDeals }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Bulk import deals
   * POST /api/v1/deals/bulk-import
   */
  async bulkImport(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { deals } = req.body;
      const userId = req.user?.userId;

      if (!Array.isArray(deals) || deals.length === 0) {
        res.status(400).json(errorResponse('Deals array is required', 400));
        return;
      }

      const result = await dealService.bulkCreateDeals(deals);

      // Log activity
      await ActivityLog.create({
        user_id: userId,
        action: 'create',
        entity_type: 'startup',
        details: { count: result.created, failed: result.failed },
        ip_address: req.ip,
      });

      res.status(200).json(successResponse('Bulk import completed', result));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export deals to CSV/Excel
   * GET /api/v1/deals/export?format=csv
   */
  async exportDeals(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { format = 'csv', filters } = req.query;

      const fileBuffer = await dealService.exportDeals(
        format as 'csv' | 'xlsx',
        filters ? JSON.parse(filters as string) : {}
      );

      const fileName = `deals_export_${Date.now()}.${format}`;
      const mimeType =
        format === 'csv'
          ? 'text/csv'
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(fileBuffer);
    } catch (error) {
      next(error);
    }
  }
}

export const dealController = new DealController();
