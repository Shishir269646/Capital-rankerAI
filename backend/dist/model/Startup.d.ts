import mongoose, { Document } from 'mongoose';
export interface IStartup extends Document {
    name: string;
    description: string;
    short_pitch: string;
    sector: string[];
    stage: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'growth';
    funding_history: Array<{
        round_type: string;
        amount: number;
        currency: string;
        date: Date;
        investors: string[];
        valuation?: number;
    }>;
    metrics: {
        revenue: number;
        arr?: number;
        mrr?: number;
        growth_rate_mom: number;
        growth_rate_yoy: number;
        burn_rate: number;
        runway_months: number;
        gross_margin?: number;
        customer_count?: number;
        cac?: number;
        ltv?: number;
    };
    team_size: number;
    founders: mongoose.Types.ObjectId[];
    founded_date: Date;
    website: string;
    pitch_deck_url?: string;
    pitch_deck_text?: string;
    linkedin_url?: string;
    twitter_url?: string;
    location: {
        city: string;
        country: string;
        region: string;
    };
    technology_stack: string[];
    business_model: string;
    target_market: string;
    competitive_advantage: string;
    competitors: string[];
    source: 'dealroom' | 'crunchbase' | 'manual' | 'angellist';
    external_id?: string;
    last_synced?: Date;
    status: 'active' | 'archived' | 'rejected' | 'invested';
    tags: string[];
    notes: Array<{
        user_id: mongoose.Types.ObjectId;
        content: string;
        created_at: Date;
    }>;
    created_at: Date;
    updated_at: Date;
}
declare const _default: mongoose.Model<IStartup, {}, {}, {}, mongoose.Document<unknown, {}, IStartup> & IStartup & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Startup.d.ts.map