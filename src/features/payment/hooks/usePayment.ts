import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { paymentService } from "@/services/payment.service";
import { bookingService } from "@/services/booking.service";
import type { CreatePaymentPayload, Payment, RetryPaymentPayload } from "@/types";
import { toast } from "sonner";

const PAYMENT_SESSION_MINUTES = 15;

export const isPaymentSessionExpired = (
  payment?: Pick<Payment, "created_at" | "expires_at"> | null,
  nowMs = Date.now(),
) => {
  if (!payment) return false;

  const expiresAt = payment.expires_at
    ? new Date(payment.expires_at).getTime()
    : payment.created_at
      ? new Date(payment.created_at).getTime() + PAYMENT_SESSION_MINUTES * 60 * 1000
      : NaN;

  return Number.isFinite(expiresAt) && nowMs >= expiresAt;
};

export const usePayment = () => {
  const locale = useLocale();
  const t = useTranslations("tour.payment");
  const localePrefix = locale === "vi" ? "" : `/${locale}`;
  const getReturnUrl = () => {
    if (typeof window === "undefined") {
      return undefined;
    }

    return `${window.location.origin}${localePrefix}/payment/result`;
  };

  const createPaymentMutation = useMutation({
    mutationFn: (data: CreatePaymentPayload) =>
      paymentService.create({
        ...data,
        return_url: data.return_url ?? getReturnUrl(),
      }),
    onSuccess: (res) => {
      if (res.data?.payment_url) {
        window.location.href = res.data.payment_url;
      } else {
        toast.error(t("errors.payment_link"));
      }
    },
    onError: () => {
      toast.error(t("errors.create_failed"));
    },
  });

  const retryPaymentMutation = useMutation({
    mutationFn: (payload: string | { bookingCode: string; payment_method?: RetryPaymentPayload["payment_method"] }) => {
      const bookingCode = typeof payload === "string" ? payload : payload.bookingCode;
      const paymentMethod = typeof payload === "string" ? undefined : payload.payment_method;

      return paymentService.retry(bookingCode, {
        return_url: getReturnUrl(),
        payment_method: paymentMethod,
      });
    },
    onSuccess: (res) => {
      if (res.data?.payment_url) {
        window.location.href = res.data.payment_url;
      } else {
        toast.error(t("errors.payment_link"));
      }
    },
    onError: () => {
      toast.error(t("errors.retry_failed"));
    },
  });

  return {
    createPayment: createPaymentMutation.mutate,
    isCreating: createPaymentMutation.isPending,
    retryPayment: retryPaymentMutation.mutate,
    isRetrying: retryPaymentMutation.isPending,
  };
};

export const usePaymentStatus = (transactionCode?: string | null) => {
  return useQuery({
    queryKey: ["payment", "status", transactionCode],
    queryFn: async () => {
      if (!transactionCode) return null;
      const res = await paymentService.status(transactionCode);
      return res.data;
    },
    enabled: !!transactionCode,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (
        (data?.payment_status === "pending" || data?.payment_status === "partially_paid") &&
        !isPaymentSessionExpired(data)
      ) {
        return 1000;
      }
      return false;
    },
    refetchIntervalInBackground: true,
  });
};

export const useBookingForPayment = (bookingCode?: string | null, shouldPoll = true) => {
  return useQuery({
    queryKey: ["bookings", "detail", bookingCode],
    queryFn: async () => {
      if (!bookingCode) return null;
      const res = await bookingService.detailByCode(bookingCode);
      return res.data;
    },
    enabled: !!bookingCode,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (
        shouldPoll &&
        (
          data?.payment_status === "pending" ||
          data?.payment_status === "unpaid" ||
          data?.payment_status === "partially_paid"
        )
      ) {
        return 1000;
      }

      return false;
    },
    refetchIntervalInBackground: true,
  });
};
