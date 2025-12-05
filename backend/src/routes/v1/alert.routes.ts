// src/routes/v1/alert.routes.ts
import { Router as AlertRouter } from 'express';
import { alertController } from '../../controllers/alert.controller';
import { authMiddleware as alertAuth } from '../../middleware/auth.middleware';
import { validateRequest as alertValidate } from '../../middleware/validation.middleware';
import { configureAlertsValidator } from '../../validators/alert.validator';

const alertRouter = AlertRouter();
alertRouter.use(alertAuth);

/**
 * @route   GET /api/v1/alerts
 * @desc    Get all alerts for user
 * @access  Private
 * @query   type, severity, status, page, limit
 */
alertRouter.get('/', alertController.getAlerts.bind(alertController));

/**
 * @route   POST /api/v1/alerts/configure
 * @desc    Configure alert preferences
 * @access  Private
 */
alertRouter.post(
  '/configure',
  alertValidate(configureAlertsValidator),
  alertController.configureAlerts.bind(alertController)
);

/**
 * @route   PUT /api/v1/alerts/:id/read
 * @desc    Mark alert as read
 * @access  Private
 */
alertRouter.put('/:id/read', alertController.markAsRead.bind(alertController));

/**
 * @route   DELETE /api/v1/alerts/:id
 * @desc    Delete/Dismiss alert
 * @access  Private
 */
alertRouter.delete('/:id', alertController.deleteAlert.bind(alertController));

export { alertRouter };
