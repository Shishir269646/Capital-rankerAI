import { SimpleQueue } from '../lib/queue/simple-queue';
export declare class ScoringJob {
    private static queue;
    private static initialized;
    static initialize(): void;
    private static setupProcessors;
    private static setupEventListeners;
    static shutdown(): Promise<void>;
    static getQueue(): SimpleQueue;
}
//# sourceMappingURL=scoring.job.d.ts.map