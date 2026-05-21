import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";
import { paymentService } from "@/services/payment.service";
import type {
  BookingQuantityPayload,
  CreateBookingPayload,
  CreatePaymentPayload,
  Booking,
  BookingListParams,
  CancelBookingPayload,
} from "@/types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import axios from "axios";

export function useBookingCalculate() {
  return useMutation({
    mutationFn: (payload: BookingQuantityPayload) => 
      bookingService.calculate(payload).then((res) => res.data),
  });
}

export function useCreateBooking() {
  const t = useTranslations("tour");
  
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => 
      bookingService.create(payload).then((res) => res.data as Booking),
    onError: (error: unknown) => {
      let message = t("detail.error_desc");
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    }
  });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: (payload: CreatePaymentPayload) => 
      paymentService.create(payload).then((res) => res.data),
  });
}

export function useUserBookings(params: BookingListParams) {
  return useQuery({
    queryKey: ["bookings", "user-list", params],
    queryFn: () => bookingService.list(params).then((res) => res.data),
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000, // 30 seconds stale time
  });
}

export function useBookingDetail(id: number | string) {
  return useQuery({
    queryKey: ["bookings", "detail", id],
    queryFn: () => bookingService.detail(id).then((res) => res.data),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

export function useBookingDetailByCode(bookingCode: string) {
  return useQuery({
    queryKey: ["bookings", "detail-by-code", bookingCode],
    queryFn: () => bookingService.detailByCode(bookingCode).then((res) => res.data),
    enabled: Boolean(bookingCode),
    staleTime: 60 * 1000,
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: CancelBookingPayload }) => 
      bookingService.cancel(id, payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

