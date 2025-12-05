import mongoose, { Document, Schema } from 'mongoose';

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

const ActivityLogSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'login',
        'logout',
        'create',
        'update',
        'delete',
        'view',
        'score_generated',
        'thesis_matched',
        'founder_evaluated',
        'alert_triggered',
        'report_generated',
        'data_synced',
      ],
      index: true,
    },
    entity_type: {
      type: String,
      required: true,
      enum: ['startup', 'score', 'thesis', 'founder', 'portfolio', 'alert', 'user'],
      index: true,
    },
    entity_id: {
      type: Schema.Types.ObjectId,
      index: true,
    },
    details: Schema.Types.Mixed,
    ip_address: String,
    user_agent: String,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    collection: 'activity_logs',
  }
);

ActivityLogSchema.index({ user_id: 1, created_at: -1 });
ActivityLogSchema.index({ action: 1, entity_type: 1, created_at: -1 });

// TTL index to auto-delete logs older than 90 days
ActivityLogSchema.index({ created_at: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export default mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
