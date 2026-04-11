import axios from "axios";
import { config } from "@/configs/env";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: config.api.url,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${config.api.url}/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data;
          localStorage.setItem("token", token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// Helper functions for common HTTP methods
export const apiGet = async <T>(url: string, params?: Record<string, any>) => {
  const response = await axiosInstance.get<T>(url, { params });
  return response.data;
};

export const apiPost = async <T>(url: string, data?: any) => {
  const response = await axiosInstance.post<T>(url, data);
  return response.data;
};

export const apiPut = async <T>(url: string, data?: any) => {
  const response = await axiosInstance.put<T>(url, data);
  return response.data;
};

export const apiPatch = async <T>(url: string, data?: any) => {
  const response = await axiosInstance.patch<T>(url, data);
  return response.data;
};

export const apiDelete = async <T>(url: string) => {
  const response = await axiosInstance.delete<T>(url);
  return response.data;
};
