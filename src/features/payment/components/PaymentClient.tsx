"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { PaymentStatusCard } from "./PaymentStatusCard";
import { PaymentSummaryCard } from "./PaymentSummaryCard";
import { PaymentRetryPanel } from "./PaymentRetryPanel";
import { PaymentActions } from "./PaymentActions";
import { Loading } from "@/components/ui";
import { usePayment, usePaymentStatus, useBookingForPayment } from "../hooks/usePayment";

export function PaymentClient() {
  const t = useTranslations("tour.payment");
  const searchParams = useSearchParams();

  const transactionCode = searchParams.get("transaction_code");
  const bookingCode = searchParams.get("booking_code");
  const isMissingContext = !transactionCode && !bookingCode;

  const { data: paymentData, isLoading: isPaymentLoading } = usePaymentStatus(transactionCode);
  const { data: bookingData, isLoading: isBookingLoading } = useBookingForPayment(bookingCode);
  const { retryPayment, isRetrying } = usePayment();

  if (isPaymentLoading || isBookingLoading) {
    return <Loading />;
  }

  if (isMissingContext) {
    return (
      <div className="design-container max-w-4xl mx-auto py-12 md:py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <PaymentStatusCard status="failed" message={t("errors.missing_context")} />
        <PaymentActions status="failed" isMissingContext />
      </div>
    );
  }

  let status: "pending" | "success" | "failed" | "redirecting" = "pending";
  if (paymentData) {
    if (paymentData.payment_status === "success") status = "success";
    else if (paymentData.payment_status === "failed" || paymentData.payment_status === "refunded") status = "failed";
    else status = "pending";
  } else if (bookingData) {
    if (bookingData.payment_status === "success") status = "success";
    else if (bookingData.payment_status === "failed") status = "failed";
  }

  if (isRetrying) {
    status = "redirecting";
  }

  const statusMessage =
    status === "success" && !bookingData
      ? t("success_without_booking")
      : status === "failed" && !bookingData && !paymentData
        ? t("errors.payment_not_found")
        : undefined;

  return (
    <div className="design-container max-w-4xl mx-auto py-12 md:py-20 flex flex-col items-center justify-center min-h-[60vh]">
      <PaymentStatusCard status={status} message={statusMessage} />

      {status !== "redirecting" && bookingData && (
        <PaymentSummaryCard booking={bookingData} />
      )}

      {status !== "redirecting" && (status === "failed" || status === "pending") && bookingData && (
        <PaymentRetryPanel
          bookedAt={bookingData.booked_at}
          onRetry={() => retryPayment(bookingData.booking_code)}
          isRetrying={isRetrying}
        />
      )}

      {status !== "redirecting" && (
        <PaymentActions status={status} booking={bookingData} />
      )}
    </div>
  );
}
