"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertJob = void 0;
const alert_service_1 = require("../services/alert.service");
const Score_1 = __importDefault(require("../model/Score"));
const Alert_1 = __importDefault(require("../model/Alert"));
const node_cron_1 = __importDefault(require("node-cron"));
const logger_1 = require("../config/logger");
class AlertJob {
    static scheduleScoreMonitoring() {
        const job = node_cron_1.default.schedule('0 * * * *', async () => {
            logger_1.logger.info('Starting score monitoring...');
            try {
                const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                const recentScores = await Score_1.default.find({
                    scored_at: { $gte: oneHourAgo },
                    is_latest: true,
                }).populate('startup_id');
                for (const score of recentScores) {
                    if (score.investment_fit_score < 50) {
                        await alert_service_1.alertService.createAlert({
                            user_id: score.user_id,
                            type: 'portfolio_anomaly',
                            title: 'Low Investment Score Alert',
                            description: `Deal "${score.startup_id.name}" has a low investment fit score of ${score.investment_fit_score}`,
                            severity: 'high',
                            related_entities: {
                                startup_ids: [score.startup_id._id],
                            },
                        });
                    }
                }
                logger_1.logger.info('Score monitoring completed', {
                    checked: recentScores.length,
                });
            }
            catch (error) {
                logger_1.logger.error('Score monitoring failed', {
                    error: error.message,
                });
            }
        });
        this.jobs.set('score-monitoring', job);
        logger_1.logger.info('Score monitoring scheduled: Every hour');
    }
    static scheduleAlertCleanup() {
        const job = node_cron_1.default.schedule('0 0 * * *', async () => {
            logger_1.logger.info('Starting alert cleanup...');
            try {
                const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                const result = await Alert_1.default.deleteMany({
                    status: 'archived',
                    triggered_at: { $lte: thirtyDaysAgo },
                });
                logger_1.logger.info('Alert cleanup completed', {
                    deleted: result.deletedCount,
                });
            }
            catch (error) {
                logger_1.logger.error('Alert cleanup failed', {
                    error: error.message,
                });
            }
        });
        this.jobs.set('alert-cleanup', job);
        logger_1.logger.info('Alert cleanup scheduled: Daily at midnight');
    }
    static initialize() {
        this.scheduleScoreMonitoring();
        this.scheduleAlertCleanup();
        logger_1.logger.info('All alert jobs initialized');
    }
    static cancelAllJobs() {
        this.jobs.forEach((job, name) => {
            job.stop();
            logger_1.logger.info(`Alert job "${name}" cancelled`);
        });
        this.jobs.clear();
    }
}
exports.AlertJob = AlertJob;
AlertJob.jobs = new Map();
//# sourceMappingURL=alert.job.js.map