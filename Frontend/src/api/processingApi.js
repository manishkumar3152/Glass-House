import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiConstants';

export const processingApi = {
  getCharges: () => axiosInstance.get(API_ENDPOINTS.PROCESSING_CHARGES),
  createCharge: (data) => axiosInstance.post(API_ENDPOINTS.PROCESSING_CHARGES, data),
  updateCharge: (id, data) => axiosInstance.put(`${API_ENDPOINTS.PROCESSING_CHARGES}/${id}`, data),
  deleteCharge: (id) => axiosInstance.delete(`${API_ENDPOINTS.PROCESSING_CHARGES}/${id}`),
  bulkUpdateChargeStatus: (ids, status) => axiosInstance.post(`${API_ENDPOINTS.PROCESSING_CHARGES}/bulk-status`, { ids, status }),
  bulkDeleteCharges: (ids) => axiosInstance.post(`${API_ENDPOINTS.PROCESSING_CHARGES}/bulk-delete`, { ids })
};

export default processingApi;
