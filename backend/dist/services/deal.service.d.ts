import { IStartup } from '../model/Startup';
interface GetDealsParams {
    page: number;
    limit: number;
    filters: any;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    scoreMin?: number;
    scoreMax?: number;
}
interface AdvancedSearchParams {
    query?: string;
    sectors?: string[];
    stages?: string[];
    minRevenue?: number;
    maxRevenue?: number;
    minGrowthRate?: number;
    countries?: string[];
    technologies?: string[];
    page: number;
    limit: number;
}
export declare class DealService {
    private readonly CACHE_PREFIX;
    private readonly CACHE_TTL;
    getAllDeals(params: GetDealsParams): Promise<{
        deals: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getDealById(dealId: string): Promise<any>;
    createDeal(dealData: Partial<IStartup>): Promise<IStartup>;
    updateDeal(dealId: string, updateData: Partial<IStartup>): Promise<IStartup | null>;
    addNote(dealId: string, userId: string, content: string): Promise<IStartup | null>;
    getDealStatistics(): Promise<any>;
    advancedSearch(params: AdvancedSearchParams): Promise<any>;
    getTopRankedDeals(limit: number): Promise<IStartup[]>;
    getSimilarDeals(dealId: string, limit: number): Promise<IStartup[]>;
    bulkCreateDeals(deals: Partial<IStartup>[]): Promise<{
        created: number;
        failed: number;
        errors: any[];
    }>;
    exportDeals(format: 'csv' | 'xlsx', filters: any): Promise<Buffer>;
}
export declare const dealService: DealService;
export {};
//# sourceMappingURL=deal.service.d.ts.map