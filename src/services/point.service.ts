import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  PointOverview,
  PointReward,
  PointTransactionsResponse,
  UserVoucher,
} from "@/types";

export const pointService = {
  overview: (): Promise<ApiResponse<PointOverview>> =>
    axiosInstance.get(API_ENDPOINTS.POINTS.OVERVIEW),

  transactions: (params?: { page?: number; per_page?: number }): Promise<ApiResponse<PointTransactionsResponse>> =>
    axiosInstance.get(API_ENDPOINTS.POINTS.HISTORY, { params }),

  rewards: (): Promise<ApiResponse<PointReward[]>> =>
    axiosInstance.get(API_ENDPOINTS.POINTS.REWARDS),

  vouchers: (): Promise<ApiResponse<UserVoucher[]>> =>
    axiosInstance.get(API_ENDPOINTS.POINTS.VOUCHERS),

  redeem: (rewardId: number | string): Promise<ApiResponse<{ balance: PointOverview["balance"]; voucher: UserVoucher }>> =>
    axiosInstance.post(API_ENDPOINTS.POINTS.REDEEM(rewardId)),
};
