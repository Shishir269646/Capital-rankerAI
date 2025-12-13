"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoringController = exports.ScoringController = void 0;
const scoring_service_1 = require("../services/scoring.service");
const response_util_1 = require("../utils/response.util");
const ActivityLog_1 = __importDefault(require("../model/ActivityLog"));
class ScoringController {
    async scoreDeal(req, res, next) {
        try {
            const { dealId } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const customWeights = req.body.custom_weights;
            const score = await scoring_service_1.scoringService.scoreDeal(dealId, userId, customWeights);
            if (!score) {
                res.status(404).json((0, response_util_1.errorResponse)('Deal not found or scoring failed', 404));
                return;
            }
            await ActivityLog_1.default.create({
                user_id: userId,
                action: 'score_generated',
                entity_type: 'score',
                entity_id: score._id,
                details: { startup_id: dealId, score: score.investment_fit_score },
                ip_address: req.ip,
            });
            res.status(200).json((0, response_util_1.successResponse)('Deal scored successfully', { score }));
        }
        catch (error) {
            next(error);
        }
    }
    async getScoringHistory(req, res, next) {
        try {
            const { dealId } = req.params;
            const { limit = 10 } = req.query;
            const history = await scoring_service_1.scoringService.getScoringHistory(dealId, Number(limit));
            res.status(200).json((0, response_util_1.successResponse)('Scoring history retrieved', { history }));
        }
        catch (error) {
            next(error);
        }
    }
    async batchScore(req, res, next) {
        try {
            const { deal_ids } = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            if (!Array.isArray(deal_ids) || deal_ids.length === 0) {
                res.status(400).json((0, response_util_1.errorResponse)('deal_ids array is required', 400));
                return;
            }
            const job = await scoring_service_1.scoringService.queueBatchScoring(deal_ids, userId);
            res.status(202).json((0, response_util_1.successResponse)('Batch scoring job queued', {
                job_id: job.jobId,
                status: 'pending',
                total_deals: deal_ids.length,
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async getBatchJobStatus(req, res, next) {
        try {
            const { jobId } = req.params;
            const status = await scoring_service_1.scoringService.getBatchJobStatus(jobId);
            if (!status) {
                res.status(404).json((0, response_util_1.errorResponse)('Job not found', 404));
                return;
            }
            res.status(200).json((0, response_util_1.successResponse)('Job status retrieved', status));
        }
        catch (error) {
            next(error);
        }
    }
    async recalculateAll(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const userRole = req.user?.role;
            if (userRole !== 'admin') {
                res.status(403).json((0, response_util_1.errorResponse)('Admin access required', 403));
                return;
            }
            const job = await scoring_service_1.scoringService.recalculateAllScores(userId);
            res.status(202).json((0, response_util_1.successResponse)('Recalculation job started', {
                job_id: job.jobId,
                status: 'pending',
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async compareScores(req, res, next) {
        try {
            const { deal_ids } = req.body;
            if (!Array.isArray(deal_ids) || deal_ids.length < 2) {
                res.status(400).json((0, response_util_1.errorResponse)('At least 2 deal IDs required for comparison', 400));
                return;
            }
            const comparison = await scoring_service_1.scoringService.compareDeals(deal_ids);
            res.status(200).json((0, response_util_1.successResponse)('Deals compared successfully', comparison));
        }
        catch (error) {
            next(error);
        }
    }
    async getAllBatchScoringJobStatuses(_req, res, next) {
        try {
            const jobs = await scoring_service_1.scoringService.getAllBatchScoringJobs();
            res.status(200).json((0, response_util_1.successResponse)('Batch scoring jobs retrieved successfully', jobs));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ScoringController = ScoringController;
exports.scoringController = new ScoringController();
//# sourceMappingURL=scoring.controller.js.map