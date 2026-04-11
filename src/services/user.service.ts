import { api } from "./api";
import type { User, UpdateUserInput } from "@/types/user.type";
import type { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";

export const userService = {
  getUsers: (params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<User>>> => {
    return api.get<PaginatedResponse<User>>("/users", { params });
  },

  getUserById: (id: string): Promise<ApiResponse<User>> => {
    return api.get<User>(`/users/${id}`);
  },

  updateUser: (id: string, data: UpdateUserInput): Promise<ApiResponse<User>> => {
    return api.patch<User>(`/users/${id}`, data);
  },

  deleteUser: (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/users/${id}`);
  },

  uploadAvatar: (id: string, file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append("avatar", file);
    
    return api.post<{ url: string }>(`/users/${id}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  changePassword: (id: string, oldPassword: string, newPassword: string): Promise<ApiResponse<void>> => {
    return api.post<void>(`/users/${id}/change-password`, {
      oldPassword,
      newPassword,
    });
  },
};
