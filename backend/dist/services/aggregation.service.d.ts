export declare class AggregationService {
    private readonly DEALROOM_API_KEY;
    private readonly CRUNCHBASE_API_KEY;
    syncFromDealRoom(): Promise<{
        synced: number;
        errors: number;
    }>;
    syncFromCrunchbase(): Promise<{
        synced: number;
        errors: number;
    }>;
    private upsertStartup;
    private mapStage;
}
export declare const aggregationService: AggregationService;
//# sourceMappingURL=aggregation.service.d.ts.map