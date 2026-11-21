import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiConstants';

export const dashboardApi = {
  getStats: () => axiosInstance.get(API_ENDPOINTS.DASHBOARD.STATS),
  getRecentInvoices: () => axiosInstance.get(API_ENDPOINTS.DASHBOARD.RECENT),
  getCharts: () => axiosInstance.get(API_ENDPOINTS.DASHBOARD.CHARTS)
};
