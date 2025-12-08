// src/lib/constants/api-endpoints.ts

// Centralized API endpoint definitions
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    UPDATE_PREFERENCES: '/auth/preferences',
  },

  // Deals
  DEALS: {
    BASE: '/deals',
    BY_ID: (id: string) => `/deals/${id}`,
    SEARCH: '/deals/search',
    BULK_IMPORT: '/deals/bulk-import',
    STATS: '/deals/stats',
  },

  // Scoring
  SCORING: {
    BASE: '/scoring',
    BY_ID: (id: string) => `/scoring/${id}`,
    LATEST_FOR_STARTUP: (startupId: string) => `/scoring/startup/${startupId}/latest`,
    TRIGGER_SCORING: (startupId: string) => `/scoring/startup/${startupId}/trigger`,
  },

  // Thesis
  THESIS: {
    BASE: '/thesis',
    BY_ID: (id: string) => `/thesis/${id}`,
    MATCHING_DEALS: (id: string) => `/thesis/${id}/matching-deals`,
  },

  // Founders
  FOUNDERS: {
    BASE: '/founders',
    BY_ID: (id: string) => `/founders/${id}`,
  },

  // Portfolio
  PORTFOLIO: {
    BASE: '/portfolio',
    BY_ID: (id: string) => `/portfolio/${id}`,
    PERFORMANCE: '/portfolio/performance',
  },

  // Alerts
  ALERTS: {
    BASE: '/alerts',
    BY_ID: (id: string) => `/alerts/${id}`,
    MARK_READ: (id: string) => `/alerts/${id}/mark-read`,
    UNREAD_COUNT: '/alerts/unread/count',
  },

  // Reports
  REPORTS: {
    BASE: '/reports',
    BY_ID: (id: string) => `/reports/${id}`,
    GENERATE: '/reports/generate',
    DOWNLOAD: (id: string) => `/reports/${id}/download`,
  },
};
