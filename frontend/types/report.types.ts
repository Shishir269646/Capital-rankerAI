// src/types/report.types.ts

import { User } from './auth.types';

export interface Report {
  id: string; // Unique ID for the report
  user_id: string | User; // User who generated the report
  title: string;
  type: 'deal_summary' | 'portfolio_overview' | 'founder_analysis' | 'thesis_match' | 'custom';
  status: 'pending' | 'generating' | 'completed' | 'failed';
  format: 'pdf' | 'csv' | 'xlsx';
  file_url?: string; // URL to the generated report file
  generated_at: Date;
  expires_at?: Date; // If reports have a lifespan
  parameters?: object; // Parameters used to generate the report
  error_message?: string; // If status is 'failed'
}

// Payload for requesting a report generation
export interface GenerateReportPayload {
  reportType: Report['type'];
  format: Report['format'];
  params: object; // Specific parameters for the report type (e.g., dealId, dateRange)
}
