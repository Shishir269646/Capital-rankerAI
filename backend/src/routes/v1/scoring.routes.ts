// src/routes/v1/scoring.routes.ts
import { Router } from 'express';
import { scoringController } from '../../controllers/scoring.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { batchScoreValidator, compareScoresValidator } from '../../validators/scoring.validator';

const router = Router();
router.use(authMiddleware);

/**
 * @route   POST /api/v1/scoring/deal/:dealId
 * @desc    Score a deal using AI/ML
 * @access  Private
 */
router.post('/deal/:dealId', scoringController.scoreDeal.bind(scoringController));

/**
 * @route   GET /api/v1/scoring/deal/:dealId/history
 * @desc    Get scoring history for a deal
 * @access  Private
 */
router.get('/deal/:dealId/history', scoringController.getScoringHistory.bind(scoringController));

/**
 * @route   POST /api/v1/scoring/batch
 * @desc    Batch score multiple deals
 * @access  Private
 */
router.post(
  '/batch',
  validateRequest(batchScoreValidator),
  scoringController.batchScore.bind(scoringController)
);

/**
 * @route   GET /api/v1/scoring/batch/:jobId/status
 * @desc    Get batch scoring job status
 * @access  Private
 */
router.get('/batch/:jobId/status', scoringController.getBatchJobStatus.bind(scoringController));

/**
 * @route   POST /api/v1/scoring/recalculate-all
 * @desc    Recalculate all scores (admin only)
 * @access  Private (Admin)
 */
router.post('/recalculate-all', scoringController.recalculateAll.bind(scoringController));

/**
 * @route   POST /api/v1/scoring/compare
 * @desc    Compare scores between multiple deals
 * @access  Private
 */
router.post(
  '/compare',
  validateRequest(compareScoresValidator),
  scoringController.compareScores.bind(scoringController)
);

export default router;
