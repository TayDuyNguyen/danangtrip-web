import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  Booking,
  BookingCalculation,
  BookingListParams,
  BookingListResponse,
  BookingQuantityPayload,
  CancelBookingPayload,
  RefundPreview,
  CreateBookingPayload,
} from "@/types";

export const bookingService = {
  calculate: (data: BookingQuantityPayload): Promise<ApiResponse<BookingCalculation>> =>
    axiosInstance.post(API_ENDPOINTS.BOOKINGS.USER_CALCULATE, data),

  calculatePublic: (data: BookingQuantityPayload): Promise<ApiResponse<BookingCalculation>> =>
    axiosInstance.post(API_ENDPOINTS.BOOKINGS.CALCULATE, data),

  create: (data: CreateBookingPayload): Promise<ApiResponse<Booking>> =>
    axiosInstance.post(API_ENDPOINTS.BOOKINGS.STORE, data),

  list: (params?: BookingListParams): Promise<ApiResponse<BookingListResponse>> =>
    axiosInstance.get(API_ENDPOINTS.BOOKINGS.USER_LIST, { params }),

  detail: (id: number | string): Promise<ApiResponse<Booking>> =>
    axiosInstance.get(API_ENDPOINTS.BOOKINGS.DETAIL(id)),

  detailByCode: (bookingCode: string): Promise<ApiResponse<Booking>> =>
    axiosInstance.get(API_ENDPOINTS.BOOKINGS.DETAIL_BY_CODE(bookingCode)),

  invoice: (id: number | string): Promise<ApiResponse<Blob>> =>
    axiosInstance.get(API_ENDPOINTS.BOOKINGS.INVOICE(id), { responseType: "blob" }),

  refundPreview: (id: number | string): Promise<ApiResponse<RefundPreview>> =>
    axiosInstance.get(API_ENDPOINTS.BOOKINGS.REFUND_PREVIEW(id)),

  cancel: (id: number | string, data: CancelBookingPayload): Promise<ApiResponse<Booking>> =>
    axiosInstance.post(API_ENDPOINTS.BOOKINGS.CANCEL(id), data),
};
