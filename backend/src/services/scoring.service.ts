// src/services/scoring.service.ts
// UPDATED VERSION - Using Simple Queue instead of Bull
import { mlClientService } from './ml-client.service';
import { dealService } from './deal.service';
import Score, { IScore } from '../model/Score';
import User from '../model/User';
import { SimpleQueue, QueueManager, Job } from '../lib/queue/simple-queue';
import { cacheService } from './cache.service';
import { logger } from '../config/logger';

interface ScoringJobData {
  dealId: string;
  userId: string;
  customWeights?: any;
}

interface BatchScoringJobData {
  dealIds: string[];
  userId: string;
}

export class ScoringService {
  private scoringQueue: SimpleQueue<ScoringJobData>;
  private batchQueue: SimpleQueue<BatchScoringJobData>;

  constructor() {
    // Initialize queues
    this.scoringQueue = QueueManager.getQueue<ScoringJobData>('scoring', {
      concurrency: 5, // Process 5 jobs simultaneously
      maxAttempts: 3,
    });

    this.batchQueue = QueueManager.getQueue<BatchScoringJobData>('batch-scoring', {
      concurrency: 1, // Process batch jobs one at a time
      maxAttempts: 2,
    });

    this.setupQueueProcessors();
  }

  /**
   * Setup queue processors
   */
  private setupQueueProcessors(): void {
    // Single deal scoring processor
    this.scoringQueue.process('score-deal', async (job) => {
      const { dealId, userId, customWeights } = job.data;

      logger.info('Processing scoring job', {
        jobId: job.id,
        dealId,
      });

      try {
        const score = await this.scoreDealInternal(dealId, userId, customWeights);

        // Update progress
        this.scoringQueue.updateProgress(job, 100);

        return {
          success: true,
          dealId,
          score: score.investment_fit_score,
        };
      } catch (error: any) {
        logger.error('Scoring job failed', {
          jobId: job.id,
          dealId,
          error: error.message,
        });
        throw error;
      }
    });

    // Batch scoring processor
    this.batchQueue.process('batch-score', async (job) => {
      const { dealIds, userId } = job.data;
      const totalDeals = dealIds.length;
      const results = [];

      logger.info('Processing batch scoring job', {
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
        } catch (error: any) {
          results.push({
            dealId,
            success: false,
            error: error.message,
          });
        }

        // Update progress
        const progress = Math.round(((i + 1) / totalDeals) * 100);
        this.batchQueue.updateProgress(job, progress);
      }

      logger.info('Batch scoring completed', {
        jobId: job.id,
        totalDeals,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
      });

      return results;
    });

    // Event listeners
    this.scoringQueue.on('completed', (job, result) => {
      logger.info('Scoring job completed', {
        jobId: job.id,
        result,
      });
    });

    this.scoringQueue.on('failed', (job, error) => {
      logger.error('Scoring job failed', {
        jobId: job.id,
        error: error.message,
      });
    });
  }

  /**
   * Score a deal (public method)
   */
  async scoreDeal(dealId: string, userId: string, customWeights?: any): Promise<IScore> {
    return await this.scoreDealInternal(dealId, userId, customWeights);
  }

  /**
   * Internal scoring logic
   */
  private async scoreDealInternal(
    dealId: string,
    userId: string,
    customWeights?: any
  ): Promise<IScore> {
    // Get deal data
    const deal = await dealService.getDealById(dealId);
    if (!deal) {
      throw new Error('Deal not found');
    }

    // Get user preferences for weights if not provided
    if (!customWeights) {
      const user = await User.findById(userId);
      if (user) {
        customWeights = user.preferences.scoring_weights;
      }
    }

    // Call ML service
    const mlResult = await mlClientService.scoreDeal(deal, customWeights);

    // Save score to database
    const score = new Score({
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

    // Invalidate deal cache
    await cacheService.delete(`deal:${dealId}`);

    return score;
  }

  /**
   * Get scoring history for a deal
   */
  async getScoringHistory(dealId: string, limit: number): Promise<IScore[]> {
    return await Score.find({ startup_id: dealId }).sort({ scored_at: -1 }).limit(limit).lean();
  }

  /**
   * Queue batch scoring
   */
  async queueBatchScoring(dealIds: string[], userId: string): Promise<{ jobId: string }> {
    const job = await this.batchQueue.add('batch-score', {
      dealIds,
      userId,
    });

    return { jobId: job.id };
  }

  /**
   * Get batch job status
   */
  async getBatchJobStatus(jobId: string): Promise<any> {
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

  /**
   * Recalculate all scores
   */
  async recalculateAllScores(userId: string): Promise<{ jobId: string }> {
    const allDeals = await dealService.getAllDeals({
      page: 1,
      limit: 10000,
      filters: { status: 'active' },
      sortBy: 'created_at',
      sortOrder: 'desc',
    });

    const dealIds = allDeals.deals.map((deal: any) => deal._id.toString());

    return await this.queueBatchScoring(dealIds, userId);
  }

  /**
   * Compare multiple deals
   */
  async compareDeals(dealIds: string[]): Promise<any> {
    const deals = await Promise.all(
      dealIds.map(async (id) => {
        const deal = await dealService.getDealById(id);
        const latestScore = await Score.findOne({
          startup_id: id,
          is_latest: true,
        });
        return { deal, score: latestScore };
      })
    );

    return {
      deals,
      comparison: {
        highest_score: Math.max(...deals.map((d) => d.score?.investment_fit_score || 0)),
        lowest_score: Math.min(...deals.map((d) => d.score?.investment_fit_score || 0)),
        average_score:
          deals.reduce((sum, d) => sum + (d.score?.investment_fit_score || 0), 0) / deals.length,
      },
    };
  }

  /**
   * Get queue statistics
   */
  getQueueStats(): any {
    return {
      scoring: this.scoringQueue.getStats(),
      batch: this.batchQueue.getStats(),
    };
  }

  /**
   * Get all batch scoring jobs
   */
  async getAllBatchScoringJobs(): Promise<Job[]> {
    const jobs = this.batchQueue.getAllJobs();
    // Optionally filter, sort, or transform the jobs before returning
    // For now, just return all of them
    return jobs;
  }
}

export const scoringService = new ScoringService();
