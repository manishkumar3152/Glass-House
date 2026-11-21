import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiConstants';

export const glassApi = {
  getSpecifications: () => axiosInstance.get(API_ENDPOINTS.GLASS_SPECIFICATIONS),
  createSpecification: (data) => axiosInstance.post(API_ENDPOINTS.GLASS_SPECIFICATIONS, data),
  updateSpecification: (id, data) => axiosInstance.put(`${API_ENDPOINTS.GLASS_SPECIFICATIONS}/${id}`, data),
  deleteSpecification: (id) => axiosInstance.delete(`${API_ENDPOINTS.GLASS_SPECIFICATIONS}/${id}`),

  getRates: (params) => axiosInstance.get(API_ENDPOINTS.GLASS_RATES, { params }),
  createRate: (data) => axiosInstance.post(API_ENDPOINTS.GLASS_RATES, data),
  updateRate: (id, data) => axiosInstance.put(`${API_ENDPOINTS.GLASS_RATES}/${id}`, data),
  deleteRate: (id) => axiosInstance.delete(`${API_ENDPOINTS.GLASS_RATES}/${id}`)
};
