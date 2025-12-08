// ============================================
// src/lib/queue/simple-queue.ts
// Simple In-Memory Queue System (Bull Queue এর বিকল্প)
// ============================================

import { EventEmitter } from 'events';
import { logger } from '../../config/logger';

export interface Job<T = any> {
  id: string;
  name: string;
  data: T;
  status: 'waiting' | 'active' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

interface QueueOptions {
  concurrency?: number; // How many jobs to process simultaneously
  maxAttempts?: number; // Retry attempts
}

type JobProcessor<T = any> = (job: Job<T>) => Promise<any>;

/**
 * Simple Queue Class
 * Bull Queue এর সহজ বিকল্প
 */
export class SimpleQueue<T = any> extends EventEmitter {
  private jobs: Map<string, Job<T>> = new Map();
  private processors: Map<string, JobProcessor<T>> = new Map();
  private processing: Set<string> = new Set();
  private queue: string[] = [];
  private concurrency: number;
  private maxAttempts: number;

  constructor(
    private name: string,
    options: QueueOptions = {}
  ) {
    super();
    this.concurrency = options.concurrency || 1;
    this.maxAttempts = options.maxAttempts || 3;

    logger.info(`Queue "${name}" initialized`, {
      concurrency: this.concurrency,
      maxAttempts: this.maxAttempts,
    });
  }

  /**
   * Register job processor
   */
  process(jobName: string, processor: JobProcessor<T>): void {
    this.processors.set(jobName, processor);
    logger.info(`Processor registered for "${jobName}" in queue "${this.name}"`);
  }

  /**
   * Add job to queue
   */
  async add(jobName: string, data: T): Promise<Job<T>> {
    const jobId = this.generateJobId();

    const job: Job<T> = {
      id: jobId,
      name: jobName,
      data,
      status: 'waiting',
      progress: 0,
      attempts: 0,
      maxAttempts: this.maxAttempts,
      createdAt: new Date(),
    };

    this.jobs.set(jobId, job);
    this.queue.push(jobId);

    logger.debug(`Job added to queue "${this.name}"`, {
      jobId,
      jobName,
    });

    // Start processing
    this.processNext();

    return job;
  }

  /**
   * Process next job in queue
   */
  private async processNext(): Promise<void> {
    // Check if we can process more jobs
    if (this.processing.size >= this.concurrency) {
      return;
    }

    // Get next job
    const jobId = this.queue.shift();
    if (!jobId) {
      return;
    }

    const job = this.jobs.get(jobId);
    if (!job) {
      return;
    }

    // Mark as processing
    this.processing.add(jobId);
    job.status = 'active';
    job.startedAt = new Date();

    this.emit('active', job);

    try {
      // Get processor
      const processor = this.processors.get(job.name);
      if (!processor) {
        throw new Error(`No processor found for job "${job.name}"`);
      }

      // Execute job
      const result = await processor(job);

      // Mark as completed
      job.status = 'completed';
      job.result = result;
      job.progress = 100;
      job.completedAt = new Date();

      this.emit('completed', job, result);

      logger.info(`Job completed`, {
        queue: this.name,
        jobId: job.id,
        jobName: job.name,
      });
    } catch (error: any) {
      job.attempts++;

      // Retry if attempts left
      if (job.attempts < job.maxAttempts) {
        logger.warn(`Job failed, retrying...`, {
          jobId: job.id,
          attempt: job.attempts,
          maxAttempts: job.maxAttempts,
          error: error.message,
        });

        job.status = 'waiting';
        this.queue.push(jobId); // Re-add to queue
      } else {
        // Mark as failed
        job.status = 'failed';
        job.error = error.message;
        job.completedAt = new Date();

        this.emit('failed', job, error);

        logger.error(`Job failed after ${job.attempts} attempts`, {
          jobId: job.id,
          jobName: job.name,
          error: error.message,
        });
      }
    } finally {
      this.processing.delete(jobId);

      // Process next job
      setImmediate(() => this.processNext());
    }
  }

  /**
   * Get job by ID
   */
  async getJob(jobId: string): Promise<Job<T> | null> {
    return this.jobs.get(jobId) || null;
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<{
    id: string;
    status: string;
    progress: number;
    result?: any;
    error?: string;
  } | null> {
    const job = this.jobs.get(jobId);
    if (!job) {
      return null;
    }

    return {
      id: job.id,
      status: job.status,
      progress: job.progress,
      result: job.result,
      error: job.error,
    };
  }

  /**
   * Update job progress
   */
  updateProgress(job: Job<T>, progress: number): void {
    job.progress = Math.min(100, Math.max(0, progress));
    this.emit('progress', job, progress);
  }

  /**
   * Generate unique job ID
   */
  private generateJobId(): string {
    return `${this.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get queue stats
   */
  getStats(): {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    total: number;
  } {
    let waiting = 0;
    let active = 0;
    let completed = 0;
    let failed = 0;

    this.jobs.forEach((job) => {
      switch (job.status) {
        case 'waiting':
          waiting++;
          break;
        case 'active':
          active++;
          break;
        case 'completed':
          completed++;
          break;
        case 'failed':
          failed++;
          break;
      }
    });

    return {
      waiting,
      active,
      completed,
      failed,
      total: this.jobs.size,
    };
  }

  /**
   * Clean old jobs
   */
  cleanOldJobs(olderThanHours: number = 24): void {
    const cutoffTime = Date.now() - olderThanHours * 60 * 60 * 1000;
    let cleaned = 0;

    this.jobs.forEach((job, jobId) => {
      if (
        (job.status === 'completed' || job.status === 'failed') &&
        job.completedAt &&
        job.completedAt.getTime() < cutoffTime
      ) {
        this.jobs.delete(jobId);
        cleaned++;
      }
    });

    if (cleaned > 0) {
      logger.info(`Cleaned ${cleaned} old jobs from queue "${this.name}"`);
    }
  }
}

/**
 * Queue Manager
 * Multiple queues পরিচালনা করার জন্য
 */
export class QueueManager {
  private static queues: Map<string, SimpleQueue> = new Map();

  static getQueue<T = any>(name: string, options?: QueueOptions): SimpleQueue<T> {
    if (!this.queues.has(name)) {
      const queue = new SimpleQueue<T>(name, options);
      this.queues.set(name, queue);
    }
    return this.queues.get(name) as SimpleQueue<T>;
  }

  static getAllQueues(): Map<string, SimpleQueue> {
    return this.queues;
  }

  static async cleanup(): Promise<void> {
    this.queues.forEach((queue) => {
      queue.cleanOldJobs(24); // Clean jobs older than 24 hours
    });
  }
}

// Auto-cleanup every hour
setInterval(
  () => {
    QueueManager.cleanup();
  },
  60 * 60 * 1000
);
