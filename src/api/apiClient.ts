import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://droptaxi-backend.onrender.com';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add admin token if available
apiClient.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Request timed out. Please check your internet connection.');
    }

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 400:
          throw new Error(data.message || 'Invalid request. Please check your input.');
        case 401:
          // Clear invalid token and redirect to login
          localStorage.removeItem('admin_token');
          // Only redirect if we're in a browser environment
          if (typeof window !== 'undefined' && window.location.pathname.includes('/admin') && !window.location.pathname.includes('/admin/login')) {
            window.location.href = '/Droptaxi-frontend/admin/login';
          }
          throw new Error('Authentication required. Please log in again.');
        case 403:
          throw new Error('Access denied. Insufficient permissions.');
        case 404:
          throw new Error('Requested resource not found.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(data.message || `Request failed with status ${status}`);
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your internet connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
);

export default apiClient;
