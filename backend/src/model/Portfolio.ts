// src/model/Portfolio.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolio extends Document {
  startup_id: mongoose.Types.ObjectId;
  investor_id: mongoose.Types.ObjectId;
  investment_details: {
    investment_date: Date;
    amount_invested: number;
    currency: string;
    ownership_percentage: number;
    valuation_at_investment: number;
    round_type: string;
    lead_investor: boolean;
    board_seat: boolean;
  };
  current_status: {
    current_valuation?: number;
    unrealized_multiple?: number;
    ownership_diluted_percentage?: number;
    status: 'active' | 'exited' | 'written-off' | 'zombie';
  };
  performance_metrics: {
    last_reported_revenue?: number;
    last_reported_arr?: number;
    last_reported_growth_rate?: number;
    last_reported_burn_rate?: number;
    last_reported_runway?: number;
    last_update_date?: Date;
  };
  milestones: Array<{
    title: string;
    description: string;
    achieved: boolean;
    target_date?: Date;
    achieved_date?: Date;
  }>;
  kpi_tracking: Array<{
    metric_name: string;
    value: number;
    recorded_at: Date;
  }>;
  follow_on_rounds: Array<{
    round_type: string;
    date: Date;
    amount: number;
    participated: boolean;
    amount_invested?: number;
  }>;
  exit_details?: {
    exit_type: 'ipo' | 'acquisition' | 'secondary-sale' | 'buyback';
    exit_date: Date;
    exit_valuation: number;
    proceeds: number;
    multiple: number;
    irr: number;
  };
  risk_assessment: {
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    risk_factors: string[];
    last_assessed: Date;
  };
  notes: Array<{
    user_id: mongoose.Types.ObjectId;
    content: string;
    created_at: Date;
  }>;
  created_at: Date;
  updated_at: Date;
}

const PortfolioSchema: Schema = new Schema(
  {
    startup_id: {
      type: Schema.Types.ObjectId,
      ref: 'Startup',
      required: true,
      index: true,
    },
    investor_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    investment_details: {
      investment_date: {
        type: Date,
        required: true,
      },
      amount_invested: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'GBP', 'BDT'],
      },
      ownership_percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      valuation_at_investment: {
        type: Number,
        required: true,
        min: 0,
      },
      round_type: {
        type: String,
        required: true,
        enum: ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth'],
      },
      lead_investor: {
        type: Boolean,
        default: false,
      },
      board_seat: {
        type: Boolean,
        default: false,
      },
    },
    current_status: {
      current_valuation: Number,
      unrealized_multiple: Number,
      ownership_diluted_percentage: Number,
      status: {
        type: String,
        enum: ['active', 'exited', 'written-off', 'zombie'],
        default: 'active',
        index: true,
      },
    },
    performance_metrics: {
      last_reported_revenue: Number,
      last_reported_arr: Number,
      last_reported_growth_rate: Number,
      last_reported_burn_rate: Number,
      last_reported_runway: Number,
      last_update_date: Date,
    },
    milestones: [
      {
        title: {
          type: String,
          required: true,
        },
        description: String,
        achieved: {
          type: Boolean,
          default: false,
        },
        target_date: Date,
        achieved_date: Date,
      },
    ],
    kpi_tracking: [
      {
        metric_name: {
          type: String,
          required: true,
        },
        value: {
          type: Number,
          required: true,
        },
        recorded_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    follow_on_rounds: [
      {
        round_type: String,
        date: Date,
        amount: Number,
        participated: Boolean,
        amount_invested: Number,
      },
    ],
    exit_details: {
      exit_type: {
        type: String,
        enum: ['ipo', 'acquisition', 'secondary-sale', 'buyback'],
      },
      exit_date: Date,
      exit_valuation: Number,
      proceeds: Number,
      multiple: Number,
      irr: Number,
    },
    risk_assessment: {
      risk_level: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
      },
      risk_factors: [String],
      last_assessed: Date,
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
    collection: 'portfolios',
  }
);

PortfolioSchema.index({ investor_id: 1, 'current_status.status': 1 });
PortfolioSchema.index({ startup_id: 1, investor_id: 1 }, { unique: true });

export default mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
