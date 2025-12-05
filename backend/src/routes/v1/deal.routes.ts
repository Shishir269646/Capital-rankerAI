// src/routes/v1/deal.routes.ts
import { Router } from 'express';
import { dealController } from '../../controllers/deal.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import {
  createDealValidator,
  updateDealValidator,
  addNoteValidator,
  searchDealsValidator,
  bulkImportValidator,
} from '../../validators/deal.validator';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/v1/deals
 * @desc    Get all deals with pagination, filtering, sorting
 * @access  Private
 * @query   page, limit, sector, stage, status, score_min, score_max, country, search, sort_by, sort_order
 */
router.get('/', dealController.getAllDeals.bind(dealController));

/**
 * @route   GET /api/v1/deals/stats
 * @desc    Get deal statistics and analytics
 * @access  Private
 */
router.get('/stats', dealController.getDealStats.bind(dealController));

/**
 * @route   GET /api/v1/deals/top-ranked
 * @desc    Get top ranked deals by investment fit score
 * @access  Private
 * @query   limit
 */
router.get('/top-ranked', dealController.getTopRankedDeals.bind(dealController));

/**
 * @route   GET /api/v1/deals/export
 * @desc    Export deals to CSV/Excel
 * @access  Private
 * @query   format (csv/xlsx), filters
 */
router.get('/export', dealController.exportDeals.bind(dealController));

/**
 * @route   POST /api/v1/deals/search
 * @desc    Advanced search with multiple filters
 * @access  Private
 */
router.post(
  '/search',
  validateRequest(searchDealsValidator),
  dealController.searchDeals.bind(dealController)
);

/**
 * @route   POST /api/v1/deals/bulk-import
 * @desc    Bulk import deals
 * @access  Private
 */
router.post(
  '/bulk-import',
  validateRequest(bulkImportValidator),
  dealController.bulkImport.bind(dealController)
);

/**
 * @route   POST /api/v1/deals
 * @desc    Create a new deal (manual entry)
 * @access  Private
 */
router.post(
  '/',
  validateRequest(createDealValidator),
  dealController.createDeal.bind(dealController)
);

/**
 * @route   GET /api/v1/deals/:id
 * @desc    Get single deal by ID with full details
 * @access  Private
 */
router.get('/:id', dealController.getDealById.bind(dealController));

/**
 * @route   GET /api/v1/deals/:id/similar
 * @desc    Get similar deals
 * @access  Private
 * @query   limit
 */
router.get('/:id/similar', dealController.getSimilarDeals.bind(dealController));

/**
 * @route   PUT /api/v1/deals/:id
 * @desc    Update deal information
 * @access  Private
 */
router.put(
  '/:id',
  validateRequest(updateDealValidator),
  dealController.updateDeal.bind(dealController)
);

/**
 * @route   DELETE /api/v1/deals/:id
 * @desc    Archive/Delete a deal
 * @access  Private
 */
router.delete('/:id', dealController.deleteDeal.bind(dealController));

/**
 * @route   POST /api/v1/deals/:id/notes
 * @desc    Add note to a deal
 * @access  Private
 */
router.post(
  '/:id/notes',
  validateRequest(addNoteValidator),
  dealController.addNote.bind(dealController)
);

export default router;
