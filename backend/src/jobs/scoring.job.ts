import { SimpleQueue, Job } from '../lib/queue/simple-queue';
import { scoringService } from '../services/scoring.service';
import Startup from '../model/Startup';
import { scoringQueue } from './queue.init';

import { logger } from '../config/logger';

/**
 * Scoring Job Processor
 */
export class ScoringJob {
  private static queue: SimpleQueue;

  private static initialized: boolean = false;

  public static initialize(): void {
    if (ScoringJob.initialized) {
      logger.warn('ScoringJob already initialized, skipping setup.');
      return;
    }
    this.queue = scoringQueue;

    this.setupProcessors();
    this.setupEventListeners();
    ScoringJob.initialized = true;
  }

  /**
   * Setup job processors
   */
  private static setupProcessors(): void {
    // Single deal scoring processor
    this.queue.process('score-deal', async (job: Job) => {
      const { dealId, userId, customWeights } = job.data;
      logger.info('Processing scoring job', { dealId, jobId: job.id });
      try {
        const score = await scoringService.scoreDeal(dealId, userId, customWeights);
        this.queue.updateProgress(job, 100);
        return { success: true, dealId, score: score.investment_fit_score };
      } catch (error: any) {
        logger.error('Scoring job failed', { dealId, jobId: job.id, error: error.message });
        throw error;
      }
    });
    logger.info('Score deal processor initialized.');

    // Batch scoring processor
    this.queue.process('batch-score', async (job: Job) => {
      const { dealIds, userId } = job.data;
      const totalDeals = dealIds.length;
      const results = [];
      logger.info('Processing batch scoring job', { totalDeals, jobId: job.id });
      for (let i = 0; i < dealIds.length; i++) {
        const dealId = dealIds[i];
        try {
          const score = await scoringService.scoreDeal(dealId, userId);
          results.push({ dealId, success: true, score: score.investment_fit_score });
        } catch (error: any) {
          results.push({ dealId, success: false, error: error.message });
        }
        const progress = Math.round(((i + 1) / totalDeals) * 100);
        this.queue.updateProgress(job, progress);
      }
      logger.info('Batch scoring completed', {
        totalDeals,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
      });
      return results;
    });
    logger.info('Batch score processor initialized.');

    // Recalculate all scores processor
    this.queue.process('recalculate-all', async (job: Job) => {
      logger.info('Processing recalculate-all job', { jobId: job.id });
      try {
        const deals = await Startup.find({ status: 'active' }).select('_id').lean();
        const totalDeals = deals.length;
        const results = [];
        for (let i = 0; i < deals.length; i++) {
          const dealId = deals[i]._id.toString();
          try {
            await scoringService.scoreDeal(dealId, job.data.userId);
            results.push({ dealId, success: true });
          } catch (error: any) {
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
      } catch (error: any) {
        logger.error('Recalculate-all job failed', { jobId: job.id, error: error.message });
        throw error;
      }
    });
    logger.info('Recalculate all processor initialized.');
  }

  /**
   * Setup event listeners
   */
  private static setupEventListeners(): void {
    this.queue.on('completed', (job: Job, result: any) => {
      logger.info(`Job completed`, {
        jobId: job.id,
        jobName: job.name,
        result,
      });
    });

    this.queue.on('failed', (job: Job, error: Error) => {
      logger.error(`Job failed`, {
        jobId: job.id,
        jobName: job.name,
        error: error.message,
      });
    });

    logger.info(`Event listeners set up for scoringQueue`);
  }

  /**
   * Gracefully close all workers (SimpleQueue is in-memory, no workers to close)
   */
  public static async shutdown(): Promise<void> {
    logger.info('ScoringJob (SimpleQueue) shutdown completed.');
    // No explicit close needed for in-memory SimpleQueue
  }

  /**
   * Get queue for external use
   */
  public static getQueue(): SimpleQueue {
    return this.queue;
  }
}
