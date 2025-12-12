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
      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }
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

      const reportResult = await reportService.getReport(id, userId);

      if ('status' in reportResult) {
        // Report is still pending, processing, or failed
        res.status(200).json(successResponse(reportResult.message, { status: reportResult.status }));
        return;
      }

      // Report is completed, send the file
      res.setHeader('Content-Type', reportResult.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${reportResult.fileName}"`);
      res.send(reportResult.fileBuffer);
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
      const userId = req.user?.userId; // Get userId from request
      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }
      const { format = 'pdf' } = req.query;

      const job = await reportService.generateDealReport(dealId, format as string, userId); // Pass userId

      res.status(202).json(
        successResponse('Deal report generation queued', {
          report_id: job.id,
          status: 'pending',
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export const reportController = new ReportController();