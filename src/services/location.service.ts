import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { Location, ApiResponse, PaginatedResponse, Category } from "@/types";
import { BackendLocationQueryParams } from "@/features/locations/utils/location-query-mapper";
import type { LocationRatingListItem } from "@/features/locations/types/rating.types";

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

  getImages: (id: number): Promise<ApiResponse<{ images: string[] }>> =>
    axiosInstance.get(API_ENDPOINTS.LOCATIONS.IMAGES(id)),

  getRatings: (
    id: number,
    params?: { page?: number; per_page?: number; sort_by?: "created_at" | "rating" }
  ): Promise<ApiResponse<PaginatedResponse<LocationRatingListItem>>> =>
    axiosInstance.get(API_ENDPOINTS.LOCATIONS.RATINGS(id), { params }),

  getRatingStats: (id: number): Promise<ApiResponse<Record<string, number>>> =>
    axiosInstance.get(API_ENDPOINTS.LOCATIONS.RATING_STATS(id)),

  getNearbyByLocationId: (id: number, limit = 6): Promise<ApiResponse<Location[]>> =>
    axiosInstance.get(API_ENDPOINTS.LOCATIONS.NEARBY_BY_ID(id), { params: { limit } }),

  recordView: (id: number, sessionId?: string): Promise<ApiResponse<null>> =>
    axiosInstance.post(
      API_ENDPOINTS.LOCATIONS.RECORD_VIEW(id),
      {},
      sessionId ? { headers: { "X-Session-Id": sessionId } } : undefined
    ),
};
