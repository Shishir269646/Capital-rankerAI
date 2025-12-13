import { GrowthPotential, RiskLevel, RecommendationType, RedFlagSeverity, RedFlagType } from './model.types';
export interface MLScoreRequest {
    deal_data: any;
    custom_weights?: ScoringWeights;
}
export interface ScoringWeights {
    market_weight: number;
    traction_weight: number;
    team_weight: number;
    financial_weight: number;
}
export interface MLScoreResponse {
    investment_fit_score: number;
    breakdown: ScoreBreakdown;
    detailed_analysis: DetailedAnalysis;
    confidence: number;
    ml_model_version: string;
}
export interface ScoreBreakdown {
    market_score: number;
    traction_score: number;
    team_score: number;
    financial_score: number;
    product_score?: number;
    competitive_score?: number;
}
export interface DetailedAnalysis {
    market_size_estimate?: number;
    growth_potential: GrowthPotential;
    risk_level: RiskLevel;
    recommendation: RecommendationType;
    strengths: string[];
    weaknesses: string[];
    key_risks: string[];
    opportunities: string[];
}
export interface ThesisMatchRequest {
    pitch_text: string;
    thesis_text: string;
}
export interface ThesisMatchResponse {
    relevancy_score: number;
    matched_keywords: string[];
    similarity_breakdown: SimilarityBreakdown;
    matched_sections: MatchedSection[];
}
export interface SimilarityBreakdown {
    sector_match: number;
    stage_match: number;
    semantic_similarity: number;
}
export interface MatchedSection {
    thesis_section: string;
    pitch_section: string;
    similarity: number;
}
export interface FounderEvaluationRequest {
    founder_data: any;
}
export interface FounderEvaluationResponse {
    founder_score: FounderScoreBreakdown;
    red_flags: FounderRedFlag[];
    strengths: string[];
    areas_of_concern: string[];
}
export interface FounderScoreBreakdown {
    overall_score: number;
    experience_score: number;
    education_score: number;
    track_record_score: number;
    leadership_score: number;
    adaptability_score: number;
    domain_expertise_score: number;
}
export interface FounderRedFlag {
    type: RedFlagType;
    description: string;
    severity: RedFlagSeverity;
}
export interface MLServiceHealth {
    status: 'healthy' | 'degraded' | 'down';
    latency: number;
    version: string;
    last_check: Date;
}
//# sourceMappingURL=ml.types.d.ts.map