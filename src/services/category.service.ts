import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { Category, ApiResponse } from "@/types";

export const categoryService = {
  getAll: (): Promise<ApiResponse<Category[]>> =>
    axiosInstance.get(API_ENDPOINTS.LOCATIONS.CATEGORIES),
};
