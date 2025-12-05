// ============================================
// src/jobs/data-sync.job.ts
// UPDATED VERSION - Using node-schedule instead of node-cron
// ============================================

import schedule from 'node-schedule';
import { aggregationService } from '../services/aggregation.service';
import { logger } from '../config/logger';

/**
 * Data Sync Job
 * Using node-schedule for better scheduling
 */
export class DataSyncJob {
  private static jobs: Map<string, schedule.Job> = new Map();

  /**
   * Sync from DealRoom
   * Runs every day at 2 AM
   */
  static scheduleDealRoomSync(): void {
    // Cron format: second minute hour day month dayOfWeek
    const rule = new schedule.RecurrenceRule();
    rule.hour = 2;
    rule.minute = 0;
    rule.tz = 'UTC';

    const job = schedule.scheduleJob(rule, async () => {
      logger.info('Starting DealRoom sync job...');

      try {
        const result = await aggregationService.syncFromDealRoom();
        logger.info('DealRoom sync completed', {
          synced: result.synced,
          errors: result.errors,
        });
      } catch (error: any) {
        logger.error('DealRoom sync failed', {
          error: error.message,
          stack: error.stack,
        });
      }
    });

    this.jobs.set('dealroom-sync', job);
    logger.info('DealRoom sync job scheduled: Daily at 2 AM UTC');
  }

  /**
   * Sync from Crunchbase
   * Runs every day at 3 AM
   */
  static scheduleCrunchbaseSync(): void {
    const rule = new schedule.RecurrenceRule();
    rule.hour = 3;
    rule.minute = 0;
    rule.tz = 'UTC';

    const job = schedule.scheduleJob(rule, async () => {
      logger.info('Starting Crunchbase sync job...');

      try {
        const result = await aggregationService.syncFromCrunchbase();
        logger.info('Crunchbase sync completed', {
          synced: result.synced,
          errors: result.errors,
        });
      } catch (error: any) {
        logger.error('Crunchbase sync failed', {
          error: error.message,
          stack: error.stack,
        });
      }
    });

    this.jobs.set('crunchbase-sync', job);
    logger.info('Crunchbase sync job scheduled: Daily at 3 AM UTC');
  }

  /**
   * Weekly full data refresh
   * Runs every Sunday at 1 AM
   */
  static scheduleWeeklyRefresh(): void {
    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = 0; // Sunday
    rule.hour = 1;
    rule.minute = 0;
    rule.tz = 'UTC';

    const job = schedule.scheduleJob(rule, async () => {
      logger.info('Starting weekly data refresh...');

      try {
        // Sync from all sources
        const dealRoomResult = await aggregationService.syncFromDealRoom();
        const crunchbaseResult = await aggregationService.syncFromCrunchbase();

        logger.info('Weekly refresh completed', {
          dealRoom: dealRoomResult,
          crunchbase: crunchbaseResult,
        });
      } catch (error: any) {
        logger.error('Weekly refresh failed', {
          error: error.message,
          stack: error.stack,
        });
      }
    });

    this.jobs.set('weekly-refresh', job);
    logger.info('Weekly data refresh scheduled: Sundays at 1 AM UTC');
  }

  /**
   * Run job immediately (for testing)
   */
  static async runJobNow(jobName: string): Promise<void> {
    logger.info(`Running job "${jobName}" immediately...`);

    try {
      switch (jobName) {
        case 'dealroom-sync':
          await aggregationService.syncFromDealRoom();
          break;
        case 'crunchbase-sync':
          await aggregationService.syncFromCrunchbase();
          break;
        default:
          throw new Error(`Unknown job: ${jobName}`);
      }

      logger.info(`Job "${jobName}" completed successfully`);
    } catch (error: any) {
      logger.error(`Job "${jobName}" failed`, {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Cancel a scheduled job
   */
  static cancelJob(jobName: string): void {
    const job = this.jobs.get(jobName);
    if (job) {
      job.cancel();
      this.jobs.delete(jobName);
      logger.info(`Job "${jobName}" cancelled`);
    }
  }

  /**
   * Cancel all jobs
   */
  static cancelAllJobs(): void {
    this.jobs.forEach((job, name) => {
      job.cancel();
      logger.info(`Job "${name}" cancelled`);
    });
    this.jobs.clear();
  }

  /**
   * Get job status
   */
  static getJobStatus(jobName: string): any {
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

  /**
   * Initialize all sync jobs
   */
  static initialize(): void {
    this.scheduleDealRoomSync();
    this.scheduleCrunchbaseSync();
    this.scheduleWeeklyRefresh();
    logger.info('All data sync jobs initialized');
  }
}

// ============================================
// src/jobs/alert.job.ts
// UPDATED VERSION - Using node-schedule
// ============================================

import { alertService } from '../services/alert.service';
import Score from '../models/Score';
import { Alert } from '../models/Alert';

/**
 * Alert Monitoring Job
 */
export class AlertJob {
  private static jobs: Map<string, schedule.Job> = new Map();

  /**
   * Monitor score changes
   * Runs every hour
   */
  static scheduleScoreMonitoring(): void {
    // Run every hour at minute 0
    const rule = new schedule.RecurrenceRule();
    rule.minute = 0;

    const job = schedule.scheduleJob(rule, async () => {
      logger.info('Starting score monitoring...');

      try {
        // Get latest scores from last hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        const recentScores = await Score.find({
          scored_at: { $gte: oneHourAgo },
          is_latest: true,
        }).populate('startup_id');

        let alertsCreated = 0;

        for (const score of recentScores) {
          // Check for significant score drops
          if (score.investment_fit_score < 50) {
            await alertService.createAlert({
              user_id: score.user_id,
              type: 'portfolio_anomaly',
              title: 'Low Investment Score Alert',
              description: `Deal "${(score as any).startup_id.name}" has a low investment fit score of ${score.investment_fit_score}`,
              severity: 'high',
              related_entities: {
                startup_ids: [(score as any).startup_id._id],
              },
            });
            alertsCreated++;
          }
        }

        logger.info('Score monitoring completed', {
          checked: recentScores.length,
          alertsCreated,
        });
      } catch (error: any) {
        logger.error('Score monitoring failed', {
          error: error.message,
        });
      }
    });

    this.jobs.set('score-monitoring', job);
    logger.info('Score monitoring scheduled: Every hour');
  }

  /**
   * Clean up old alerts
   * Runs daily at midnight
   */
  static scheduleAlertCleanup(): void {
    const rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.minute = 0;

    const job = schedule.scheduleJob(rule, async () => {
      logger.info('Starting alert cleanup...');

      try {
        // Delete alerts older than 30 days and archived
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const result = await Alert.deleteMany({
          status: 'archived',
          triggered_at: { $lte: thirtyDaysAgo },
        });

        logger.info('Alert cleanup completed', {
          deleted: result.deletedCount,
        });
      } catch (error: any) {
        logger.error('Alert cleanup failed', {
          error: error.message,
        });
      }
    });

    this.jobs.set('alert-cleanup', job);
    logger.info('Alert cleanup scheduled: Daily at midnight');
  }

  /**
   * Initialize all alert jobs
   */
  static initialize(): void {
    this.scheduleScoreMonitoring();
    this.scheduleAlertCleanup();
    logger.info('All alert jobs initialized');
  }

  /**
   * Cancel all jobs
   */
  static cancelAllJobs(): void {
    this.jobs.forEach((job, name) => {
      job.cancel();
      logger.info(`Alert job "${name}" cancelled`);
    });
    this.jobs.clear();
  }
}

// ============================================
// src/jobs/index.ts
// UPDATED - Central job initializer
// ============================================

export function initializeJobs(): void {
  logger.info('Initializing background jobs...');

  // Initialize data sync jobs
  DataSyncJob.initialize();

  // Initialize alert jobs
  AlertJob.initialize();

  logger.info('All background jobs initialized successfully');
}

/**
 * Graceful shutdown
 */
export function shutdownJobs(): void {
  logger.info('Shutting down background jobs...');

  DataSyncJob.cancelAllJobs();
  AlertJob.cancelAllJobs();

  logger.info('All background jobs stopped');
}
