// backend/src/model/Report.ts
import mongoose, { Document, Schema } from 'mongoose';

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

const ReportSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    report_type: { type: String, required: true },
    filters: { type: Object, default: {} },
    date_range: { type: Object, default: {} },
    format: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    file_path: { type: String },
    file_name: { type: String },
    mime_type: { type: String },
    generated_at: { type: Date },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model<IReport>('Report', ReportSchema);
