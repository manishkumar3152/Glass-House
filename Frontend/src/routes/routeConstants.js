export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  CUSTOMERS: {
    LIST: '/customers',
    CREATE: '/customers/create',
    EDIT: (id) => `/customers/edit/${id}`
  },
  INVOICES: {
    LIST: '/invoices',
    CREATE: '/invoices/create',
    EDIT: (id) => `/invoices/edit/${id}`,
    VIEW: (id) => `/invoices/view/${id}`,
    PREVIEW: (id) => `/invoices/preview/${id}`
  },
  MASTERS: {
    COMPANY: '/masters/company',
    GLASS_SPECS: '/masters/glass-specifications',
    GLASS_RATES: '/masters/glass-rates',
    PROCESSING: '/masters/processing-charges',
    TAX: '/masters/tax',
    TERMS: '/masters/terms'
  }
};
