import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { LocationRatingCheckData } from "@/types/location-rating.types";
import type { ApiResponse } from "@/types";

export type { LocationRatingListItem, LocationRatingCheckData } from "@/types/location-rating.types";

export const ratingService = {
  checkLocation: (locationId: number): Promise<ApiResponse<LocationRatingCheckData>> =>
    axiosInstance.get(API_ENDPOINTS.RATINGS.CHECK, { params: { location_id: locationId } }),

  markHelpful: (ratingId: number): Promise<ApiResponse<unknown>> =>
    axiosInstance.post(API_ENDPOINTS.RATINGS.HELPFUL(ratingId)),

  createForLocation: (payload: {
    locationId: number;
    score: number;
    comment?: string;
    files: File[];
  }): Promise<ApiResponse<unknown>> => {
    const fd = new FormData();
    fd.append("location_id", String(payload.locationId));
    fd.append("score", String(payload.score));
    if (payload.comment?.trim()) {
      fd.append("comment", payload.comment.trim());
    }
    payload.files.slice(0, 5).forEach((file) => {
      fd.append("images[]", file);
    });
    return axiosInstance.post(API_ENDPOINTS.RATINGS.STORE, fd);
  },
};
