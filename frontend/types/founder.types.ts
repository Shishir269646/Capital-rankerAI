// src/types/founder.types.ts

export interface FounderProfile {
  bio: string;
  linkedin_url?: string;
  twitter_url?: string;
  github_url?: string;
  profile_picture?: string;
}

export interface FounderEducation {
  institution: string;
  degree: 'high-school' | 'bachelor' | 'master' | 'phd' | 'mba' | 'other';
  field_of_study: string;
  start_year: number;
  end_year?: number;
  is_graduated: boolean;
  graduation_year?: number;
}

export interface FounderExperience {
  company: string;
  title: string;
  description?: string;
  start_date: Date;
  end_date?: Date;
  is_current: boolean;
  achievements: string[];
}

export interface FounderSkills {
  technical_skills: string[];
  domain_expertise: string[];
  leadership_experience: boolean;
  years_of_experience: number;
}

export interface PreviousStartup {
  name: string;
  role: string;
  outcome: 'exit' | 'active' | 'failed' | 'acquired';
  exit_value?: number;
  description?: string;
}

export interface FounderScore {
  overall_score: number;
  experience_score: number;
  education_score: number;
  track_record_score: number;
  leadership_score: number;
  adaptability_score: number;
  domain_expertise_score: number;
  scored_at: Date;
}

export interface RedFlag {
  type: 'employment-gap' | 'frequent-job-changes' | 'failed-startup' | 'legal-issues' | 'reputation-concerns' | 'skill-mismatch' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high';
  detected_at: Date;
}

export interface FounderReference {
  name: string;
  relationship: string;
  contact?: string;
  verified: boolean;
  notes?: string;
}

export interface Founder {
  id: string; // Mongoose _id
  name: string;
  email?: string;
  role: 'ceo' | 'cto' | 'coo' | 'cfo' | 'co-founder' | 'founder';
  startup_id: string; // ID of the associated Startup
  profile: FounderProfile;
  education: FounderEducation[];
  experience: FounderExperience[];
  skills: FounderSkills;
  previous_startups: PreviousStartup[];
  achievements: string[];
  publications?: string[];
  patents?: string[];
  awards?: string[];
  founder_score?: FounderScore;
  red_flags: RedFlag[];
  references: FounderReference[];
  last_synced?: Date;
  created_at: Date;
  updated_at: Date;
  total_experience_years?: number; // Virtual
  successful_exits_count?: number; // Virtual
  has_critical_red_flags?: boolean; // Virtual
}

// Payload for creating a new founder
export type CreateFounderPayload = Omit<Founder, 'id' | 'created_at' | 'updated_at' | 'founder_score' | 'total_experience_years' | 'successful_exits_count' | 'has_critical_red_flags'>;

// Payload for updating an existing founder
export type UpdateFounderPayload = Partial<CreateFounderPayload>;
