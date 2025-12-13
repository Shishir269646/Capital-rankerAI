import { Request as ErrorRequest, Response as ErrorResponse, NextFunction as ErrorNext } from 'express';
export declare class ScoringController {
    scoreDeal(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getScoringHistory(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    batchScore(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getBatchJobStatus(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    recalculateAll(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    compareScores(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getAllBatchScoringJobStatuses(_req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
}
export declare const scoringController: ScoringController;
//# sourceMappingURL=scoring.controller.d.ts.map