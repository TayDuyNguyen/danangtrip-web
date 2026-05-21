import { api } from "@/lib/axios";
import { API_ENDPOINTS } from "@/config";
import type { ApiResponse } from "@/types";

export const favoriteService = {
  addFavorite: async (params: { location_id?: number; tour_id?: number }): Promise<ApiResponse<unknown>> => {
    const response = await api.post(API_ENDPOINTS.USER.FAVORITES, params);
    return response;
  },

  removeFavorite: async (params: { location_id?: number; tour_id?: number }): Promise<ApiResponse<unknown>> => {
    const response = await api.delete(API_ENDPOINTS.USER.FAVORITES, { data: params });
    return response;
  },

  checkFavorite: async (params: { location_id?: number; tour_id?: number }): Promise<ApiResponse<{ is_favorite: boolean }>> => {
    return api.get(API_ENDPOINTS.USER.FAVORITES_CHECK, params);
  },
};
