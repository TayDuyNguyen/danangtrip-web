import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import { 
  LoginRequest, 
  LoginResponse, 
  RefreshTokenResponse, 
  RegisterRequest, 
  RegisterResponse 
} from "@/types";

export const authService = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, data),

  register: (data: RegisterRequest): Promise<RegisterResponse> =>
    axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, data),

  logout: (): Promise<any> =>
    axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT),

  refreshToken: (refreshToken: string): Promise<RefreshTokenResponse> =>
    axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken }),
    
  getMe: (): Promise<any> =>
    axiosInstance.get(API_ENDPOINTS.AUTH.ME),
};
