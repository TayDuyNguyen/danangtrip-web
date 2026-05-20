import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { Tour, TourCategory, ApiResponse, TourSchedule, TourAvailability, RatingStats, PaginatedResponse, LandingPage } from "@/types";
import type { LocationRatingListItem } from "@/types/location-rating.types";
import type { TourFilterParams } from "@/features/tour/types";

export const tourService = {
  getFeatured: (limit: number = 8): Promise<ApiResponse<Tour[]>> =>
    axiosInstance.get(API_ENDPOINTS.TOURS.FEATURED, { params: { limit } }),

  getHot: (limit: number = 8): Promise<ApiResponse<Tour[]>> =>
    axiosInstance.get(API_ENDPOINTS.TOURS.HOT, { params: { limit } }),

  getCategories: (): Promise<ApiResponse<TourCategory[]>> =>
    axiosInstance.get(API_ENDPOINTS.TOURS.CATEGORIES),

  getAll: (params?: TourFilterParams): Promise<ApiResponse<PaginatedResponse<Tour>>> =>
    axiosInstance.get(API_ENDPOINTS.TOURS.LIST, { params }),

  getDetail: (slug: string): Promise<ApiResponse<Tour>> =>
    axiosInstance.get(API_ENDPOINTS.TOURS.DETAIL(slug)),

  getSchedules: (id: number | string, params?: { from_date?: string; to_date?: string }): Promise<ApiResponse<TourSchedule[]>> =>
    axiosInstance.get(API_ENDPOINTS.TOURS.SCHEDULES(id), { params }),

  checkAvailability: (id: number | string, payload: { schedule_id: number; quantity_adult: number; quantity_child?: number; quantity_infant?: number }): Promise<ApiResponse<TourAvailability>> =>
    axiosInstance.post(API_ENDPOINTS.TOURS.CHECK_AVAILABILITY(id), payload),

  getRatings: (id: number | string, params?: { page?: number; per_page?: number }): Promise<ApiResponse<PaginatedResponse<LocationRatingListItem>>> =>
    axiosInstance.get(API_ENDPOINTS.TOURS.RATINGS(id), { params }),

  getRatingStats: (id: number | string): Promise<ApiResponse<RatingStats>> =>
    axiosInstance.get(API_ENDPOINTS.TOURS.RATING_STATS(id)),

  getLandingPage: (slug: string): Promise<ApiResponse<LandingPage>> =>
    axiosInstance.get(API_ENDPOINTS.LANDING_PAGES.DETAIL(slug)),
};
