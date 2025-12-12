// src/types/thesis.types.ts

import { User } from './auth.types';
import { Deal } from './deal.types'; // Import Deal

export interface ThesisFocusAreas {
  sectors: string[];
  stages: ('pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'growth')[];
  geographies: string[];
  business_models: ('B2B' | 'B2C' | 'B2B2C' | 'marketplace' | 'subscription' | 'transaction-based' | 'freemium' | 'other')[];
}

export interface InvestmentCriteria {
  min_revenue?: number;
  min_growth_rate?: number;
  min_team_size?: number;
  max_burn_rate?: number;
  check_size_min?: number;
  check_size_max?: number;
  must_have_features: string[];
  deal_breakers: string[];
}

export interface TargetMetrics {
  target_irr?: number;
  target_multiple?: number;
  investment_horizon_years?: number;
}

export interface ThesisExamples {
  positive_examples: string[];
  negative_examples: string[];
}

export interface InvestorThesis {
  id: string; // Mongoose _id
  investor_id: string | User; // Can be ObjectId string or populated User object
  title: string;
  thesis_text: string;
  thesis_embedding?: number[];
  focus_areas: ThesisFocusAreas;
  investment_criteria: InvestmentCriteria;
  key_themes: string[];
  preferred_technologies: string[];
  exclusions: string[];
  target_metrics: TargetMetrics;
  examples: ThesisExamples;
  is_active: boolean;
  version: number;
  created_at: Date;
  updated_at: Date;
}

// Result structure for getTopMatchesForInvestor
export interface InvestorMatchResult {
  deal: Deal;
  match_score: number;
  matched_keywords: string[];
}

// Payload for creating a new investor thesis
export type CreateInvestorThesisPayload = Omit<InvestorThesis, 'id' | 'created_at' | 'updated_at' | 'thesis_embedding' | 'version' | 'investor_id'>;

// Payload for updating an existing investor thesis
export type UpdateInvestorThesisPayload = Partial<CreateInvestorThesisPayload>;
