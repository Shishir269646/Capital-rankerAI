export declare class LinkedInClient {
    private client;
    private apiKey;
    constructor();
    private setupInterceptors;
    getProfile(profileUrl: string): Promise<any>;
    getCompany(companyId: string): Promise<any>;
    private extractProfileId;
}
export declare const linkedInClient: LinkedInClient;
//# sourceMappingURL=linkedin.d.ts.map