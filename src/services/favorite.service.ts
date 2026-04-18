import { api } from "@/lib/axios";
import { API_ENDPOINTS } from "@/config";

export const favoriteService = {
  addFavorite: async (locationId: number) => {
    const response = await api.post(API_ENDPOINTS.USER.FAVORITES, {
      location_id: locationId
    });
    return response;
  },

  removeFavorite: async (locationId: number) => {
    const response = await api.delete(`${API_ENDPOINTS.USER.FAVORITES}/${locationId}`);
    return response;
  }
};
