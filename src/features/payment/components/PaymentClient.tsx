"use client";
 
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { PaymentStatusCard } from "./PaymentStatusCard";
import { PaymentSummaryCard } from "./PaymentSummaryCard";
import { PaymentRetryPanel } from "./PaymentRetryPanel";
import { PaymentActions } from "./PaymentActions";
import { SepayQrCard } from "./SepayQrCard";
import { Loading } from "@/components/ui";
import { BookingProgressSteps } from "@/features/tour/components/BookingProgressSteps";
import { isPaymentSessionExpired, usePayment, usePaymentStatus, useBookingForPayment } from "../hooks/usePayment";
 
export function PaymentClient() {
  const t = useTranslations("tour.payment");
  const searchParams = useSearchParams();
  const router = useRouter();
 
  const transactionCode = searchParams.get("transaction_code");
  const bookingCode = searchParams.get("booking_code");
  const isMissingContext = !transactionCode && !bookingCode;
 
  const { data: paymentData, isLoading: isPaymentLoading } = usePaymentStatus(transactionCode);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const isSessionExpired = paymentData ? isPaymentSessionExpired(paymentData, nowMs) : false;
  const shouldPollBooking = !paymentData || !isSessionExpired;
  const { data: bookingData, isLoading: isBookingLoading } = useBookingForPayment(bookingCode, shouldPollBooking);
  const { retryPayment, isRetrying } = usePayment();

  useEffect(() => {
    if (
      !paymentData ||
      paymentData.payment_status === "success" ||
      paymentData.payment_status === "failed" ||
      paymentData.payment_status === "refunded" ||
      isSessionExpired
    ) {
      return;
    }

    const interval = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [paymentData, isSessionExpired]);

  // Redirect to correct URL format if transactionCode is missing but booking has a pending payment
  useEffect(() => {
    if (bookingData && !transactionCode && bookingData.latest_pending_payment?.transaction_code) {
      router.replace(`/payment/result?transaction_code=${bookingData.latest_pending_payment.transaction_code}&booking_code=${bookingData.booking_code}`);
    }
  }, [bookingData, transactionCode, router]);

  // Create payment record automatically if there is no payment record for a pending booking
  useEffect(() => {
    if (
      bookingData &&
      !isBookingLoading &&
      !transactionCode &&
      !bookingData.latest_pending_payment &&
      ["pending", "unpaid", "partially_paid"].includes(bookingData.payment_status) &&
      bookingData.booking_status !== "cancelled" &&
      !isRetrying
    ) {
      retryPayment(bookingData.booking_code);
    }
  }, [bookingData, isBookingLoading, transactionCode, retryPayment, isRetrying]);

  // Determine status
  let status: "pending" | "success" | "failed" | "redirecting" | "expired" = "pending";
  if (paymentData) {
    if (paymentData.payment_status === "success") status = "success";
    else if (paymentData.payment_status === "failed" || paymentData.payment_status === "refunded") status = "failed";
    else status = isSessionExpired ? "expired" : "pending";
  } else if (bookingData) {
    if (bookingData.payment_status === "success") status = "success";
    else if (bookingData.payment_status === "failed") status = "failed";
  }

  if (isRetrying) {
    status = "redirecting";
  }

  // Auto redirect on success removed to allow user to see Step 3 (Confirmation) and manually click 'Xem chi tiết' button.
 
  if (isPaymentLoading || isBookingLoading) {
    return <PaymentLoadingState />;
  }
 
  if (isMissingContext) {
    return (
      <div className="w-full">
        <div className="border-b border-border/30 bg-white">
          <BookingProgressSteps currentStep={2} />
        </div>
        <div className="design-container max-w-4xl mx-auto py-12 md:py-20 flex flex-col items-center justify-center min-h-[60vh]">
          <PaymentStatusCard status="failed" message={t("errors.missing_context")} />
          <PaymentActions status="failed" isMissingContext />
        </div>
      </div>
    );
  }
 
  const statusMessage =
    status === "success" && !bookingData
      ? t("success_without_booking")
      : status === "expired"
        ? t("expired_message")
      : status === "failed" && !bookingData && !paymentData
        ? t("errors.payment_not_found")
        : undefined;

  const currentStep = status === "success" ? 3 : 2;

  return (
    <div className="w-full">
      <div className="border-b border-border/30 bg-white">
        <BookingProgressSteps currentStep={currentStep} />
      </div>
      <div className="design-container mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center py-12 md:py-20">
        <PaymentStatusCard status={status} message={statusMessage} />

        {status !== "redirecting" && bookingData && (
          <PaymentSummaryCard booking={bookingData} />
        )}

        {status === "pending" && paymentData?.sepay_checkout && !isSessionExpired && (
          <SepayQrCard checkout={paymentData.sepay_checkout} />
        )}

        {status === "pending" && Number(paymentData?.short_amount || 0) > 0 && (
          <div className="mt-6 w-full max-w-md rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 text-sm text-orange-900">
            <p className="font-bold">{t("partial_payment_title")}</p>
            <div className="mt-2 flex justify-between">
              <span>{t("partial_received")}</span>
              <strong>{Number(paymentData?.received_amount || 0).toLocaleString("vi-VN")}đ</strong>
            </div>
            <div className="mt-1 flex justify-between">
              <span>{t("partial_remaining")}</span>
              <strong>{Number(paymentData?.short_amount || 0).toLocaleString("vi-VN")}đ</strong>
            </div>
            <p className="mt-2 text-xs">{t("partial_payment_hint")}</p>
          </div>
        )}

        {status !== "redirecting" && (status === "failed" || status === "pending" || status === "expired") && bookingData && (
          <PaymentRetryPanel
            expiresAt={paymentData?.expires_at}
            fallbackStartedAt={paymentData?.created_at ?? bookingData.booked_at}
            onRetry={() => retryPayment(bookingData.booking_code)}
            isRetrying={isRetrying}
          />
        )}

        {status !== "redirecting" && (
          <PaymentActions status={status} booking={bookingData} />
        )}
      </div>
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
