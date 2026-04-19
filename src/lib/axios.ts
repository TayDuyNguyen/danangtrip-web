import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { config } from "@/config";
import { useAuthStore } from "@/store/auth.store";
import type { ApiResponse } from "@/types";

/**
 * Enhanced Axios instance with cookie-based auth and standardized ApiResponse contract.
 */
const axiosInstance = axios.create({
  baseURL: config.api.url,
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let isRedirecting = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

const AUTH_BYPASS_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
      return;
    }

    item.resolve(token);
  });

  failedQueue = [];
};

const getAccessToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return Cookies.get("token") || localStorage.getItem("token");
};

const handleLogout = () => {
  if (isRedirecting || typeof window === "undefined") {
    return;
  }

  isRedirecting = true;

  Cookies.remove("token", { path: "/" });
  localStorage.removeItem("token");
  useAuthStore.getState().logout();

  const isEnglishPath = window.location.pathname.startsWith("/en");
  window.location.replace(isEnglishPath ? "/en/login" : "/login");
};

const shouldRefreshToken = (
  status: number,
  originalRequest: (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
) => {
  if (status !== 401 || !originalRequest?.url || originalRequest._retry) {
    return false;
  }

  if (AUTH_BYPASS_PATHS.some((path) => originalRequest.url?.includes(path))) {
    return false;
  }

  return Boolean(getAccessToken());
};

// Request interceptor
axiosInstance.interceptors.request.use(
  async (axiosConfig: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

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

interface RefreshTokenData {
  data?: { token?: string };
  token?: string;
}

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && response.data.code === 200 && response.data.data !== undefined) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Success",
      };
    }

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
      toast.error("Network connection failed");
      return Promise.reject({
        success: false,
        error: "Network Error",
        message: "Network connection failed",
        status: 0,
      } as ApiResponse);
    }

    const { status, data } = error.response;

    if (shouldRefreshToken(status, originalRequest)) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((refreshError) => Promise.reject(refreshError));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post<RefreshTokenData>(
          `${config.api.url}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = response.data?.data?.token || response.data?.token;
        if (!newToken) {
          throw new Error("Refresh failed");
        }

        Cookies.set("token", newToken, { expires: 7, path: "/" });
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        handleLogout();
        return Promise.reject({
          success: false,
          error: "Auth Error",
          message: "Session expired",
          status: 401,
        } as ApiResponse);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 401 && getAccessToken()) {
      handleLogout();
    }

    if (status === 403) {
      toast.warning("You do not have permission to perform this action");
    }

    if (status >= 500) {
      toast.error("System error, please try again later");
    }

    const errorResponse: ApiResponse = {
      success: false,
      error: data?.error || data?.message || "Unknown Error",
      message: data?.message || "An unexpected error occurred",
      status,
    };

    return Promise.reject(errorResponse);
  }
);

export default axiosInstance;

/**
 * Type-safe API helper methods
 */
export const api = {
  get: <T>(url: string, params?: object) => axiosInstance.get<T, ApiResponse<T>>(url, { params }),
  post: <T>(url: string, data?: unknown) => axiosInstance.post<T, ApiResponse<T>>(url, data),
  put: <T>(url: string, data?: unknown) => axiosInstance.put<T, ApiResponse<T>>(url, data),
  patch: <T>(url: string, data?: unknown) => axiosInstance.patch<T, ApiResponse<T>>(url, data),
  delete: <T>(url: string) => axiosInstance.delete<T, ApiResponse<T>>(url),
};
