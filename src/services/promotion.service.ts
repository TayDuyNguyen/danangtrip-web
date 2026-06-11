import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/types";

export interface PromotionItem {
  id: number;
  code: string;
  name: string;
  description: string | null;
  discount_type: "percent" | "fixed";
  discount_value: string | number;
  min_order_amount?: string | number | null;
  max_discount_amount?: string | number | null;
  starts_at: string | null;
  ends_at: string | null;
  status: string;
}

export interface PromotionValidationResult {
  promotion: PromotionItem;
  discount_amount: number;
  final_amount: number;
}

export const promotionService = {
  list: (): Promise<ApiResponse<PromotionItem[]>> =>
    axiosInstance.get(API_ENDPOINTS.PROMOTIONS.LIST),

  validate: (code: string, orderTotal: number): Promise<ApiResponse<PromotionValidationResult>> =>
    axiosInstance.post(API_ENDPOINTS.PROMOTIONS.VALIDATE, { code, order_total: orderTotal }),
};
