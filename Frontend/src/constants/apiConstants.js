export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me'
  },
  CUSTOMERS: '/customers',
  COMPANY: '/company',
  GLASS_SPECIFICATIONS: '/glass-specifications',
  GLASS_RATES: '/glass-rates',
  PROCESSING_CHARGES: '/processing-charges',
  TAX: '/tax',
  INVOICES: {
    BASE: '/invoices',
    CALCULATE: '/invoices/calculate',
    APPROVE: (id) => `/invoices/${id}/approve`,
    CANCEL: (id) => `/invoices/${id}/cancel`,
    DUPLICATE: (id) => `/invoices/${id}/duplicate`,
    PDF: (id) => `/invoices/${id}/pdf`,
    GENERATE_PDF: (id) => `/invoices/${id}/generate-pdf`,
    PREVIEW_HTML: (id) => `/invoices/${id}/preview-html`
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT: '/dashboard/recent-invoices',
    CHARTS: '/dashboard/charts'
  }
};
