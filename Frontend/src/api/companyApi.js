import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiConstants';

export const companyApi = {
  getCompany: () => axiosInstance.get(API_ENDPOINTS.COMPANY),
  updateCompany: (data) => axiosInstance.put(API_ENDPOINTS.COMPANY, data)
};
