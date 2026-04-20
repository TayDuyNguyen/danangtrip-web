import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { Location, ApiResponse } from "@/types";

export const locationService = {
  getFeatured: (limit: number = 8): Promise<ApiResponse<Location[]>> =>
    axiosInstance.get(API_ENDPOINTS.LOCATIONS.FEATURED, { params: { limit } }),

  getAll: (params?: {
    q?: string;
    category_id?: number;
    sort?: string;
    order?: "asc" | "desc";
    per_page?: number;
  }): Promise<ApiResponse<Location[]>> =>
    axiosInstance.get(API_ENDPOINTS.LOCATIONS.LIST, { params }),

  getByCategory: (categorySlug: string): Promise<ApiResponse<Location[]>> =>
    axiosInstance.get(`/categories/${categorySlug}/locations`),

  getDetail: (slug: string): Promise<ApiResponse<Location>> =>
    axiosInstance.get(API_ENDPOINTS.LOCATIONS.DETAIL(slug)),
};
