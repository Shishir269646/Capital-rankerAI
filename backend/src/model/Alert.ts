// src/model/Alert.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IAlert extends Document {
  user_id: mongoose.Types.ObjectId;
  type:
    | 'competitive_threat'
    | 'market_shift'
    | 'portfolio_anomaly'
    | 'funding_round'
    | 'regulatory_change'
    | 'custom';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'unread' | 'read' | 'archived';
  related_entities: {
    startup_ids?: mongoose.Types.ObjectId[];
    portfolio_ids?: mongoose.Types.ObjectId[];
  };
  data: any; // Flexible field for alert-specific data
  action_required: boolean;
  action_url?: string;
  triggered_at: Date;
  read_at?: Date;
  expires_at?: Date;
  created_at: Date;
}

const AlertSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'competitive_threat',
        'market_shift',
        'portfolio_anomaly',
        'funding_round',
        'regulatory_change',
        'custom',
      ],
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    severity: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high', 'critical'],
      index: true,
    },
    status: {
      type: String,
      default: 'unread',
      enum: ['unread', 'read', 'archived'],
      index: true,
    },
    related_entities: {
      startup_ids: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Startup',
        },
      ],
      portfolio_ids: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Portfolio',
        },
      ],
    },
    data: Schema.Types.Mixed,
    action_required: {
      type: Boolean,
      default: false,
    },
    action_url: String,
    triggered_at: {
      type: Date,
      default: Date.now,
      index: true,
    },
    read_at: Date,
    expires_at: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    collection: 'alerts',
  }
);

AlertSchema.index({ user_id: 1, status: 1, triggered_at: -1 });
AlertSchema.index({ user_id: 1, type: 1, status: 1 });

export default mongoose.model<IAlert>('Alert', AlertSchema);
