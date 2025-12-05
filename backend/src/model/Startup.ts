// src/model/Startup.ts
import mongoose, { Document, Schema } from 'mongoose';

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
    arr?: number; // Annual Recurring Revenue
    mrr?: number; // Monthly Recurring Revenue
    growth_rate_mom: number; // Month over Month
    growth_rate_yoy: number; // Year over Year
    burn_rate: number;
    runway_months: number;
    gross_margin?: number;
    customer_count?: number;
    cac?: number; // Customer Acquisition Cost
    ltv?: number; // Lifetime Value
  };
  team_size: number;
  founders: mongoose.Types.ObjectId[];
  founded_date: Date;
  website: string;
  pitch_deck_url?: string;
  pitch_deck_text?: string; // Extracted text for NLP
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
  external_id?: string; // ID from external source
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

const StartupSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Startup name is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [50, 'Description must be at least 50 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    short_pitch: {
      type: String,
      maxlength: [280, 'Short pitch cannot exceed 280 characters'],
    },
    sector: {
      type: [String],
      required: [true, 'At least one sector is required'],
      enum: [
        'fintech',
        'healthtech',
        'edtech',
        'e-commerce',
        'saas',
        'ai-ml',
        'blockchain',
        'iot',
        'cybersecurity',
        'climate-tech',
        'agritech',
        'mobility',
        'real-estate',
        'logistics',
        'hr-tech',
        'martech',
        'consumer',
        'enterprise',
        'devtools',
        'other',
      ],
      index: true,
    },
    stage: {
      type: String,
      required: [true, 'Stage is required'],
      enum: ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth'],
      index: true,
    },
    funding_history: [
      {
        round_type: {
          type: String,
          required: true,
          enum: ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'bridge', 'growth'],
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        currency: {
          type: String,
          default: 'USD',
          enum: ['USD', 'EUR', 'GBP', 'BDT'],
        },
        date: {
          type: Date,
          required: true,
        },
        investors: [String],
        valuation: {
          type: Number,
          min: 0,
        },
      },
    ],
    metrics: {
      revenue: {
        type: Number,
        default: 0,
        min: 0,
      },
      arr: {
        type: Number,
        min: 0,
      },
      mrr: {
        type: Number,
        min: 0,
      },
      growth_rate_mom: {
        type: Number,
        default: 0,
      },
      growth_rate_yoy: {
        type: Number,
        default: 0,
      },
      burn_rate: {
        type: Number,
        default: 0,
        min: 0,
      },
      runway_months: {
        type: Number,
        default: 0,
        min: 0,
      },
      gross_margin: {
        type: Number,
        min: 0,
        max: 100,
      },
      customer_count: {
        type: Number,
        min: 0,
      },
      cac: {
        type: Number,
        min: 0,
      },
      ltv: {
        type: Number,
        min: 0,
      },
    },
    team_size: {
      type: Number,
      required: [true, 'Team size is required'],
      min: 1,
      default: 1,
    },
    founders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Founder',
      },
    ],
    founded_date: {
      type: Date,
      required: [true, 'Founded date is required'],
    },
    website: {
      type: String,
      required: [true, 'Website is required'],
      trim: true,
      match: [/^https?:\/\/.+/, 'Please provide a valid URL'],
    },
    pitch_deck_url: {
      type: String,
      trim: true,
    },
    pitch_deck_text: {
      type: String,
      maxlength: 50000,
    },
    linkedin_url: {
      type: String,
      trim: true,
    },
    twitter_url: {
      type: String,
      trim: true,
    },
    location: {
      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
        index: true,
      },
      region: {
        type: String,
      },
    },
    technology_stack: {
      type: [String],
      default: [],
    },
    business_model: {
      type: String,
      enum: [
        'B2B',
        'B2C',
        'B2B2C',
        'marketplace',
        'subscription',
        'transaction-based',
        'freemium',
        'other',
      ],
    },
    target_market: {
      type: String,
      maxlength: 500,
    },
    competitive_advantage: {
      type: String,
      maxlength: 1000,
    },
    competitors: {
      type: [String],
      default: [],
    },
    source: {
      type: String,
      required: true,
      enum: ['dealroom', 'crunchbase', 'manual', 'angellist'],
      default: 'manual',
      index: true,
    },
    external_id: {
      type: String,
      sparse: true,
      index: true,
    },
    last_synced: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'rejected', 'invested'],
      default: 'active',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    notes: [
      {
        user_id: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        content: {
          type: String,
          required: true,
          maxlength: 5000,
        },
        created_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'startups',
  }
);

// Compound indexes for better query performance
StartupSchema.index({ name: 'text', description: 'text', target_market: 'text' });
StartupSchema.index({ sector: 1, stage: 1, status: 1 });
StartupSchema.index({ 'location.country': 1, sector: 1 });
StartupSchema.index({ source: 1, external_id: 1 }, { unique: true, sparse: true });
StartupSchema.index({ created_at: -1 });

// Virtual for total funding
StartupSchema.virtual('total_funding').get(function (this: IStartup) {
  return this.funding_history.reduce(
    (sum: number, round: IStartup['funding_history'][number]) => sum + round.amount,
    0
  );
});

// Virtual for latest valuation
StartupSchema.virtual('latest_valuation').get(function (this: IStartup) {
  const sortedRounds = this.funding_history
    .filter((r: IStartup['funding_history'][number]) => r.valuation)
    .sort(
      (a: IStartup['funding_history'][number], b: IStartup['funding_history'][number]) =>
        b.date.getTime() - a.date.getTime()
    );
  return sortedRounds.length > 0 ? sortedRounds[0].valuation : null;
});

// Enable virtuals in JSON
StartupSchema.set('toJSON', { virtuals: true });
StartupSchema.set('toObject', { virtuals: true });

export default mongoose.model<IStartup>('Startup', StartupSchema);
