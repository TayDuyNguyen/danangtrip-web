import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { config } from "@/config";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import Cookies from "js-cookie";
import type { ApiResponse } from "@/types";

/**
 * Enhanced Axios instance with cookie-based auth and standardized ApiResponse contract.
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

  Cookies.remove("token", { path: "/" });
  Cookies.remove("refreshToken", { path: "/" });
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  useAuthStore.getState().logout();

  const isEn = window.location.pathname.startsWith("/en");
  window.location.replace(isEn ? "/en/login" : "/login");
};

// Request interceptor
axiosInstance.interceptors.request.use(
  async (axiosConfig: InternalAxiosRequestConfig) => {
    const token = Cookies.get("token");

    if (typeof window !== "undefined") {
      const locale = window.location.pathname.startsWith("/en") ? "en" : "vi";
      axiosConfig.headers["Accept-Language"] = locale;
    }

    if (token) {
      axiosConfig.headers.Authorization = `Bearer ${token}`;
    }

    if (axiosConfig.data instanceof FormData) {
      delete axiosConfig.headers["Content-Type"];
    }

    return axiosConfig;
  },
  (error) => Promise.reject(error)
);

// Response type for refresh token endpoint
interface RefreshTokenData {
  data?: { token?: string };
  token?: string;
}

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data.success === "boolean") {
      return response.data;
    }
    return {
      success: true,
      data: response.data,
      message: (response.data as { message?: string })?.message || "Success",
    };
  },
  async (error: AxiosError<{ error?: string; message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!error.response) {
      toast.error("Kết nối mạng thất bại");
      return Promise.reject({
        success: false,
        error: "Network Error",
        message: "Kết nối mạng thất bại",
      } as ApiResponse);
    }

    const { status, data } = error.response;

    // 401 — Refresh Token logic
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
        const refreshToken = Cookies.get("refreshToken") || localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const response = await axios.post<RefreshTokenData>(`${config.api.url}/auth/refresh`, {
          refreshToken,
        });

        const newToken = response.data?.data?.token || response.data?.token;
        if (!newToken) throw new Error("Refresh failed");

        Cookies.set("token", newToken, { expires: 7, path: "/" });
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

    if (status === 403) {
      toast.warning("Bạn không có quyền thực hiện hành động này");
    }
    if (status >= 500) {
      toast.error("Lỗi hệ thống, vui lòng thử lại sau");
    }

    const errorResponse: ApiResponse = {
      success: false,
      error: data?.error || data?.message || "Unknown Error",
      message: data?.message || "Đã có lỗi xảy ra",
    };

    return Promise.reject(errorResponse);
  }
);

export default axiosInstance;

/**
 * Type-safe API helper methods
 */
export const api = {
  get:    <T>(url: string, params?: object) => axiosInstance.get<T, ApiResponse<T>>(url, { params }),
  post:   <T>(url: string, data?: unknown)  => axiosInstance.post<T, ApiResponse<T>>(url, data),
  put:    <T>(url: string, data?: unknown)  => axiosInstance.put<T, ApiResponse<T>>(url, data),
  patch:  <T>(url: string, data?: unknown)  => axiosInstance.patch<T, ApiResponse<T>>(url, data),
  delete: <T>(url: string)                  => axiosInstance.delete<T, ApiResponse<T>>(url),
};
