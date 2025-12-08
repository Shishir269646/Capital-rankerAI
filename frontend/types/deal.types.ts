// src/types/deal.types.ts

import { User } from './auth.types'; // Assuming User type is defined

export interface FundingRound {
  round_type: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'bridge' | 'growth';
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'BDT';
  date: Date;
  investors: string[];
  valuation?: number;
}

export interface StartupMetrics {
  revenue: number;
  arr?: number;
  mrr?: number;
  growth_rate_mom: number;
  growth_rate_yoy: number;
  burn_rate: number;
  runway_months: number;
  gross_margin?: number;
  customer_count?: number;
  cac?: number;
  ltv?: number;
}

export interface StartupLocation {
  city: string;
  country: string;
  region?: string;
}

export interface DealNote {
  user_id: string | User; // Can be ObjectId string or populated User object
  content: string;
  created_at: Date;
}

export interface Deal {
  id: string; // Mongoose _id
  name: string;
  description: string;
  short_pitch?: string;
  sector: string[];
  stage: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'growth';
  funding_history: FundingRound[];
  metrics: StartupMetrics;
  team_size: number;
  founders: string[]; // Array of Founder IDs
  founded_date: Date;
  website: string;
  pitch_deck_url?: string;
  pitch_deck_text?: string;
  linkedin_url?: string;
  twitter_url?: string;
  location: StartupLocation;
  technology_stack: string[];
  business_model?: 'B2B' | 'B2C' | 'B2B2C' | 'marketplace' | 'subscription' | 'transaction-based' | 'freemium' | 'other';
  target_market?: string;
  competitive_advantage?: string;
  competitors: string[];
  source: 'dealroom' | 'crunchbase' | 'manual' | 'angellist';
  external_id?: string;
  last_synced?: Date;
  status: 'active' | 'archived' | 'rejected' | 'invested';
  tags: string[];
  notes: DealNote[];
  created_at: Date;
  updated_at: Date;
  total_funding?: number; // Virtual field
  latest_valuation?: number; // Virtual field
}

// Payload for creating a new deal
export type CreateDealPayload = Omit<Deal, 'id' | 'created_at' | 'updated_at' | 'total_funding' | 'latest_valuation' | 'notes'>;

// Payload for updating an existing deal
export type UpdateDealPayload = Partial<CreateDealPayload>;
