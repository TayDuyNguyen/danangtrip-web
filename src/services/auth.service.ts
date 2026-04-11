import { api } from "./api";
import type { User } from "@/types/user.type";
import type { ApiResponse } from "@/types/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    return api.post<AuthResponse>("/auth/login", credentials);
  },

  register: (credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> => {
    return api.post<AuthResponse>("/auth/register", credentials);
  },

  logout: (): Promise<ApiResponse<void>> => {
    return api.post<void>("/auth/logout");
  },

  getCurrentUser: (): Promise<ApiResponse<User>> => {
    return api.get<User>("/auth/me");
  },

  refreshToken: (): Promise<ApiResponse<{ token: string }>> => {
    return api.post<{ token: string }>("/auth/refresh");
  },

  forgotPassword: (email: string): Promise<ApiResponse<void>> => {
    return api.post<void>("/auth/forgot-password", { email });
  },

  resetPassword: (token: string, password: string): Promise<ApiResponse<void>> => {
    return api.post<void>("/auth/reset-password", { token, password });
  },
};
