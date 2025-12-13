import { Request as ErrorRequest, Response as ErrorResponse, NextFunction as ErrorNext } from 'express';
export declare class ThesisController {
    createThesis(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    updateThesis(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getInvestorThesisById(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getThesisMatches(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getInvestorMatches(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getInvestorTheses(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    analyzeAlignment(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    deactivateThesis(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
}
export declare const thesisController: ThesisController;
//# sourceMappingURL=thesis.controller.d.ts.map