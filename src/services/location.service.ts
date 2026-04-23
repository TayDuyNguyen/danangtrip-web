import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { Location, ApiResponse, PaginatedResponse, Category } from "@/types";
import { BackendLocationQueryParams } from "@/features/locations/utils/location-query-mapper";

export const locationService = {
  getFeatured: (limit: number = 8): Promise<ApiResponse<Location[]>> =>
    axiosInstance.get(API_ENDPOINTS.LOCATIONS.FEATURED, { params: { limit } }),

  getAll: (params?: BackendLocationQueryParams): Promise<ApiResponse<PaginatedResponse<Location>>> =>
    axiosInstance.get(API_ENDPOINTS.LOCATIONS.LIST, { params }),

  getByCategory: (categorySlug: string): Promise<ApiResponse<Location[]>> =>
    axiosInstance.get(`/categories/${categorySlug}/locations`),

  getDetail: (slug: string): Promise<ApiResponse<Location>> =>
    axiosInstance.get(API_ENDPOINTS.LOCATIONS.DETAIL(slug)),

  getCategories: (): Promise<ApiResponse<Category[]>> =>
    axiosInstance.get(API_ENDPOINTS.LOCATIONS.CATEGORIES),
};
