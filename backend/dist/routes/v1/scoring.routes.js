"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scoring_controller_1 = require("../../controllers/scoring.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const scoring_validator_1 = require("../../validators/scoring.validator");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.post('/deal/:dealId', scoring_controller_1.scoringController.scoreDeal.bind(scoring_controller_1.scoringController));
router.get('/deal/:dealId/history', scoring_controller_1.scoringController.getScoringHistory.bind(scoring_controller_1.scoringController));
router.post('/batch', (0, validation_middleware_1.validateRequest)(scoring_validator_1.batchScoreValidator), scoring_controller_1.scoringController.batchScore.bind(scoring_controller_1.scoringController));
router.get('/batch/:jobId/status', scoring_controller_1.scoringController.getBatchJobStatus.bind(scoring_controller_1.scoringController));
router.get('/batch/status', scoring_controller_1.scoringController.getAllBatchScoringJobStatuses.bind(scoring_controller_1.scoringController));
router.post('/recalculate-all', scoring_controller_1.scoringController.recalculateAll.bind(scoring_controller_1.scoringController));
router.post('/compare', (0, validation_middleware_1.validateRequest)(scoring_validator_1.compareScoresValidator), scoring_controller_1.scoringController.compareScores.bind(scoring_controller_1.scoringController));
exports.default = router;
//# sourceMappingURL=scoring.routes.js.map