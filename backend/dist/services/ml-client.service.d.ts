import { MLScoreResponse, ThesisMatchResponse, FounderEvaluationResponse } from '../types/ml.types';
export declare class MLClientService {
    private client;
    private readonly ML_SERVICE_URL;
    constructor();
    scoreDeal(dealData: any, customWeights?: any): Promise<MLScoreResponse>;
    matchThesis(pitchText: string, thesisText: string): Promise<ThesisMatchResponse>;
    evaluateFounder(founderData: any): Promise<FounderEvaluationResponse>;
    generateEmbedding(text: string): Promise<number[]>;
    healthCheck(): Promise<boolean>;
}
export declare const mlClientService: MLClientService;
//# sourceMappingURL=ml-client.service.d.ts.map