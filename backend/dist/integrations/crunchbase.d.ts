export declare class CrunchbaseClient {
    private client;
    private apiKey;
    constructor();
    private setupInterceptors;
    getOrganizations(params?: {
        limit?: number;
        after_id?: string;
        funding_stage?: string;
    }): Promise<any[]>;
    getOrganizationById(uuid: string): Promise<any>;
    searchOrganizations(query: string): Promise<any[]>;
    getFundingRounds(orgUuid: string): Promise<any[]>;
}
export declare const crunchbaseClient: CrunchbaseClient;
//# sourceMappingURL=crunchbase.d.ts.map