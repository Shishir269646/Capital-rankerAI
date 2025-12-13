import { Request as ErrorRequest, Response as ErrorResponse, NextFunction as ErrorNext } from 'express';
export declare class PortfolioController {
    getPortfolio(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getPerformance(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    updateMetrics(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getAnalytics(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getPortfolioById(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    createPortfolioItem(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
}
export declare const portfolioController: PortfolioController;
//# sourceMappingURL=portfolio.controller.d.ts.map