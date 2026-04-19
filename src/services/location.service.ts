import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { Location, ApiResponse } from "@/types";

export const locationService = {
  getFeatured: (limit: number = 8): Promise<ApiResponse<Location[]>> =>
    axiosInstance.get(API_ENDPOINTS.LOCATIONS.FEATURED, { params: { limit } }),

  getByCategory: (categorySlug: string): Promise<ApiResponse<Location[]>> =>
    axiosInstance.get(`/categories/${categorySlug}/locations`),

  getDetail: (slug: string): Promise<ApiResponse<Location>> =>
    axiosInstance.get(API_ENDPOINTS.LOCATIONS.DETAIL(slug)),
};
