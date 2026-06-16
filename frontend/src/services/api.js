import axios from 'axios';
import { tokenStorage } from '@/utils/tokenStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically inject Authorization token
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Globally handle error codes (e.g. 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred.',
      status: error.response?.status,
      code: error.code,
      data: error.response?.data,
    };

    if (customError.status === 401) {
      // Clear token and fire global unauthorized event to prompt context redirection
      tokenStorage.removeToken();
      window.dispatchEvent(new CustomEvent('auth-unauthorized'));
    }

    return Promise.reject(customError);
  }
);

export default api;
