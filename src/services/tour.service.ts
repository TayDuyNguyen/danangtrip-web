import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { Tour, TourCategory, ApiResponse } from "@/types";

export const tourService = {
  getFeatured: (limit: number = 8): Promise<ApiResponse<Tour[]>> =>
    axiosInstance.get(API_ENDPOINTS.TOURS.FEATURED, { params: { limit } }),

  getHot: (limit: number = 8): Promise<ApiResponse<Tour[]>> =>
    axiosInstance.get(API_ENDPOINTS.TOURS.HOT, { params: { limit } }),

  getCategories: (): Promise<ApiResponse<TourCategory[]>> =>
    axiosInstance.get(API_ENDPOINTS.TOURS.CATEGORIES),

  getDetail: (slug: string): Promise<ApiResponse<Tour>> =>
    axiosInstance.get(API_ENDPOINTS.TOURS.DETAIL(slug)),
};
