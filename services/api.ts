import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

interface APIError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

class APIService {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth token injection
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for automatic JWT refresh and error formatting
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // If error has no config or response, reject formatted error
        if (!originalRequest || !error.response) {
          return Promise.reject(this.formatError(error));
        }

        const isAuthEndpoint =
          originalRequest.url?.includes('/api/v1/auth/login/') ||
          originalRequest.url?.includes('/api/v1/auth/refresh/');

        // If a 401 occurs on login or refresh endpoint, do NOT attempt token refresh
        if (error.response.status === 401 && isAuthEndpoint) {
          return Promise.reject(this.formatError(error));
        }

        // If 401 occurs on protected endpoint, attempt silent token refresh once
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken = localStorage.getItem('refreshToken');

          if (!refreshToken) {
            this.clearAuthAndNotify();
            return Promise.reject(this.formatError(error));
          }

          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((newToken: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
                resolve(this.client(originalRequest));
              });
            });
          }

          this.isRefreshing = true;

          try {
            const refreshResponse = await axios.post(
              `${this.client.defaults.baseURL}/api/v1/auth/refresh/`,
              { refresh: refreshToken },
              { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
            );

            const newAccessToken = refreshResponse.data?.access;
            if (newAccessToken) {
              localStorage.setItem('authToken', newAccessToken);
              if (refreshResponse.data?.refresh) {
                localStorage.setItem('refreshToken', refreshResponse.data.refresh);
              }

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              }

              this.onTokenRefreshed(newAccessToken);
              return this.client(originalRequest);
            } else {
              throw new Error('No access token returned from refresh endpoint');
            }
          } catch (refreshErr) {
            this.clearAuthAndNotify();
            return Promise.reject(this.formatError(refreshErr as AxiosError));
          } finally {
            this.isRefreshing = false;
            this.refreshSubscribers = [];
          }
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private clearAuthAndNotify() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    window.dispatchEvent(new Event('autoera:unauthorized'));
  }

  private formatError(error: any): APIError {
    const status = error.response?.status || (error.code === 'ECONNABORTED' ? 408 : 500);
    let message = 'An unexpected server error occurred';

    if (error.response?.data) {
      const data = error.response.data;
      if (typeof data === 'string') {
        message = data;
      } else if (data.detail) {
        message = data.detail;
      } else if (data.error) {
        if (typeof data.error === 'string') {
          message = data.error;
        } else if (data.error.non_field_errors?.[0]) {
          message = data.error.non_field_errors[0];
        } else if (Array.isArray(data.error)) {
          message = data.error[0];
        }
      } else if (data.message) {
        message = data.message;
      }
    } else if (error.message) {
      message = error.message;
    }

    return {
      status,
      code: error.code || 'API_ERROR',
      message,
      details: error.response?.data,
      timestamp: new Date().toISOString(),
    };
  }

  // Generic typed HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
}

export const apiService = new APIService();
export default apiService;
