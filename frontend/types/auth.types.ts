// src/types/auth.types.ts

export interface UserPreferences {
  notification_channels: ('email' | 'slack' | 'teams')[];
  alert_types: string[];
  dashboard_layout: object;
  scoring_weights: {
    market_weight: number;
    traction_weight: number;
    team_weight: number;
    financial_weight: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  firm_name: string;
  role: 'admin' | 'investor' | 'analyst';
  preferences: UserPreferences;
  profile_picture?: string;
  phone?: string;
  linkedin_url?: string;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface AuthTokens {
  access: {
    token: string;
    expires: Date;
  };
  refresh: {
    token: string;
    expires: Date;
  };
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterPayload {
  email: string;
  password?: string; // Password is required during register, but might be omitted in other contexts
  name: string;
  firm_name: string;
  role: 'investor' | 'analyst';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface UpdatePreferencesPayload {
  preferences: Partial<UserPreferences>;
}
