import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { Statistics, ApiResponse } from "@/types";

export const statisticsService = {
  getStatistics: (): Promise<ApiResponse<Statistics>> =>
    axiosInstance.get(API_ENDPOINTS.STATISTICS),
};
