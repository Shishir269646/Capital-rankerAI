import { IScore } from '../model/Score';
import { Job } from '../lib/queue/simple-queue';
export declare class ScoringService {
    private scoringQueue;
    private batchQueue;
    constructor();
    private setupQueueProcessors;
    scoreDeal(dealId: string, userId: string, customWeights?: any): Promise<IScore>;
    private scoreDealInternal;
    getScoringHistory(dealId: string, limit: number): Promise<IScore[]>;
    queueBatchScoring(dealIds: string[], userId: string): Promise<{
        jobId: string;
    }>;
    getBatchJobStatus(jobId: string): Promise<any>;
    recalculateAllScores(userId: string): Promise<{
        jobId: string;
    }>;
    compareDeals(dealIds: string[]): Promise<any>;
    getQueueStats(): any;
    getAllBatchScoringJobs(): Promise<Job[]>;
}
export declare const scoringService: ScoringService;
//# sourceMappingURL=scoring.service.d.ts.map