import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  ChangePasswordInput,
  LocationRatingListItem,
  PaginatedResponse,
  UpdateProfileInput,
  User,
} from "@/types";

export const profileService = {
  show: (): Promise<ApiResponse<User>> =>
    axiosInstance.get(API_ENDPOINTS.USER.PROFILE),

  update: (data: UpdateProfileInput): Promise<ApiResponse<User>> =>
    axiosInstance.put(API_ENDPOINTS.USER.UPDATE_PROFILE, data),

  updateAvatar: (avatar: File): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append("avatar", avatar);
    return axiosInstance.post(API_ENDPOINTS.USER.AVATAR, formData);
  },

  changePassword: (data: ChangePasswordInput): Promise<ApiResponse<unknown>> =>
    axiosInstance.put(API_ENDPOINTS.USER.CHANGE_PASSWORD, data),

  ratings: (params?: { page?: number; per_page?: number }): Promise<ApiResponse<PaginatedResponse<LocationRatingListItem>>> =>
    axiosInstance.get(API_ENDPOINTS.USER.RATINGS, { params }),
};
