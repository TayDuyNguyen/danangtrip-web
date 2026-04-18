import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config";
import type { User, UpdateUserInput } from "@/types/user.types";
import type { PaginatedResponse, PaginationParams, ApiResponse } from "@/types";

export const userService = {
  getUsers: (params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<User>>> => {
    return axiosInstance.get("/users", { params });
  },

  getUserById: (id: string): Promise<ApiResponse<User>> => {
    return axiosInstance.get(`/users/${id}`);
  },

  updateUser: (id: string, data: UpdateUserInput): Promise<ApiResponse<User>> => {
    return axiosInstance.patch(`/users/${id}`, data);
  },

  deleteUser: (id: string): Promise<ApiResponse<void>> => {
    return axiosInstance.delete(`/users/${id}`);
  },

  uploadAvatar: (id: string, file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append("avatar", file);
    
    return axiosInstance.post(`/users/${id}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  changePassword: (oldPassword: string, newPassword: string): Promise<ApiResponse<void>> => {
    return axiosInstance.post(API_ENDPOINTS.USER.CHANGE_PASSWORD, {
      oldPassword,
      newPassword,
    });
  },
};
