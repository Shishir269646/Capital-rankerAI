import { Request as ErrorRequest, Response as ErrorResponse, NextFunction as ErrorNext } from 'express';
export declare class DealController {
    getAllDeals(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getDealById(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    createDeal(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    updateDeal(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    deleteDeal(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    addNote(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getDealStats(_req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    searchDeals(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getTopRankedDeals(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getSimilarDeals(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    bulkImport(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    exportDeals(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
}
export declare const dealController: DealController;
//# sourceMappingURL=deal.controller.d.ts.map