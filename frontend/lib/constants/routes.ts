// src/lib/constants/routes.ts

export const AppRoutes = {
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Dashboard routes
  DASHBOARD: '/dashboard',
  DEALS: '/deals',
  DEAL_DETAIL: (id: string) => `/deals/${id}`,
  DEAL_NEW: '/deals/new',
  DEAL_IMPORT: '/deals/import',
  SCORING: '/scoring',
  SCORING_COMPARE: '/scoring/compare',
  THESIS: '/thesis',
  THESIS_DETAIL: (id: string) => `/thesis/${id}`,
  THESIS_NEW: '/thesis/new',
  FOUNDERS: '/founders',
  FOUNDER_PROFILE: (id: string) => `/founders/${id}`,
  PORTFOLIO: '/portfolio',
  PORTFOLIO_DETAIL: (id: string) => `/portfolio/${id}`,
  ALERTS: '/alerts',
  REPORTS: '/reports',
  REPORT_GENERATE: '/reports/generate',
  SETTINGS: '/settings',
  PROFILE_SETTINGS: '/settings/profile',
  PREFERENCES_SETTINGS: '/settings/preferences',
  TEAM_SETTINGS: '/settings/team',

  // Landing pages
  HOMEPAGE: '/',
  ABOUT: '/about',
  PRICING: '/pricing',
  FEATURES: '/features',
};
