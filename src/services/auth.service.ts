import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import { 
  LoginRequest, 
  LoginResponse, 
  RefreshTokenResponse, 
  RegisterRequest, 
  RegisterResponse,
  ApiResponse,
  User
} from "@/types";

export const authService = {
  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
    axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, data),

  register: (data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> =>
    axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, data),

  logout: (): Promise<ApiResponse<unknown>> =>
    axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT),

  refreshToken: (): Promise<ApiResponse<RefreshTokenResponse>> =>
    axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {}),
    
  getMe: (): Promise<ApiResponse<User>> =>
    axiosInstance.get(API_ENDPOINTS.AUTH.ME),
};

