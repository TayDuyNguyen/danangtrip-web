import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { Weather, ApiResponse } from "@/types";

export const weatherService = {
  getWeather: (): Promise<ApiResponse<Weather>> =>
    axiosInstance.get(API_ENDPOINTS.WEATHER),
};
