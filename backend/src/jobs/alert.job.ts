import { alertService } from '../services/alert.service';
import Score, { IScore } from '../model/Score';
import Alert from '../model/Alert';
import { IStartup } from '../model/Startup';
import cron from 'node-cron';
import { logger } from '../config/logger';

/**
 * Alert Monitoring Job
 */
export class AlertJob {
  /**
   * Monitor score changes
   * Runs every hour
   */
  static scheduleScoreMonitoring(): void {
    cron.schedule('0 * * * *', async () => {
      logger.info('Starting score monitoring...');

      try {
        // Get latest scores from last hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        // Use IScore type for recentScores
        const recentScores: (IScore & { startup_id: IStartup })[] = await Score.find({
          scored_at: { $gte: oneHourAgo },
          is_latest: true,
        }).populate('startup_id');

        for (const score of recentScores) {
          // Check for significant score drops
          if (score.investment_fit_score < 50) {
            await alertService.createAlert({
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

        logger.info('Score monitoring completed', {
          checked: recentScores.length,
        });
      } catch (error: any) {
        logger.error('Score monitoring failed', {
          error: error.message,
        });
      }
    });

    logger.info('Score monitoring scheduled: Every hour');
  }

  /**
   * Clean up old alerts
   * Runs daily at midnight
   */
  static scheduleAlertCleanup(): void {
    cron.schedule('0 0 * * *', async () => {
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
}
