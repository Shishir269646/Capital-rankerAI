// src/model/InvestorThesis.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IInvestorThesis extends Document {
  investor_id: mongoose.Types.ObjectId;
  title: string;
  thesis_text: string; // Main investment thesis
  thesis_embedding?: number[]; // Vector embedding for similarity matching
  focus_areas: {
    sectors: string[];
    stages: string[];
    geographies: string[];
    business_models: string[];
  };
  investment_criteria: {
    min_revenue?: number;
    min_growth_rate?: number;
    min_team_size?: number;
    max_burn_rate?: number;
    check_size_min?: number;
    check_size_max?: number;
    must_have_features: string[]; // e.g., ['product-market-fit', 'strong-team']
    deal_breakers: string[]; // e.g., ['high-burn', 'weak-team']
  };
  key_themes: string[]; // Extracted themes/keywords
  preferred_technologies: string[];
  exclusions: string[]; // Things to avoid
  target_metrics: {
    target_irr?: number;
    target_multiple?: number;
    investment_horizon_years?: number;
  };
  examples: {
    positive_examples: string[]; // Names of ideal portfolio companies
    negative_examples: string[]; // Types to avoid
  };
  is_active: boolean;
  version: number; // For tracking thesis updates
  created_at: Date;
  updated_at: Date;
  matchesCriteria(startup: any): boolean; // Method defined on schema
}

const InvestorThesisSchema: Schema = new Schema(
  {
    investor_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Investor ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Thesis title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    thesis_text: {
      type: String,
      required: [true, 'Thesis text is required'],
      minlength: [100, 'Thesis must be at least 100 characters'],
      maxlength: [10000, 'Thesis cannot exceed 10000 characters'],
    },
    thesis_embedding: {
      type: [Number],
      default: undefined,
      select: false, // Don't return by default for performance
    },
    focus_areas: {
      sectors: {
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
      },
      stages: {
        type: [String],
        required: [true, 'At least one stage is required'],
        enum: ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth'],
      },
      geographies: {
        type: [String],
        required: [true, 'At least one geography is required'],
      },
      business_models: {
        type: [String],
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
    },
    investment_criteria: {
      min_revenue: {
        type: Number,
        min: 0,
      },
      min_growth_rate: {
        type: Number,
        min: 0,
      },
      min_team_size: {
        type: Number,
        min: 1,
      },
      max_burn_rate: {
        type: Number,
        min: 0,
      },
      check_size_min: {
        type: Number,
        min: 0,
      },
      check_size_max: {
        type: Number,
        min: 0,
      },
      must_have_features: {
        type: [String],
        default: [],
      },
      deal_breakers: {
        type: [String],
        default: [],
      },
    },
    key_themes: {
      type: [String],
      default: [],
      index: true,
    },
    preferred_technologies: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
    },
    target_metrics: {
      target_irr: {
        type: Number,
        min: 0,
        max: 100,
      },
      target_multiple: {
        type: Number,
        min: 1,
      },
      investment_horizon_years: {
        type: Number,
        min: 1,
        max: 20,
      },
    },
    examples: {
      positive_examples: {
        type: [String],
        default: [],
      },
      negative_examples: {
        type: [String],
        default: [],
      },
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'investor_theses',
  }
);

// Indexes
InvestorThesisSchema.index({ investor_id: 1, is_active: 1 });
InvestorThesisSchema.index({ 'focus_areas.sectors': 1, 'focus_areas.stages': 1 });
InvestorThesisSchema.index({ thesis_text: 'text', title: 'text' });

// Pre-save hook to increment version on update
InvestorThesisSchema.pre('save', function (next) {
  if (!this.isNew && this.isModified()) {
    this.version += 1;
  }
  next();
});

// Method to check if startup matches criteria
InvestorThesisSchema.methods.matchesCriteria = function (startup: any): boolean {
  const criteria = this.investment_criteria;

  // Check minimum revenue
  if (criteria.min_revenue && startup.metrics.revenue < criteria.min_revenue) {
    return false;
  }

  // Check growth rate
  if (criteria.min_growth_rate && startup.metrics.growth_rate_yoy < criteria.min_growth_rate) {
    return false;
  }

  // Check team size
  if (criteria.min_team_size && startup.team_size < criteria.min_team_size) {
    return false;
  }

  // Check burn rate
  if (criteria.max_burn_rate && startup.metrics.burn_rate > criteria.max_burn_rate) {
    return false;
  }

  // Check sector match
  const sectorMatch = this.focus_areas.sectors.some((sector: string) =>
    startup.sector.includes(sector)
  );
  if (!sectorMatch) {
    return false;
  }

  // Check stage match
  if (!this.focus_areas.stages.includes(startup.stage)) {
    return false;
  }

  // Check geography match
  const geoMatch = this.focus_areas.geographies.some(
    (geo: string) =>
      startup.location.country.toLowerCase().includes(geo.toLowerCase()) ||
      startup.location.region?.toLowerCase().includes(geo.toLowerCase())
  );
  if (!geoMatch) {
    return false;
  }

  return true;
};

export default mongoose.model<IInvestorThesis>('InvestorThesis', InvestorThesisSchema);
