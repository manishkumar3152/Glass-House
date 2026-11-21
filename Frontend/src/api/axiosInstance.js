import axios from 'axios';
import { API_BASE_URL } from '../constants/apiConstants';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('glasshouse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';

    if (error.response?.status === 401) {
      localStorage.removeItem('glasshouse_token');
      localStorage.removeItem('glasshouse_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else {
      toast.error(message);
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;
