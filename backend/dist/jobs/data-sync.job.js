"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertJob = exports.DataSyncJob = void 0;
exports.initializeJobs = initializeJobs;
exports.shutdownJobs = shutdownJobs;
const node_schedule_1 = __importDefault(require("node-schedule"));
const aggregation_service_1 = require("../services/aggregation.service");
const logger_1 = require("../config/logger");
class DataSyncJob {
    static scheduleDealRoomSync() {
        const rule = new node_schedule_1.default.RecurrenceRule();
        rule.hour = 2;
        rule.minute = 0;
        rule.tz = 'UTC';
        const job = node_schedule_1.default.scheduleJob(rule, async () => {
            logger_1.logger.info('Starting DealRoom sync job...');
            try {
                const result = await aggregation_service_1.aggregationService.syncFromDealRoom();
                logger_1.logger.info('DealRoom sync completed', {
                    synced: result.synced,
                    errors: result.errors,
                });
            }
            catch (error) {
                logger_1.logger.error('DealRoom sync failed', {
                    error: error.message,
                    stack: error.stack,
                });
            }
        });
        this.jobs.set('dealroom-sync', job);
        logger_1.logger.info('DealRoom sync job scheduled: Daily at 2 AM UTC');
    }
    static scheduleCrunchbaseSync() {
        const rule = new node_schedule_1.default.RecurrenceRule();
        rule.hour = 3;
        rule.minute = 0;
        rule.tz = 'UTC';
        const job = node_schedule_1.default.scheduleJob(rule, async () => {
            logger_1.logger.info('Starting Crunchbase sync job...');
            try {
                const result = await aggregation_service_1.aggregationService.syncFromCrunchbase();
                logger_1.logger.info('Crunchbase sync completed', {
                    synced: result.synced,
                    errors: result.errors,
                });
            }
            catch (error) {
                logger_1.logger.error('Crunchbase sync failed', {
                    error: error.message,
                    stack: error.stack,
                });
            }
        });
        this.jobs.set('crunchbase-sync', job);
        logger_1.logger.info('Crunchbase sync job scheduled: Daily at 3 AM UTC');
    }
    static scheduleWeeklyRefresh() {
        const rule = new node_schedule_1.default.RecurrenceRule();
        rule.dayOfWeek = 0;
        rule.hour = 1;
        rule.minute = 0;
        rule.tz = 'UTC';
        const job = node_schedule_1.default.scheduleJob(rule, async () => {
            logger_1.logger.info('Starting weekly data refresh...');
            try {
                const dealRoomResult = await aggregation_service_1.aggregationService.syncFromDealRoom();
                const crunchbaseResult = await aggregation_service_1.aggregationService.syncFromCrunchbase();
                logger_1.logger.info('Weekly refresh completed', {
                    dealRoom: dealRoomResult,
                    crunchbase: crunchbaseResult,
                });
            }
            catch (error) {
                logger_1.logger.error('Weekly refresh failed', {
                    error: error.message,
                    stack: error.stack,
                });
            }
        });
        this.jobs.set('weekly-refresh', job);
        logger_1.logger.info('Weekly data refresh scheduled: Sundays at 1 AM UTC');
    }
    static async runJobNow(jobName) {
        logger_1.logger.info(`Running job "${jobName}" immediately...`);
        try {
            switch (jobName) {
                case 'dealroom-sync':
                    await aggregation_service_1.aggregationService.syncFromDealRoom();
                    break;
                case 'crunchbase-sync':
                    await aggregation_service_1.aggregationService.syncFromCrunchbase();
                    break;
                default:
                    throw new Error(`Unknown job: ${jobName}`);
            }
            logger_1.logger.info(`Job "${jobName}" completed successfully`);
        }
        catch (error) {
            logger_1.logger.error(`Job "${jobName}" failed`, {
                error: error.message,
            });
            throw error;
        }
    }
    static cancelJob(jobName) {
        const job = this.jobs.get(jobName);
        if (job) {
            job.cancel();
            this.jobs.delete(jobName);
            logger_1.logger.info(`Job "${jobName}" cancelled`);
        }
    }
    static cancelAllJobs() {
        this.jobs.forEach((job, name) => {
            job.cancel();
            logger_1.logger.info(`Job "${name}" cancelled`);
        });
        this.jobs.clear();
    }
    static getJobStatus(jobName) {
        const job = this.jobs.get(jobName);
        if (!job) {
            return null;
        }
        return {
            name: jobName,
            nextInvocation: job.nextInvocation(),
            running: true,
        };
    }
    static initialize() {
        this.scheduleDealRoomSync();
        this.scheduleCrunchbaseSync();
        this.scheduleWeeklyRefresh();
        logger_1.logger.info('All data sync jobs initialized');
    }
}
exports.DataSyncJob = DataSyncJob;
DataSyncJob.jobs = new Map();
const alert_service_1 = require("../services/alert.service");
const Score_1 = __importDefault(require("../model/Score"));
const Alert_1 = __importDefault(require("../model/Alert"));
class AlertJob {
    static scheduleScoreMonitoring() {
        const rule = new node_schedule_1.default.RecurrenceRule();
        rule.minute = 0;
        const job = node_schedule_1.default.scheduleJob(rule, async () => {
            logger_1.logger.info('Starting score monitoring...');
            try {
                const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                const recentScores = await Score_1.default.find({
                    scored_at: { $gte: oneHourAgo },
                    is_latest: true,
                }).populate('startup_id');
                let alertsCreated = 0;
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
                        alertsCreated++;
                    }
                }
                logger_1.logger.info('Score monitoring completed', {
                    checked: recentScores.length,
                    alertsCreated,
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
        const rule = new node_schedule_1.default.RecurrenceRule();
        rule.hour = 0;
        rule.minute = 0;
        const job = node_schedule_1.default.scheduleJob(rule, async () => {
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
            job.cancel();
            logger_1.logger.info(`Alert job "${name}" cancelled`);
        });
        this.jobs.clear();
    }
}
exports.AlertJob = AlertJob;
AlertJob.jobs = new Map();
function initializeJobs() {
    logger_1.logger.info('Initializing background jobs...');
    DataSyncJob.initialize();
    AlertJob.initialize();
    logger_1.logger.info('All background jobs initialized successfully');
}
function shutdownJobs() {
    logger_1.logger.info('Shutting down background jobs...');
    DataSyncJob.cancelAllJobs();
    AlertJob.cancelAllJobs();
    logger_1.logger.info('All background jobs stopped');
}
//# sourceMappingURL=data-sync.job.js.map