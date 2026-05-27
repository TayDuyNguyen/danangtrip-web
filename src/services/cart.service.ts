import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  CartItem,
  AddToCartPayload,
  UpdateCartPayload,
  MergeCartPayload,
} from "@/types";

export const cartService = {
  get: (): Promise<ApiResponse<CartItem[]>> =>
    axiosInstance.get(API_ENDPOINTS.CART.GET),

  store: (data: AddToCartPayload): Promise<ApiResponse<CartItem>> =>
    axiosInstance.post(API_ENDPOINTS.CART.STORE, data),

  update: (id: number | string, data: UpdateCartPayload): Promise<ApiResponse<CartItem>> =>
    axiosInstance.put(API_ENDPOINTS.CART.UPDATE(id), data),

  delete: (id: number | string): Promise<ApiResponse<void>> =>
    axiosInstance.delete(API_ENDPOINTS.CART.DELETE(id)),

  clear: (): Promise<ApiResponse<void>> =>
    axiosInstance.delete(API_ENDPOINTS.CART.CLEAR),

  merge: (data: MergeCartPayload): Promise<ApiResponse<CartItem[]>> =>
    axiosInstance.post(API_ENDPOINTS.CART.MERGE, data),
};
