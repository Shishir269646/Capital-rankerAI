import { IInvestorThesis } from '../model/InvestorThesis';
export declare class ThesisService {
    createThesis(thesisData: Partial<IInvestorThesis>): Promise<IInvestorThesis>;
    updateThesis(thesisId: string, userId: string, updateData: Partial<IInvestorThesis>): Promise<IInvestorThesis | null>;
    getInvestorThesisById(thesisId: string, userId: string): Promise<IInvestorThesis | null>;
    matchDealWithThesis(dealId: string, userId: string): Promise<any>;
    getTopMatchesForInvestor(investorId: string, limit: number, minScore: number): Promise<any[]>;
    getInvestorTheses(investorId: string, includeInactive: boolean): Promise<IInvestorThesis[]>;
    triggerReMatching(thesisId: string): Promise<void>;
    analyzeThesisDealAlignment(thesisId: string, dealId: string): Promise<any>;
    deactivateThesis(thesisId: string, userId: string): Promise<IInvestorThesis | null>;
    private generateRecommendations;
}
export declare const thesisService: ThesisService;
//# sourceMappingURL=thesis.service.d.ts.map