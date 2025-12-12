export interface Startup {
  id: string;
  name: string;
  description: string;
  industry: string;
  website: string;
  logo_url: string;
  founded_date: string;
  location: string;
  team_size: number;
  created_at: string;
  updated_at: string;
}

export interface CreateStartupPayload {
  name: string;
  description: string;
  industry: string;
  website: string;
  logo_url?: string;
  founded_date: string;
  location: string;
  team_size: number;
}

export interface UpdateStartupPayload {
  name?: string;
  description?: string;
  industry?: string;
  website?: string;
  logo_url?: string;
  founded_date?: string;
  location?: string;
  team_size?: number;
}
