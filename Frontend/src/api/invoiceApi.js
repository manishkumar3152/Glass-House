import axiosInstance from './axiosInstance';
import { API_ENDPOINTS, API_BASE_URL } from '../constants/apiConstants';

export const invoiceApi = {
  getInvoices: (params) => axiosInstance.get(API_ENDPOINTS.INVOICES.BASE, { params }),
  getInvoiceById: (id) => axiosInstance.get(`${API_ENDPOINTS.INVOICES.BASE}/${id}`),
  createInvoice: (data) => axiosInstance.post(API_ENDPOINTS.INVOICES.BASE, data),
  updateInvoice: (id, data) => axiosInstance.put(`${API_ENDPOINTS.INVOICES.BASE}/${id}`, data),
  deleteInvoice: (id) => axiosInstance.delete(`${API_ENDPOINTS.INVOICES.BASE}/${id}`),

  approveInvoice: (id) => axiosInstance.post(API_ENDPOINTS.INVOICES.APPROVE(id)),
  cancelInvoice: (id) => axiosInstance.post(API_ENDPOINTS.INVOICES.CANCEL(id)),
  duplicateInvoice: (id) => axiosInstance.post(API_ENDPOINTS.INVOICES.DUPLICATE(id)),

  calculateLive: (data) => axiosInstance.post(API_ENDPOINTS.INVOICES.CALCULATE, data),
  generatePdf: (id) => axiosInstance.post(API_ENDPOINTS.INVOICES.GENERATE_PDF(id)),
  bulkUpdateStatus: (ids, status) => axiosInstance.post(`${API_ENDPOINTS.INVOICES.BASE}/bulk-status`, { ids, status }),
  bulkDelete: (ids) => axiosInstance.post(`${API_ENDPOINTS.INVOICES.BASE}/bulk-delete`, { ids }),

  getPdfUrl: (id) => `${API_BASE_URL}${API_ENDPOINTS.INVOICES.PDF(id)}`,
  getPreviewHtmlUrl: (id) => `${API_BASE_URL}${API_ENDPOINTS.INVOICES.PREVIEW_HTML(id)}`
};

export default invoiceApi;
