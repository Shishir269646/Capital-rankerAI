"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueManager = exports.SimpleQueue = void 0;
const events_1 = require("events");
const logger_1 = require("../../config/logger");
class SimpleQueue extends events_1.EventEmitter {
    constructor(name, options = {}) {
        super();
        this.name = name;
        this.jobs = new Map();
        this.processors = new Map();
        this.processing = new Set();
        this.queue = [];
        this.concurrency = options.concurrency || 1;
        this.maxAttempts = options.maxAttempts || 3;
        logger_1.logger.info(`Queue "${name}" initialized`, {
            concurrency: this.concurrency,
            maxAttempts: this.maxAttempts,
        });
    }
    process(jobName, processor) {
        this.processors.set(jobName, processor);
        logger_1.logger.info(`Processor registered for "${jobName}" in queue "${this.name}"`);
    }
    async add(jobName, data) {
        const jobId = this.generateJobId();
        const job = {
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
        logger_1.logger.debug(`Job added to queue "${this.name}"`, {
            jobId,
            jobName,
        });
        this.processNext();
        return job;
    }
    async processNext() {
        if (this.processing.size >= this.concurrency) {
            return;
        }
        const jobId = this.queue.shift();
        if (!jobId) {
            return;
        }
        const job = this.jobs.get(jobId);
        if (!job) {
            return;
        }
        this.processing.add(jobId);
        job.status = 'active';
        job.startedAt = new Date();
        this.emit('active', job);
        try {
            const processor = this.processors.get(job.name);
            if (!processor) {
                throw new Error(`No processor found for job "${job.name}"`);
            }
            const result = await processor(job);
            job.status = 'completed';
            job.result = result;
            job.progress = 100;
            job.completedAt = new Date();
            this.emit('completed', job, result);
            logger_1.logger.info(`Job completed`, {
                queue: this.name,
                jobId: job.id,
                jobName: job.name,
            });
        }
        catch (error) {
            job.attempts++;
            if (job.attempts < job.maxAttempts) {
                logger_1.logger.warn(`Job failed, retrying...`, {
                    jobId: job.id,
                    attempt: job.attempts,
                    maxAttempts: job.maxAttempts,
                    error: error.message,
                });
                job.status = 'waiting';
                this.queue.push(jobId);
            }
            else {
                job.status = 'failed';
                job.error = error.message;
                job.completedAt = new Date();
                this.emit('failed', job, error);
                logger_1.logger.error(`Job failed after ${job.attempts} attempts`, {
                    jobId: job.id,
                    jobName: job.name,
                    error: error.message,
                });
            }
        }
        finally {
            this.processing.delete(jobId);
            setImmediate(() => this.processNext());
        }
    }
    async getJob(jobId) {
        return this.jobs.get(jobId) || null;
    }
    async getJobStatus(jobId) {
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
    getAllJobs() {
        return Array.from(this.jobs.values());
    }
    updateProgress(job, progress) {
        job.progress = Math.min(100, Math.max(0, progress));
        this.emit('progress', job, progress);
    }
    generateJobId() {
        return `${this.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    getStats() {
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
    cleanOldJobs(olderThanHours = 24) {
        const cutoffTime = Date.now() - olderThanHours * 60 * 60 * 1000;
        let cleaned = 0;
        this.jobs.forEach((job, jobId) => {
            if ((job.status === 'completed' || job.status === 'failed') &&
                job.completedAt &&
                job.completedAt.getTime() < cutoffTime) {
                this.jobs.delete(jobId);
                cleaned++;
            }
        });
        if (cleaned > 0) {
            logger_1.logger.info(`Cleaned ${cleaned} old jobs from queue "${this.name}"`);
        }
    }
}
exports.SimpleQueue = SimpleQueue;
class QueueManager {
    static getQueue(name, options) {
        if (!this.queues.has(name)) {
            const queue = new SimpleQueue(name, options);
            this.queues.set(name, queue);
        }
        return this.queues.get(name);
    }
    static getAllQueues() {
        return this.queues;
    }
    static async cleanup() {
        this.queues.forEach((queue) => {
            queue.cleanOldJobs(24);
        });
    }
}
exports.QueueManager = QueueManager;
QueueManager.queues = new Map();
setInterval(() => {
    QueueManager.cleanup();
}, 60 * 60 * 1000);
//# sourceMappingURL=simple-queue.js.map