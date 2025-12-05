// src/types/common.types.ts

import {
  EducationDegree,
  ExitType,
  RiskLevel,
  NotificationChannel,
  BusinessModel,
  StartupStage,
} from './model.types';

/**
 * Location
 */
export interface Location {
  city: string;
  country: string;
  region?: string;
}

/**
 * Funding Round
 */
export interface FundingRound {
  round_type: string;
  amount: number;
  currency: string;
  date: Date;
  investors: string[];
  valuation?: number;
}

/**
 * Startup Metrics
 */
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

/**
 * Note
 */
export interface Note {
  user_id: string;
  content: string;
  created_at: Date;
}

/**
 * Education
 */
export interface Education {
  institution: string;
  degree: EducationDegree;
  field_of_study: string;
  start_year: number;
  end_year?: number;
  is_graduated: boolean;
}

/**
 * Experience
 */
export interface Experience {
  company: string;
  title: string;
  description?: string;
  start_date: Date;
  end_date?: Date;
  is_current: boolean;
  achievements: string[];
}

/**
 * Previous Startup
 */
export interface PreviousStartup {
  name: string;
  role: string;
  outcome: string;
  exit_value?: number;
  description?: string;
}

/**
 * Skills
 */
export interface Skills {
  technical_skills: string[];
  domain_expertise: string[];
  leadership_experience: boolean;
  years_of_experience: number;
}

/**
 * Investment Details
 */
export interface InvestmentDetails {
  investment_date: Date;
  amount_invested: number;
  currency: string;
  ownership_percentage: number;
  valuation_at_investment: number;
  round_type: string;
  lead_investor: boolean;
  board_seat: boolean;
}

/**
 * Performance Metrics
 */
export interface PerformanceMetrics {
  last_reported_revenue?: number;
  last_reported_arr?: number;
  last_reported_growth_rate?: number;
  last_reported_burn_rate?: number;
  last_reported_runway?: number;
  last_update_date?: Date;
}

/**
 * Milestone
 */
export interface Milestone {
  title: string;
  description?: string;
  achieved: boolean;
  target_date?: Date;
  achieved_date?: Date;
}

/**
 * KPI Tracking
 */
export interface KPITracking {
  metric_name: string;
  value: number;
  recorded_at: Date;
}

/**
 * Exit Details
 */
export interface ExitDetails {
  exit_type: ExitType;
  exit_date: Date;
  exit_valuation: number;
  proceeds: number;
  multiple: number;
  irr: number;
}

/**
 * Risk Assessment
 */
export interface RiskAssessment {
  risk_level: RiskLevel;
  risk_factors: string[];
  last_assessed: Date;
}

/**
 * User Preferences
 */
export interface UserPreferences {
  notification_channels: NotificationChannel[];
  alert_types: string[];
  dashboard_layout: any;
  scoring_weights: any;
}

/**
 * Focus Areas
 */
export interface FocusAreas {
  sectors: string[];
  stages: StartupStage[];
  geographies: string[];
  business_models: BusinessModel[];
}

/**
 * Investment Criteria
 */
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

/**
 * Target Metrics
 */
export interface TargetMetrics {
  target_irr?: number;
  target_multiple?: number;
  investment_horizon_years?: number;
}

/**
 * Examples
 */
export interface Examples {
  positive_examples: string[];
  negative_examples: string[];
}

/**
 * Job Status
 */
export interface JobStatus {
  id: string;
  progress: number;
  state: 'waiting' | 'active' | 'completed' | 'failed';
  result?: any;
  failedReason?: string;
}

/**
 * Date Range
 */
export interface DateRange {
  start_date: Date;
  end_date: Date;
}

/**
 * Aggregation Result
 */
export interface AggregationResult {
  synced: number;
  errors: number;
  failed_items?: any[];
}
