import mongoose, { Document } from 'mongoose';
export interface IActivityLog extends Document {
    user_id: mongoose.Types.ObjectId;
    action: string;
    entity_type: 'startup' | 'score' | 'thesis' | 'founder' | 'portfolio' | 'alert' | 'user';
    entity_id?: mongoose.Types.ObjectId;
    details: any;
    ip_address?: string;
    user_agent?: string;
    created_at: Date;
}
declare const _default: mongoose.Model<IActivityLog, {}, {}, {}, mongoose.Document<unknown, {}, IActivityLog> & IActivityLog & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=ActivityLog.d.ts.map