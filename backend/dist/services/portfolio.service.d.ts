export declare class PortfolioService {
    getPortfolio(userId: string, filters: any): Promise<any>;
    getPortfolioPerformance(portfolioId: string, userId: string): Promise<any>;
    updatePortfolioMetrics(portfolioId: string, userId: string, metrics: any): Promise<any>;
    getPortfolioAnalytics(userId: string): Promise<any>;
    getPortfolioItemById(portfolioId: string, userId: string): Promise<any>;
    createPortfolioItem(startupId: string, investorId: string): Promise<any>;
}
export declare const portfolioService: PortfolioService;
//# sourceMappingURL=portfolio.service.d.ts.map