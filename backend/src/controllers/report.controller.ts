import { reportService } from '../services/report.service';

import { successResponse, errorResponse } from '../utils/response.util';
import {
  Request as ErrorRequest,
  Response as ErrorResponse,
  NextFunction as ErrorNext,
} from 'express';

export class ReportController {
  /**
   * Generate custom report
   * POST /api/v1/reports/generate
   */
  async generateReport(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { report_type, filters, date_range, format = 'pdf' } = req.body;

      const job = await reportService.queueReportGeneration({
        userId,
        reportType: report_type,
        filters,
        dateRange: date_range,
        format,
      });

      res.status(202).json(
        successResponse('Report generation queued', {
          report_id: job.id,
          status: 'pending',
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Download generated report
   * GET /api/v1/reports/:id
   */
  async downloadReport(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }

      const report = await reportService.getReport(id, userId);

      if (!report) {
        res.status(404).json(errorResponse('Report not found', 404));
        return;
      }

      res.setHeader('Content-Type', report.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${report.fileName}"`);
      res.send(report.fileBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get deal-specific report
   * GET /api/v1/reports/deals/:dealId
   */
  async getDealReport(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { dealId } = req.params;
      const { format = 'pdf' } = req.query;

      const report = await reportService.generateDealReport(dealId, format as string);

      res.setHeader('Content-Type', report.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${report.fileName}"`);
      res.send(report.fileBuffer);
    } catch (error) {
      next(error);
    }
  }
}

export const reportController = new ReportController();
