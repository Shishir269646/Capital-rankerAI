import mongoose, { Document } from 'mongoose';
export interface IInvestorThesis extends Document {
    investor_id: mongoose.Types.ObjectId;
    title: string;
    thesis_text: string;
    thesis_embedding?: number[];
    focus_areas: {
        sectors: string[];
        stages: string[];
        geographies: string[];
        business_models: string[];
    };
    investment_criteria: {
        min_revenue?: number;
        min_growth_rate?: number;
        min_team_size?: number;
        max_burn_rate?: number;
        check_size_min?: number;
        check_size_max?: number;
        must_have_features: string[];
        deal_breakers: string[];
    };
    key_themes: string[];
    preferred_technologies: string[];
    exclusions: string[];
    target_metrics: {
        target_irr?: number;
        target_multiple?: number;
        investment_horizon_years?: number;
    };
    examples: {
        positive_examples: string[];
        negative_examples: string[];
    };
    is_active: boolean;
    version: number;
    created_at: Date;
    updated_at: Date;
    matchesCriteria(startup: any): boolean;
}
declare const _default: mongoose.Model<IInvestorThesis, {}, {}, {}, mongoose.Document<unknown, {}, IInvestorThesis> & IInvestorThesis & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=InvestorThesis.d.ts.map