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
  private maxRetries = 3;
  private retryDelay = 1000; // Start with 1 second

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth token injection
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => this.handleError(error)
    );
  }

  private async handleError(error: AxiosError): Promise<any> {
    const config = error.config as AxiosRequestConfig & { _retry?: number };

    // Handle 401 Unauthorized - clear JWT tokens and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
      return Promise.reject(error);
    }

    // Implement retry logic with exponential backoff
    if (!config || !config._retry) {
      config._retry = 0;
    }

    if (config._retry < this.maxRetries) {
      config._retry += 1;
      const delay = this.retryDelay * Math.pow(2, config._retry - 1);

      await new Promise((resolve) => setTimeout(resolve, delay));

      return this.client(config);
    }

    // Format error for consistent handling
    const apiError: APIError = {
      status: error.response?.status || 500,
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
      details: error.response?.data,
      timestamp: new Date().toISOString(),
    };

    return Promise.reject(apiError);
  }

  // Generic request methods
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

// Export singleton instance
export const apiService = new APIService();
export default apiService;
