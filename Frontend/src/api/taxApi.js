import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiConstants';

export const taxApi = {
  getTaxConfig: () => axiosInstance.get(API_ENDPOINTS.TAX),
  updateTaxConfig: (data) => axiosInstance.put(API_ENDPOINTS.TAX, data)
};
