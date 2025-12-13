"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoringService = exports.ScoringService = void 0;
const ml_client_service_1 = require("./ml-client.service");
const deal_service_1 = require("./deal.service");
const Score_1 = __importDefault(require("../model/Score"));
const User_1 = __importDefault(require("../model/User"));
const simple_queue_1 = require("../lib/queue/simple-queue");
const cache_service_1 = require("./cache.service");
const logger_1 = require("../config/logger");
class ScoringService {
    constructor() {
        this.scoringQueue = simple_queue_1.QueueManager.getQueue('scoring', {
            concurrency: 5,
            maxAttempts: 3,
        });
        this.batchQueue = simple_queue_1.QueueManager.getQueue('batch-scoring', {
            concurrency: 1,
            maxAttempts: 2,
        });
        this.setupQueueProcessors();
    }
    setupQueueProcessors() {
        this.scoringQueue.process('score-deal', async (job) => {
            const { dealId, userId, customWeights } = job.data;
            logger_1.logger.info('Processing scoring job', {
                jobId: job.id,
                dealId,
            });
            try {
                const score = await this.scoreDealInternal(dealId, userId, customWeights);
                this.scoringQueue.updateProgress(job, 100);
                return {
                    success: true,
                    dealId,
                    score: score.investment_fit_score,
                };
            }
            catch (error) {
                logger_1.logger.error('Scoring job failed', {
                    jobId: job.id,
                    dealId,
                    error: error.message,
                });
                throw error;
            }
        });
        this.batchQueue.process('batch-score', async (job) => {
            const { dealIds, userId } = job.data;
            const totalDeals = dealIds.length;
            const results = [];
            logger_1.logger.info('Processing batch scoring job', {
                jobId: job.id,
                totalDeals,
            });
            for (let i = 0; i < dealIds.length; i++) {
                const dealId = dealIds[i];
                try {
                    const score = await this.scoreDealInternal(dealId, userId);
                    results.push({
                        dealId,
                        success: true,
                        score: score.investment_fit_score,
                    });
                }
                catch (error) {
                    results.push({
                        dealId,
                        success: false,
                        error: error.message,
                    });
                }
                const progress = Math.round(((i + 1) / totalDeals) * 100);
                this.batchQueue.updateProgress(job, progress);
            }
            logger_1.logger.info('Batch scoring completed', {
                jobId: job.id,
                totalDeals,
                successful: results.filter((r) => r.success).length,
                failed: results.filter((r) => !r.success).length,
            });
            return results;
        });
        this.scoringQueue.on('completed', (job, result) => {
            logger_1.logger.info('Scoring job completed', {
                jobId: job.id,
                result,
            });
        });
        this.scoringQueue.on('failed', (job, error) => {
            logger_1.logger.error('Scoring job failed', {
                jobId: job.id,
                error: error.message,
            });
        });
    }
    async scoreDeal(dealId, userId, customWeights) {
        return await this.scoreDealInternal(dealId, userId, customWeights);
    }
    async scoreDealInternal(dealId, userId, customWeights) {
        const deal = await deal_service_1.dealService.getDealById(dealId);
        if (!deal) {
            throw new Error('Deal not found');
        }
        if (!customWeights) {
            const user = await User_1.default.findById(userId);
            if (user) {
                customWeights = user.preferences.scoring_weights;
            }
        }
        const mlResult = await ml_client_service_1.mlClientService.scoreDeal(deal, customWeights);
        const score = new Score_1.default({
            startup_id: dealId,
            user_id: userId,
            investment_fit_score: mlResult.investment_fit_score,
            breakdown: mlResult.breakdown,
            detailed_analysis: mlResult.detailed_analysis,
            confidence: mlResult.confidence,
            ml_model_version: mlResult.ml_model_version,
            scoring_parameters: {
                weights_used: customWeights || {
                    market_weight: 0.3,
                    traction_weight: 0.25,
                    team_weight: 0.25,
                    financial_weight: 0.2,
                },
                features_used: Object.keys(deal),
                algorithm: 'ensemble',
            },
            is_latest: true,
        });
        await score.save();
        await cache_service_1.cacheService.delete(`deal:${dealId}`);
        return score;
    }
    async getScoringHistory(dealId, limit) {
        return await Score_1.default.find({ startup_id: dealId }).sort({ scored_at: -1 }).limit(limit).lean();
    }
    async queueBatchScoring(dealIds, userId) {
        const job = await this.batchQueue.add('batch-score', {
            dealIds,
            userId,
        });
        return { jobId: job.id };
    }
    async getBatchJobStatus(jobId) {
        const status = await this.batchQueue.getJobStatus(jobId);
        if (!status) {
            return null;
        }
        return {
            id: status.id,
            progress: status.progress,
            state: status.status,
            result: status.result,
            failedReason: status.error,
        };
    }
    async recalculateAllScores(userId) {
        const allDeals = await deal_service_1.dealService.getAllDeals({
            page: 1,
            limit: 10000,
            filters: { status: 'active' },
            sortBy: 'created_at',
            sortOrder: 'desc',
        });
        const dealIds = allDeals.deals.map((deal) => deal._id.toString());
        return await this.queueBatchScoring(dealIds, userId);
    }
    async compareDeals(dealIds) {
        const deals = await Promise.all(dealIds.map(async (id) => {
            const deal = await deal_service_1.dealService.getDealById(id);
            const latestScore = await Score_1.default.findOne({
                startup_id: id,
                is_latest: true,
            });
            return { deal, score: latestScore };
        }));
        return {
            deals,
            comparison: {
                highest_score: Math.max(...deals.map((d) => d.score?.investment_fit_score || 0)),
                lowest_score: Math.min(...deals.map((d) => d.score?.investment_fit_score || 0)),
                average_score: deals.reduce((sum, d) => sum + (d.score?.investment_fit_score || 0), 0) / deals.length,
            },
        };
    }
    getQueueStats() {
        return {
            scoring: this.scoringQueue.getStats(),
            batch: this.batchQueue.getStats(),
        };
    }
    async getAllBatchScoringJobs() {
        const jobs = this.batchQueue.getAllJobs();
        return jobs;
    }
}
exports.ScoringService = ScoringService;
exports.scoringService = new ScoringService();
//# sourceMappingURL=scoring.service.js.map