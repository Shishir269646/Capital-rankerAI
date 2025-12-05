import { alertService } from '../services/alert.service';
import { successResponse, errorResponse } from '../utils/response.util';
import {
  Request as ErrorRequest,
  Response as ErrorResponse,
  NextFunction as ErrorNext,
} from 'express';

export class AlertController {
  /**
   * Get all alerts for user
   * GET /api/v1/alerts
   */
  async getAlerts(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }
      const { type, severity, status, page = 1, limit = 20 } = req.query;

      const alerts = await alertService.getUserAlerts(userId, {
        type: type as string,
        severity: severity as string,
        status: status as string,
        page: Number(page),
        limit: Number(limit),
      });

      res.status(200).json(successResponse('Alerts retrieved', alerts));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Configure alert preferences
   * POST /api/v1/alerts/configure
   */
  async configureAlerts(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }
      const { alert_types, threshold_values, notification_channels } = req.body;

      await alertService.configureAlerts(userId, {
        alert_types,
        threshold_values,
        notification_channels,
      });

      res.status(200).json(successResponse('Alert preferences configured'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark alert as read
   * PUT /api/v1/alerts/:id/read
   */
  async markAsRead(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }

      const alert = await alertService.markAsRead(id, userId);
      if (!alert) {
        res.status(404).json(errorResponse('Alert not found', 404));
        return;
      }

      res.status(200).json(successResponse('Alert marked as read'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete alert
   * DELETE /api/v1/alerts/:id
   */
  async deleteAlert(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return next(errorResponse('User not authenticated', 401));
      }

      await alertService.deleteAlert(id, userId);
      res.status(200).json(successResponse('Alert deleted'));
    } catch (error) {
      next(error);
    }
  }
}

export const alertController = new AlertController();
