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
    try {
      // Get token from localStorage (check both keys for backward compatibility)
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const token = localStorage.getItem('token') || localStorage.getItem('velithra_token');
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // Log request in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data,
        });
      }
    } catch (err) {
      // Silently fail if there's an error
      console.warn('Request interceptor error:', err);
    }

    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

// ============================================
// TOKEN REFRESH LOGIC
// ============================================
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
  try {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refreshToken') || localStorage.getItem('velithra_refresh_token')
      : null;

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post<GenericResponse<{ token: string; refreshToken: string }>>(
      `${ENV.API_BASE_URL}/Auth/refresh`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.data.success && response.data.data) {
      const { token, refreshToken: newRefreshToken } = response.data.data;
      
      // Update tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('velithra_token', token);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
          localStorage.setItem('velithra_refresh_token', newRefreshToken);
        }
      }

      return token;
    }

    throw new Error('Token refresh failed');
  } catch (error) {
    // Clear auth data on refresh failure
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('velithra_token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('velithra_refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('velithra_user');
    }
    throw error;
  }
};

// ============================================
// RESPONSE INTERCEPTOR - Handle Errors & Unwrap GenericResponse
// ============================================
apiClient.interceptors.response.use(
  (response) => {
    try {
      // Log response in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
      }

      // Unwrap GenericResponse if present
      if (response.data && typeof response.data === 'object' && 'data' in response.data && 'isSuccess' in response.data) {
        console.log('[API] Unwrapping GenericResponse, actual data:', response.data.data);
        // Replace response.data with the unwrapped data
        response.data = response.data.data;
      }
    } catch (err) {
      // Silently fail
      console.warn('[API] Response unwrap error:', err);
    }
    return response;
  },
  async (error: AxiosError<GenericResponse<any>>) => {
    try {
      // Log error in development
      if (process.env.NODE_ENV === 'development') {
        console.error('[API Error]', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      }
    } catch (err) {
      // Silently fail
    }

    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401: // Unauthorized - Try token refresh
          const originalRequest = error.config;
          
          if (originalRequest && !originalRequest.headers?.['X-Retry']) {
            if (isRefreshing) {
              // Queue the request
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              })
                .then((token) => {
                  originalRequest.headers!.Authorization = `Bearer ${token}`;
                  return apiClient(originalRequest);
                })
                .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['X-Retry'] = 'true';

            try {
              const newToken = await refreshAccessToken();
              processQueue(null, newToken);
              
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return apiClient(originalRequest);
            } catch (refreshError) {
              processQueue(refreshError, null);
              
              // Clear auth data and redirect to login
              if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('velithra_token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('velithra_refresh_token');
                localStorage.removeItem('user');
                localStorage.removeItem('velithra_user');
                localStorage.removeItem('roles');
                
                if (!window.location.pathname.includes('/login')) {
                  window.location.href = '/login';
                }
              }
              
              return Promise.reject(refreshError);
            } finally {
              isRefreshing = false;
            }
          }
          break;

        case 403: // Forbidden
          console.error('Access denied: Insufficient permissions');
          break;

        case 404: // Not Found
          console.error('Resource not found');
          break;

        case 422: // Validation Error
          console.error('Validation failed:', data);
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
