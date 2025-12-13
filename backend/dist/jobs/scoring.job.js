"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoringJob = void 0;
const scoring_service_1 = require("../services/scoring.service");
const Startup_1 = __importDefault(require("../model/Startup"));
const queue_init_1 = require("./queue.init");
const logger_1 = require("../config/logger");
class ScoringJob {
    static initialize() {
        if (ScoringJob.initialized) {
            logger_1.logger.warn('ScoringJob already initialized, skipping setup.');
            return;
        }
        this.queue = queue_init_1.scoringQueue;
        this.setupProcessors();
        this.setupEventListeners();
        ScoringJob.initialized = true;
    }
    static setupProcessors() {
        this.queue.process('score-deal', async (job) => {
            const { dealId, userId, customWeights } = job.data;
            logger_1.logger.info('Processing scoring job', { dealId, jobId: job.id });
            try {
                const score = await scoring_service_1.scoringService.scoreDeal(dealId, userId, customWeights);
                this.queue.updateProgress(job, 100);
                return { success: true, dealId, score: score.investment_fit_score };
            }
            catch (error) {
                logger_1.logger.error('Scoring job failed', { dealId, jobId: job.id, error: error.message });
                throw error;
            }
        });
        logger_1.logger.info('Score deal processor initialized.');
        this.queue.process('batch-score', async (job) => {
            const { dealIds, userId } = job.data;
            const totalDeals = dealIds.length;
            const results = [];
            logger_1.logger.info('Processing batch scoring job', { totalDeals, jobId: job.id });
            for (let i = 0; i < dealIds.length; i++) {
                const dealId = dealIds[i];
                try {
                    const score = await scoring_service_1.scoringService.scoreDeal(dealId, userId);
                    results.push({ dealId, success: true, score: score.investment_fit_score });
                }
                catch (error) {
                    results.push({ dealId, success: false, error: error.message });
                }
                const progress = Math.round(((i + 1) / totalDeals) * 100);
                this.queue.updateProgress(job, progress);
            }
            logger_1.logger.info('Batch scoring completed', {
                totalDeals,
                successful: results.filter((r) => r.success).length,
                failed: results.filter((r) => !r.success).length,
            });
            return results;
        });
        logger_1.logger.info('Batch score processor initialized.');
        this.queue.process('recalculate-all', async (job) => {
            logger_1.logger.info('Processing recalculate-all job', { jobId: job.id });
            try {
                const deals = await Startup_1.default.find({ status: 'active' }).select('_id').lean();
                const totalDeals = deals.length;
                const results = [];
                for (let i = 0; i < deals.length; i++) {
                    const dealId = deals[i]._id.toString();
                    try {
                        await scoring_service_1.scoringService.scoreDeal(dealId, job.data.userId);
                        results.push({ dealId, success: true });
                    }
                    catch (error) {
                        results.push({ dealId, success: false, error: error.message });
                    }
                    if (i % 10 === 0) {
                        const progress = Math.round(((i + 1) / totalDeals) * 100);
                        this.queue.updateProgress(job, progress);
                    }
                }
                return {
                    total: totalDeals,
                    successful: results.filter((r) => r.success).length,
                    failed: results.filter((r) => !r.success).length,
                };
            }
            catch (error) {
                logger_1.logger.error('Recalculate-all job failed', { jobId: job.id, error: error.message });
                throw error;
            }
        });
        logger_1.logger.info('Recalculate all processor initialized.');
    }
    static setupEventListeners() {
        this.queue.on('completed', (job, result) => {
            logger_1.logger.info(`Job completed`, {
                jobId: job.id,
                jobName: job.name,
                result,
            });
        });
        this.queue.on('failed', (job, error) => {
            logger_1.logger.error(`Job failed`, {
                jobId: job.id,
                jobName: job.name,
                error: error.message,
            });
        });
        logger_1.logger.info(`Event listeners set up for scoringQueue`);
    }
    static async shutdown() {
        logger_1.logger.info('ScoringJob (SimpleQueue) shutdown completed.');
    }
    static getQueue() {
        return this.queue;
    }
}
exports.ScoringJob = ScoringJob;
ScoringJob.initialized = false;
//# sourceMappingURL=scoring.job.js.map