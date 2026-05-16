import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { ApiResponse, CreatePaymentPayload, Payment, PaymentCreateResult } from "@/types";

export const paymentService = {
  create: (data: CreatePaymentPayload): Promise<ApiResponse<PaymentCreateResult>> =>
    axiosInstance.post(API_ENDPOINTS.PAYMENTS.CREATE, data),

  status: (transactionCode: string): Promise<ApiResponse<Payment>> =>
    axiosInstance.get(API_ENDPOINTS.PAYMENTS.STATUS(transactionCode)),

  retry: (bookingCode: string): Promise<ApiResponse<PaymentCreateResult>> =>
    axiosInstance.post(API_ENDPOINTS.PAYMENTS.RETRY(bookingCode)),
};
