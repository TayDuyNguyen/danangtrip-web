import { config } from "@/configs/env";
import type { ApiResponse, ApiRequestConfig } from "@/types/api";

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.api.url;
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async request<T>(endpoint: string, config: ApiRequestConfig): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, config.params);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...config.headers,
    };

    try {
      const response = await fetch(url, {
        method: config.method || "GET",
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "An error occurred",
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      };
    }
  }

  async get<T>(endpoint: string, config?: Omit<ApiRequestConfig, "method" | "body">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  async post<T>(endpoint: string, body?: unknown, config?: Omit<ApiRequestConfig, "method">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "POST", body });
  }

  async put<T>(endpoint: string, body?: unknown, config?: Omit<ApiRequestConfig, "method">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "PUT", body });
  }

  async patch<T>(endpoint: string, body?: unknown, config?: Omit<ApiRequestConfig, "method">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "PATCH", body });
  }

  async delete<T>(endpoint: string, config?: Omit<ApiRequestConfig, "method" | "body">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }
}

export const api = new ApiService();
