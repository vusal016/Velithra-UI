/**
 * Velithra API Client - Axios Configuration
 * Main HTTP client with interceptors for authentication and error handling
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import ENV from '@/lib/config/env';
import type { GenericResponse } from '@/lib/types';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// ============================================
// REQUEST INTERCEPTOR - Add JWT Token
// ============================================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('velithra_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (ENV.IS_DEVELOPMENT) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR - Handle Errors
// ============================================
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (ENV.IS_DEVELOPMENT) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError<GenericResponse<any>>) => {
    // Log error in development
    if (ENV.IS_DEVELOPMENT) {
      console.error('[API Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401: // Unauthorized
          // Clear auth data and redirect to login
          localStorage.removeItem('velithra_token');
          localStorage.removeItem('velithra_user');
          
          // Only redirect if not already on login page
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;

        case 403: // Forbidden
          console.error('Access denied: Insufficient permissions');
          break;

        case 404: // Not Found
          console.error('Resource not found');
          break;

        case 422: // Validation Error
          console.error('Validation failed:', data?.errors);
          break;

        case 500: // Internal Server Error
          console.error('Server error occurred');
          break;

        default:
          console.error('API Error:', data?.message || 'An error occurred');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ============================================
// HELPER METHODS
// ============================================

/**
 * Extract data from GenericResponse wrapper
 */
export const unwrapResponse = <T>(response: GenericResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || 'Request failed');
  }
  return response.data as T;
};

/**
 * Check if request was successful
 */
export const isSuccess = (response: GenericResponse<any>): boolean => {
  return response.success && response.statusCode >= 200 && response.statusCode < 300;
};

export default apiClient;
