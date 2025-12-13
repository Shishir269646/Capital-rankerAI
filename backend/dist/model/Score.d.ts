import mongoose, { Document } from 'mongoose';
export interface IScore extends Document {
    startup_id: mongoose.Types.ObjectId;
    user_id?: mongoose.Types.ObjectId;
    investment_fit_score: number;
    breakdown: {
        market_score: number;
        traction_score: number;
        team_score: number;
        financial_score: number;
        product_score?: number;
        competitive_score?: number;
    };
    detailed_analysis: {
        market_size_estimate?: number;
        growth_potential: 'low' | 'medium' | 'high' | 'very-high';
        risk_level: 'low' | 'medium' | 'high' | 'very-high';
        recommendation: 'pass' | 'watch' | 'consider' | 'strong-consider' | 'pursue';
        strengths: string[];
        weaknesses: string[];
        key_risks: string[];
        opportunities: string[];
    };
    confidence: number;
    ml_model_version: string;
    scoring_parameters: {
        weights_used: {
            market_weight: number;
            traction_weight: number;
            team_weight: number;
            financial_weight: number;
        };
        features_used: string[];
        algorithm: string;
    };
    scored_at: Date;
    expires_at?: Date;
    is_latest: boolean;
    notes?: string;
    created_at: Date;
}
declare const _default: mongoose.Model<IScore, {}, {}, {}, mongoose.Document<unknown, {}, IScore> & IScore & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Score.d.ts.map