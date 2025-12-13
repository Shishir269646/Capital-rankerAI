import mongoose, { Document } from 'mongoose';
export interface IAlert extends Document {
    user_id: mongoose.Types.ObjectId;
    type: 'competitive_threat' | 'market_shift' | 'portfolio_anomaly' | 'funding_round' | 'regulatory_change' | 'custom';
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'unread' | 'read' | 'archived';
    related_entities: {
        startup_ids?: mongoose.Types.ObjectId[];
        portfolio_ids?: mongoose.Types.ObjectId[];
    };
    data: any;
    action_required: boolean;
    action_url?: string;
    triggered_at: Date;
    read_at?: Date;
    expires_at?: Date;
    created_at: Date;
}
declare const _default: mongoose.Model<IAlert, {}, {}, {}, mongoose.Document<unknown, {}, IAlert> & IAlert & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Alert.d.ts.map