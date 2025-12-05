// src/model/Score.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IScore extends Document {
  startup_id: mongoose.Types.ObjectId;
  user_id?: mongoose.Types.ObjectId; // User who requested the score
  investment_fit_score: number; // Overall score 0-100
  breakdown: {
    market_score: number; // 0-100
    traction_score: number; // 0-100
    team_score: number; // 0-100
    financial_score: number; // 0-100
    product_score?: number; // 0-100
    competitive_score?: number; // 0-100
  };
  detailed_analysis: {
    market_size_estimate?: number;
    growth_potential: 'low' | 'medium' | 'high' | 'very-high';
    risk_level: 'low' | 'medium' | 'high' | 'very-high';
    recommendation: 'pass' | 'watch' | 'consider' | 'strong-consider' | 'pursue';
    strengths: string[];
    weaknesses: string[];
    key_risks: string[];
    opportunities: string[];
  };
  confidence: number; // 0-1 (ML model confidence)
  ml_model_version: string; // e.g., 'v1.2.3'
  scoring_parameters: {
    weights_used: {
      market_weight: number;
      traction_weight: number;
      team_weight: number;
      financial_weight: number;
    };
    features_used: string[];
    algorithm: string;
  };
  scored_at: Date;
  expires_at?: Date; // Score validity period
  is_latest: boolean; // Flag to mark the most recent score
  notes?: string;
  created_at: Date;
}

const ScoreSchema: Schema = new Schema(
  {
    startup_id: {
      type: Schema.Types.ObjectId,
      ref: 'Startup',
      required: [true, 'Startup ID is required'],
      index: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    investment_fit_score: {
      type: Number,
      required: [true, 'Investment fit score is required'],
      min: [0, 'Score cannot be less than 0'],
      max: [100, 'Score cannot exceed 100'],
      index: true,
    },
    breakdown: {
      market_score: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      traction_score: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      team_score: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      financial_score: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      product_score: {
        type: Number,
        min: 0,
        max: 100,
      },
      competitive_score: {
        type: Number,
        min: 0,
        max: 100,
      },
    },
    detailed_analysis: {
      market_size_estimate: {
        type: Number,
        min: 0,
      },
      growth_potential: {
        type: String,
        enum: ['low', 'medium', 'high', 'very-high'],
        required: true,
      },
      risk_level: {
        type: String,
        enum: ['low', 'medium', 'high', 'very-high'],
        required: true,
      },
      recommendation: {
        type: String,
        enum: ['pass', 'watch', 'consider', 'strong-consider', 'pursue'],
        required: true,
        index: true,
      },
      strengths: {
        type: [String],
        default: [],
      },
      weaknesses: {
        type: [String],
        default: [],
      },
      key_risks: {
        type: [String],
        default: [],
      },
      opportunities: {
        type: [String],
        default: [],
      },
    },
    confidence: {
      type: Number,
      required: [true, 'Confidence score is required'],
      min: [0, 'Confidence cannot be less than 0'],
      max: [1, 'Confidence cannot exceed 1'],
    },
    ml_model_version: {
      type: String,
      required: [true, 'ML model version is required'],
      index: true,
    },
    scoring_parameters: {
      weights_used: {
        market_weight: { type: Number, required: true, min: 0, max: 1 },
        traction_weight: { type: Number, required: true, min: 0, max: 1 },
        team_weight: { type: Number, required: true, min: 0, max: 1 },
        financial_weight: { type: Number, required: true, min: 0, max: 1 },
      },
      features_used: {
        type: [String],
        default: [],
      },
      algorithm: {
        type: String,
        required: true,
        enum: ['random-forest', 'gradient-boost', 'neural-network', 'ensemble'],
      },
    },
    scored_at: {
      type: Date,
      default: Date.now,
      required: true,
      index: true,
    },
    expires_at: {
      type: Date,
      index: true,
    },
    is_latest: {
      type: Boolean,
      default: true,
      index: true,
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    collection: 'scores',
  }
);

// Compound indexes for efficient queries
ScoreSchema.index({ startup_id: 1, scored_at: -1 });
ScoreSchema.index({ startup_id: 1, is_latest: 1 });
ScoreSchema.index({ investment_fit_score: -1, 'detailed_analysis.recommendation': 1 });
ScoreSchema.index({ 'detailed_analysis.recommendation': 1, investment_fit_score: -1 });

// Pre-save hook to set is_latest flag
ScoreSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Mark all previous scores for this startup as not latest
    await mongoose
      .model('Score')
      .updateMany({ startup_id: this.startup_id, _id: { $ne: this._id } }, { is_latest: false });

    // Set expiry date (e.g., 30 days from scoring)
    if (!this.expires_at) {
      this.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  }
  next();
});

// Virtual for score grade
ScoreSchema.virtual('score_grade').get(function () {
  const score = this.investment_fit_score;
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  return 'D';
});

// Enable virtuals
ScoreSchema.set('toJSON', { virtuals: true });
ScoreSchema.set('toObject', { virtuals: true });

export default mongoose.model<IScore>('Score', ScoreSchema);
