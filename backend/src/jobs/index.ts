// src/jobs/index.ts
// Central job initializer
import { DataSyncJob } from './data-sync.job';
import { ScoringJob } from './scoring.job';
import { AlertJob } from './alert.job';
import { ReportJob } from './report.job'; // Import ReportJob
import { logger } from '../config/logger';

export function initializeJobs(): void {
  logger.info('Initializing background jobs...');

  // Initialize data sync jobs
  DataSyncJob.initialize();

  // Initialize scoring job processor
  ScoringJob.initialize();
  logger.info('Scoring job processor initialized');

  // Initialize alert jobs
  AlertJob.initialize();

  // Initialize report job processor
  ReportJob.initialize(); // Initialize ReportJob
  logger.info('Report job processor initialized');

  logger.info('All background jobs initialized successfully');
}

/**
 * Graceful shutdown
 */
export async function shutdownJobs(): Promise<void> {
  logger.info('Shutting down background jobs...');

  DataSyncJob.cancelAllJobs();
  AlertJob.cancelAllJobs();
  await ScoringJob.shutdown(); // Call to shutdown, await because it's async
  await ReportJob.shutdown(); // Shutdown ReportJob

  logger.info('All background jobs stopped');
}
