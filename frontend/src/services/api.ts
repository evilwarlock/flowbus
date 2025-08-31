import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiError } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError<any>) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        
        // Handle FastAPI validation errors (arrays of objects)
        let errorMessage = 'An error occurred';
        
        if (error.response?.data?.detail) {
          const detail = error.response.data.detail;
          
          if (Array.isArray(detail)) {
            // FastAPI validation errors
            errorMessage = detail
              .map((err: any) => err.msg || 'Validation error')
              .join(', ');
          } else if (typeof detail === 'string') {
            // Simple string error
            errorMessage = detail;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        const apiError: ApiError = {
          detail: errorMessage,
          status_code: error.response?.status,
        };
        
        return Promise.reject(apiError);
      }
    );
  }

  // Generic request method
  async request<T>(method: string, url: string, data?: any): Promise<T> {
    console.log('🔍 API Request:', { method, url, dataType: data?.constructor?.name, data: data instanceof FormData ? '[FormData]' : data });
    
    try {
      const config: any = {
        method,
        url,
        data,
      };
      
      // Handle FormData - remove Content-Type to let axios set it automatically
      if (data instanceof FormData) {
        config.headers = { ...config.headers };
        delete config.headers['Content-Type']; // Let axios set multipart/form-data
        console.log('🔍 Using FormData, removed Content-Type header');
      }
      
      // Handle URLSearchParams for OAuth2 form data
      if (data instanceof URLSearchParams) {
        config.headers = { ...config.headers, 'Content-Type': 'application/x-www-form-urlencoded' };
        console.log('🔍 Using URLSearchParams for OAuth2 form data');
      }
      
      const response = await this.api.request<T>(config);
      console.log('🔍 API Response:', { status: response.status, data: response.data });
      return response.data;
    } catch (error) {
      console.error('🔍 API Error:', error);
      throw error;
    }
  }

  // Convenience methods
  async get<T>(url: string): Promise<T> {
    return this.request<T>('GET', url);
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>('POST', url, data);
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>('PUT', url, data);
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>('DELETE', url);
  }

  // Set auth token
  setAuthToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  // Clear auth token
  clearAuthToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  // Get current token
  getAuthToken(): string | null {
    return localStorage.getItem('access_token');
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
