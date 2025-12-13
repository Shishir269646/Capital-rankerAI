import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    firm_name: string;
    role: 'admin' | 'investor' | 'analyst';
    preferences: {
        notification_channels: ('email' | 'slack' | 'teams')[];
        alert_types: string[];
        dashboard_layout: object;
        scoring_weights: {
            market_weight: number;
            traction_weight: number;
            team_weight: number;
            financial_weight: number;
        };
    };
    profile_picture?: string;
    phone?: string;
    linkedin_url?: string;
    is_active: boolean;
    last_login?: Date;
    created_at: Date;
    updated_at: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map