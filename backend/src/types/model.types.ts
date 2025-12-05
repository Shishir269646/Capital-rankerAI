// src/types/model.types.ts

export type UserRole = 'admin' | 'investor' | 'analyst';

export type StartupStage = 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'growth';

export type StartupStatus = 'active' | 'archived' | 'rejected' | 'invested';

export type BusinessModel =
  | 'B2B'
  | 'B2C'
  | 'B2B2C'
  | 'marketplace'
  | 'subscription'
  | 'transaction-based'
  | 'freemium'
  | 'other';

export type RecommendationType = 'pass' | 'watch' | 'consider' | 'strong-consider' | 'pursue';

export type GrowthPotential = 'low' | 'medium' | 'high' | 'very-high';

export type RiskLevel = 'low' | 'medium' | 'high' | 'very-high';

export type AlertType =
  | 'competitive_threat'
  | 'market_shift'
  | 'portfolio_anomaly'
  | 'funding_round'
  | 'regulatory_change'
  | 'custom';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export type AlertStatus = 'unread' | 'read' | 'archived';

export type PortfolioStatus = 'active' | 'exited' | 'written-off' | 'zombie';

export type ExitType = 'ipo' | 'acquisition' | 'secondary-sale' | 'buyback';

export type FounderRole = 'ceo' | 'cto' | 'coo' | 'cfo' | 'co-founder' | 'founder';

export type RedFlagType =
  | 'employment-gap'
  | 'frequent-job-changes'
  | 'failed-startup'
  | 'legal-issues'
  | 'reputation-concerns'
  | 'skill-mismatch'
  | 'other';

export type RedFlagSeverity = 'low' | 'medium' | 'high';

export type EducationDegree = 'high-school' | 'bachelor' | 'master' | 'phd' | 'mba' | 'other';

export type StartupOutcome = 'exit' | 'active' | 'failed' | 'acquired';

export type NotificationChannel = 'email' | 'slack' | 'teams';

export type DataSource = 'dealroom' | 'crunchbase' | 'manual' | 'angellist';

export type ReportType =
  | 'deal_analysis'
  | 'portfolio_summary'
  | 'performance_tracking'
  | 'investment_thesis'
  | 'custom';

export type ReportFormat = 'pdf' | 'excel' | 'csv';
