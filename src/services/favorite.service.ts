import { api } from "@/lib/axios";
import { API_ENDPOINTS } from "@/config";
import type { ApiResponse } from "@/types";

export const favoriteService = {
  addFavorite: async (locationId: number): Promise<ApiResponse<unknown>> => {
    const response = await api.post(API_ENDPOINTS.USER.FAVORITES, {
      location_id: locationId
    });
    return response;
  },

  removeFavorite: async (locationId: number): Promise<ApiResponse<unknown>> => {
    const response = await api.delete(`${API_ENDPOINTS.USER.FAVORITES}/${locationId}`);
    return response;
  },

  checkFavorite: async (locationId: number): Promise<ApiResponse<{ is_favorite: boolean }>> => {
    return api.get(API_ENDPOINTS.USER.FAVORITES_CHECK(locationId));
  },
};
