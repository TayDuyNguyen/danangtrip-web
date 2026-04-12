import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { config } from "@/config";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";

/**
 * Enhanced Axios instance ported from DATN_frontend_user
 */
const axiosInstance = axios.create({
  baseURL: config.api.url,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (e: unknown) => void;
}> = [];
let isRedirecting = false;

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

const handleLogout = () => {
  if (isRedirecting || typeof window === "undefined") return;
  isRedirecting = true;
  
  // Clear tokens and reset store
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  useAuthStore.getState().logout();
  
  // Redirect to login (matching the i18n structure in middleware)
  const isEn = window.location.pathname.startsWith("/en");
  window.location.replace(isEn ? "/en/login" : "/login");
};

// Request interceptor
axiosInstance.interceptors.request.use(
  async (axiosConfig: InternalAxiosRequestConfig) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    // Add Language header
    if (typeof window !== "undefined") {
      const locale = window.location.pathname.startsWith("/en") ? "en" : "vi";
      axiosConfig.headers["Accept-Language"] = locale;
    }

    if (token) {
      axiosConfig.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData
    if (axiosConfig.data instanceof FormData) {
      delete axiosConfig.headers["Content-Type"];
    }

    return axiosConfig;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!error.response) {
      toast.error("Kết nối mạng thất bại"); // Will update with i18n later if needed
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Handle 401 - Refresh Token logic
    if (status === 401 && !originalRequest.url?.includes("/login")) {
      if (originalRequest._retry) {
        handleLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const response: any = await axios.post(`${config.api.url}/auth/refresh`, {
          refreshToken,
        });

        const newToken = response.data?.token;
        if (!newToken) throw new Error("Refresh failed");

        localStorage.setItem("token", newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        handleLogout();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // Global Error Toasts
    if (status === 403) {
      toast.warning("Bạn không có quyền thực hiện hành động này");
    }
    if (status >= 500) {
      toast.error("Lỗi hệ thống, vui lòng thử lại sau");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

/**
 * Type-safe API helper methods
 */
export const api = {
  get: <T>(url: string, params?: object) => axiosInstance.get<any, T>(url, { params }),
  post: <T>(url: string, data?: any) => axiosInstance.post<any, T>(url, data),
  put: <T>(url: string, data?: any) => axiosInstance.put<any, T>(url, data),
  patch: <T>(url: string, data?: any) => axiosInstance.patch<any, T>(url, data),
  delete: <T>(url: string) => axiosInstance.delete<any, T>(url),
};
