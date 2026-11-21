import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiConstants';

export const customerApi = {
  getCustomers: (params) => axiosInstance.get(API_ENDPOINTS.CUSTOMERS, { params }),
  getCustomerById: (id) => axiosInstance.get(`${API_ENDPOINTS.CUSTOMERS}/${id}`),
  createCustomer: (data) => axiosInstance.post(API_ENDPOINTS.CUSTOMERS, data),
  updateCustomer: (id, data) => axiosInstance.put(`${API_ENDPOINTS.CUSTOMERS}/${id}`, data),
  deleteCustomer: (id) => axiosInstance.delete(`${API_ENDPOINTS.CUSTOMERS}/${id}`)
};
