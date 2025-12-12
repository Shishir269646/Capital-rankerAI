// src/types/portfolio.types.ts

import { User } from './auth.types'; // Assuming User type is defined
import { Deal } from './deal.types'; // Assuming Deal type is defined

export interface InvestmentDetails {
  investment_date: Date;
  amount_invested: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'BDT';
  ownership_percentage: number;
  valuation_at_investment: number;
  round_type: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'growth';
  lead_investor: boolean;
  board_seat: boolean;
}

export interface CurrentStatus {
  current_valuation?: number;
  unrealized_multiple?: number;
  ownership_diluted_percentage?: number;
  status: 'active' | 'exited' | 'written-off' | 'zombie';
}

export interface PerformanceMetrics {
  last_reported_revenue?: number;
  last_reported_arr?: number;
  last_reported_growth_rate?: number;
  last_reported_burn_rate?: number;
  last_reported_runway?: number;
  last_update_date?: Date;
}

export interface Milestone {
  title: string;
  description?: string;
  achieved: boolean;
  target_date?: Date;
  achieved_date?: Date;
}

export interface KPITracking {
  metric_name: string;
  value: number;
  recorded_at: Date;
}

export interface FollowOnRound {
  round_type?: string;
  date?: Date;
  amount?: number;
  participated?: boolean;
  amount_invested?: number;
}

export interface ExitDetails {
  exit_type: 'ipo' | 'acquisition' | 'secondary-sale' | 'buyback';
  exit_date: Date;
  exit_valuation: number;
  proceeds: number;
  multiple: number;
  irr: number;
}

export interface RiskAssessment {
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: string[];
  last_assessed: Date;
}

export interface PortfolioNote {
  user_id: string | User;
  content: string;
  created_at: Date;
}

export interface Portfolio {
  id: string; // Mongoose _id
  startup_id: string | Deal; // Can be ObjectId string or populated Startup (Deal) object
  investor_id: string | User; // Can be ObjectId string or populated User object
  investment_details: InvestmentDetails;
  current_status: CurrentStatus;
  performance_metrics: PerformanceMetrics;
  milestones: Milestone[];
  kpi_tracking: KPITracking[];
  follow_on_rounds: FollowOnRound[];
  exit_details?: ExitDetails;
  risk_assessment: RiskAssessment;
  notes: PortfolioNote[];
  created_at: Date;
  updated_at: Date;
}

// Payload for creating a new portfolio entry
export type CreatePortfolioPayload = Omit<Portfolio, 'id' | 'created_at' | 'updated_at'>;

// Payload for updating an existing portfolio entry
export type UpdatePortfolioPayload = Partial<CreatePortfolioPayload>;

export interface PortfolioPerformance {
  total_value?: number;
  roi?: number;
  // Add other properties as they appear in the API response
}
