import { EventEmitter } from 'events';
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
    concurrency?: number;
    maxAttempts?: number;
}
type JobProcessor<T = any> = (job: Job<T>) => Promise<any>;
export declare class SimpleQueue<T = any> extends EventEmitter {
    private name;
    private jobs;
    private processors;
    private processing;
    private queue;
    private concurrency;
    private maxAttempts;
    constructor(name: string, options?: QueueOptions);
    process(jobName: string, processor: JobProcessor<T>): void;
    add(jobName: string, data: T): Promise<Job<T>>;
    private processNext;
    getJob(jobId: string): Promise<Job<T> | null>;
    getJobStatus(jobId: string): Promise<{
        id: string;
        status: string;
        progress: number;
        result?: any;
        error?: string;
    } | null>;
    getAllJobs(): Job<T>[];
    updateProgress(job: Job<T>, progress: number): void;
    private generateJobId;
    getStats(): {
        waiting: number;
        active: number;
        completed: number;
        failed: number;
        total: number;
    };
    cleanOldJobs(olderThanHours?: number): void;
}
export declare class QueueManager {
    private static queues;
    static getQueue<T = any>(name: string, options?: QueueOptions): SimpleQueue<T>;
    static getAllQueues(): Map<string, SimpleQueue>;
    static cleanup(): Promise<void>;
}
export {};
//# sourceMappingURL=simple-queue.d.ts.map