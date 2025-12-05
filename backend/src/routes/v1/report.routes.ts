import { Router as ReportRouter } from 'express';
import { reportController } from '../../controllers/report.controller';
import { authMiddleware as reportAuth } from '../../middleware/auth.middleware';
import { validateRequest as reportValidate } from '../../middleware/validation.middleware';
import { generateReportValidator } from '../../validators/report.validator';

const reportRouter = ReportRouter();
reportRouter.use(reportAuth);

/**
 * @route   POST /api/v1/reports/generate
 * @desc    Generate custom report
 * @access  Private
 */
reportRouter.post(
  '/generate',
  reportValidate(generateReportValidator),
  reportController.generateReport.bind(reportController)
);

/**
 * @route   GET /api/v1/reports/:id
 * @desc    Download generated report
 * @access  Private
 */
reportRouter.get('/:id', reportController.downloadReport.bind(reportController));

/**
 * @route   GET /api/v1/reports/deals/:dealId
 * @desc    Get deal-specific detailed report
 * @access  Private
 */
reportRouter.get('/deals/:dealId', reportController.getDealReport.bind(reportController));

export { reportRouter };
