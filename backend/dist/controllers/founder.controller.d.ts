import { Request as ErrorRequest, Response as ErrorResponse, NextFunction as ErrorNext } from 'express';
export declare class FounderController {
    evaluateFounder(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getFounderProfile(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    updateFounder(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getFoundersByStartup(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
}
export declare const founderController: FounderController;
//# sourceMappingURL=founder.controller.d.ts.map