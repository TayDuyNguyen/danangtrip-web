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
    return <PaymentLoadingState />;
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
    <div className="design-container mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center py-12 md:py-20">
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

function PaymentLoadingState() {
  return (
    <div className="design-container mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center py-12 md:py-20">
      <div className="mx-auto w-full max-w-2xl rounded-[32px] border border-border bg-white px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:px-10 md:py-12">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-primary/15 bg-primary/5">
            <Loading className="h-12 w-12" color="#FF385C" height={48} width={48} />
          </div>
          <div className="h-8 w-52 rounded-full bg-[#f3f3f3]" />
          <div className="mt-4 h-4 w-full max-w-md rounded-full bg-[#f5f5f5]" />
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-md rounded-[28px] border border-border bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="mb-4 h-6 w-40 rounded-full bg-[#f3f3f3]" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded-full bg-[#f5f5f5]" />
            <div className="h-4 w-32 rounded-full bg-[#f3f3f3]" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 rounded-full bg-[#f5f5f5]" />
            <div className="h-4 w-20 rounded-full bg-[#f3f3f3]" />
          </div>
          <div className="mt-4 border-t border-border border-dashed pt-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-28 rounded-full bg-[#f5f5f5]" />
              <div className="h-6 w-36 rounded-full bg-[#f3f3f3]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
