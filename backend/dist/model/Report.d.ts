import mongoose, { Document } from 'mongoose';
export interface IReport extends Document {
    user_id: mongoose.Types.ObjectId;
    report_type: string;
    filters: any;
    date_range: any;
    format: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    file_path?: string;
    file_name?: string;
    mime_type?: string;
    generated_at?: Date;
    created_at: Date;
    updated_at: Date;
}
declare const _default: mongoose.Model<IReport, {}, {}, {}, mongoose.Document<unknown, {}, IReport> & IReport & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Report.d.ts.map