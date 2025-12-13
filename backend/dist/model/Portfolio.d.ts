import mongoose, { Document } from 'mongoose';
export interface IPortfolio extends Document {
    startup_id: mongoose.Types.ObjectId;
    investor_id: mongoose.Types.ObjectId;
    investment_details: {
        investment_date: Date;
        amount_invested: number;
        currency: string;
        ownership_percentage: number;
        valuation_at_investment: number;
        round_type: string;
        lead_investor: boolean;
        board_seat: boolean;
    };
    current_status: {
        current_valuation?: number;
        unrealized_multiple?: number;
        ownership_diluted_percentage?: number;
        status: 'active' | 'exited' | 'written-off' | 'zombie';
    };
    performance_metrics: {
        last_reported_revenue?: number;
        last_reported_arr?: number;
        last_reported_growth_rate?: number;
        last_reported_burn_rate?: number;
        last_reported_runway?: number;
        last_update_date?: Date;
    };
    milestones: Array<{
        title: string;
        description: string;
        achieved: boolean;
        target_date?: Date;
        achieved_date?: Date;
    }>;
    kpi_tracking: Array<{
        metric_name: string;
        value: number;
        recorded_at: Date;
    }>;
    follow_on_rounds: Array<{
        round_type: string;
        date: Date;
        amount: number;
        participated: boolean;
        amount_invested?: number;
    }>;
    exit_details?: {
        exit_type: 'ipo' | 'acquisition' | 'secondary-sale' | 'buyback';
        exit_date: Date;
        exit_valuation: number;
        proceeds: number;
        multiple: number;
        irr: number;
    };
    risk_assessment: {
        risk_level: 'low' | 'medium' | 'high' | 'critical';
        risk_factors: string[];
        last_assessed: Date;
    };
    notes: Array<{
        user_id: mongoose.Types.ObjectId;
        content: string;
        created_at: Date;
    }>;
    created_at: Date;
    updated_at: Date;
}
declare const _default: mongoose.Model<IPortfolio, {}, {}, {}, mongoose.Document<unknown, {}, IPortfolio> & IPortfolio & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Portfolio.d.ts.map