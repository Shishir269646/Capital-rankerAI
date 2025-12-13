"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeJobs = initializeJobs;
exports.shutdownJobs = shutdownJobs;
const data_sync_job_1 = require("./data-sync.job");
const scoring_job_1 = require("./scoring.job");
const alert_job_1 = require("./alert.job");
const report_job_1 = require("./report.job");
const logger_1 = require("../config/logger");
function initializeJobs() {
    logger_1.logger.info('Initializing background jobs...');
    data_sync_job_1.DataSyncJob.initialize();
    scoring_job_1.ScoringJob.initialize();
    logger_1.logger.info('Scoring job processor initialized');
    alert_job_1.AlertJob.initialize();
    report_job_1.ReportJob.initialize();
    logger_1.logger.info('Report job processor initialized');
    logger_1.logger.info('All background jobs initialized successfully');
}
async function shutdownJobs() {
    logger_1.logger.info('Shutting down background jobs...');
    data_sync_job_1.DataSyncJob.cancelAllJobs();
    alert_job_1.AlertJob.cancelAllJobs();
    await scoring_job_1.ScoringJob.shutdown();
    await report_job_1.ReportJob.shutdown();
    logger_1.logger.info('All background jobs stopped');
}
//# sourceMappingURL=index.js.map