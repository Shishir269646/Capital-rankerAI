export declare class DealRoomClient {
    private client;
    private apiKey;
    constructor();
    private setupInterceptors;
    getCompanies(params?: {
        limit?: number;
        offset?: number;
        sectors?: string[];
        stages?: string[];
    }): Promise<any[]>;
    getCompanyById(companyId: string): Promise<any>;
    searchCompanies(query: string): Promise<any[]>;
}
export declare const dealRoomClient: DealRoomClient;
//# sourceMappingURL=dealroom.d.ts.map