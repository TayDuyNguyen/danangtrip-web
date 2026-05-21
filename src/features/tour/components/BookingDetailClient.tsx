"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useBookingDetail } from "../hooks/useBookingQueries";
import { BookingStatusTimeline } from "./BookingStatusTimeline";
import { BookingTourInfoCard } from "./BookingTourInfoCard";
import { BookingCustomerInfoCard } from "./BookingCustomerInfoCard";
import { BookingPriceSummaryCard } from "./BookingPriceSummaryCard";
import { CancelBookingDialog } from "./CancelBookingDialog";
import { bookingService } from "@/services/booking.service";
import { ChevronLeft, InfoCircle } from "@/components/icons/solar";
import { Button } from "@/components/ui";
import { toast } from "sonner";

interface BookingDetailClientProps {
  id: string;
}

export function BookingDetailClient({ id }: BookingDetailClientProps) {
  const t = useTranslations("tour.history");
  const locale = useLocale();
  const router = useRouter();

  const { data: response, isLoading, error, refetch } = useBookingDetail(id);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const booking = response;
  const item = booking?.booking_items?.[0] || booking?.items?.[0];

  const [isPast] = useState(() => {
    const travelDateStr = item?.travel_date;
    return travelDateStr ? new Date(travelDateStr).getTime() < Date.now() : false;
  });

  if (isLoading) {
    return <BookingDetailSkeleton />;
  }

  if (error || !booking || !item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 border border-border rounded-2xl bg-surface reveal-up">
        <InfoCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">
          {error ? t("error_load") : t("empty_title")}
        </h3>
        <p className="text-sm text-on-surface-subtle max-w-md mb-6">
          {error ? t("error_desc") : t("empty_desc")}
        </p>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => router.push("/bookings")}
            className="px-6 py-2.5 rounded-full"
          >
            {t("back_to_list")}
          </Button>
          <Button
            variant="primary"
            onClick={() => refetch()}
            className="px-6 py-2.5 rounded-full"
          >
            {t("button_retry")}
          </Button>
        </div>
      </div>
    );
  }

  const canCancel = (booking.booking_status === "pending" || booking.booking_status === "confirmed") && !isPast;

  const handleDownloadInvoice = async () => {
    setIsDownloading(true);
    try {
      const res = await bookingService.invoice(id);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `invoice-${booking.booking_code}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success(locale === "vi" ? "Đã tải dữ liệu hóa đơn dạng JSON!" : "Invoice JSON data downloaded!");
    } catch {
      toast.error(locale === "vi" ? "Tải hóa đơn thất bại." : "Failed to download invoice.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 md:space-y-8 print:p-0">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/bookings")}
            className="p-2.5 rounded-full border border-border bg-surface-container hover:bg-surface-container-high transition-colors active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{t("detail_title")}</h1>
            <p className="text-xs text-on-surface-subtle font-mono mt-1">
              {t("booking_code")}: <span className="text-white select-all font-bold">{booking.booking_code}</span>
            </p>
          </div>
        </div>

        {/* Print & Cancel Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleDownloadInvoice}
            disabled={isDownloading}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-white border-border bg-surface-container hover:border-primary/50"
          >
            {isDownloading ? t("button_submitting") : t("button_print_invoice")} (JSON)
          </Button>

          <Button
            variant="secondary"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-white border-border bg-surface-container hover:border-primary/50"
          >
            {t("button_print_invoice")}
          </Button>

          {canCancel && (
            <Button
              variant="secondary"
              onClick={() => setIsCancelOpen(true)}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-red-400 border-red-500/20 bg-red-500/5 hover:border-red-500/50 hover:bg-red-500/10"
            >
              {t("button_cancel_booking")}
            </Button>
          )}
        </div>
      </div>

      {/* Print-only Invoice Header */}
      <div className="hidden print:block border-b border-border pb-6 text-center space-y-2">
        <h1 className="text-3xl font-bold text-white uppercase tracking-wider">{t("invoice_title")}</h1>
        <p className="text-sm font-mono text-on-surface-subtle">
          {t("booking_code")}: <span className="text-white font-bold">{booking.booking_code}</span>
        </p>
        <p className="text-xs text-on-surface-subtle">
          {t("booked_date")}: <span className="text-white font-medium">{new Date(booking.booked_at).toLocaleString()}</span>
        </p>
      </div>

      {/* Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Status Timeline */}
          <BookingStatusTimeline booking={booking} />

          {/* Tour Card */}
          <BookingTourInfoCard item={item} />

          {/* Customer Card */}
          <BookingCustomerInfoCard booking={booking} />
        </div>

        {/* Right Column: Pricing & Cancel warnings */}
        <div className="space-y-6 md:space-y-8 print:col-span-3">
          {/* Price Summary */}
          <BookingPriceSummaryCard booking={booking} />

          {/* Cancellation Info Panel if Cancelled */}
          {booking.booking_status === "cancelled" && booking.cancellation_reason && (
            <div className="p-5 rounded-2xl border border-red-500/10 bg-red-500/5 text-xs text-red-300 leading-relaxed space-y-2.5 reveal-up">
              <div className="flex items-center gap-2 font-bold text-red-400">
                <InfoCircle className="w-5 h-5 shrink-0" />
                <span>{t("cancellation_reason_label")}</span>
              </div>
              <p className="font-mono bg-surface p-3 rounded-xl border border-border">
                {booking.cancellation_reason}
              </p>
            </div>
          )}

          {/* Rebook CTA link */}
          {booking.booking_status === "cancelled" && item.tour && (
            <div className="print:hidden">
              <Button
                variant="primary"
                onClick={() => router.push(`/tours/${item.tour?.slug}`)}
                className="w-full py-3.5 rounded-full text-sm font-bold bg-primary text-white shadow-xl hover:shadow-2xl active:scale-95"
              >
                {t("rebook_button")}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <CancelBookingDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        bookingId={booking.id}
        onSubmitSuccess={() => refetch()}
      />
    </div>
  );
}

// Visual Skeleton Loader
function BookingDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-container" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-surface-container rounded" />
            <div className="h-4 w-32 bg-surface-container-low rounded" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-surface-container rounded-full" />
          <div className="h-10 w-24 bg-surface-container rounded-full" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Timeline Skeleton */}
          <div className="h-44 bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between">
            <div className="h-4 w-32 bg-surface-container rounded" />
            <div className="flex justify-between items-center px-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-surface-container" />
                  <div className="h-3 w-16 bg-surface-container-low rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Tour Card Skeleton */}
          <div className="h-36 bg-surface border border-border rounded-2xl p-6 flex gap-6">
            <div className="w-36 h-24 bg-surface-container rounded-xl shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="h-5 w-2/3 bg-surface-container rounded" />
              <div className="h-3 w-1/3 bg-surface-container-low rounded" />
              <div className="h-3 w-1/2 bg-surface-container-low rounded" />
            </div>
          </div>

          {/* Customer Info Skeleton */}
          <div className="h-48 bg-surface border border-border rounded-2xl p-6 space-y-6">
            <div className="h-4 w-36 bg-surface-container rounded" />
            <div className="space-y-3">
              <div className="h-3 w-1/3 bg-surface-container-low rounded" />
              <div className="h-3 w-1/2 bg-surface-container-low rounded" />
              <div className="h-3 w-1/4 bg-surface-container-low rounded" />
            </div>
          </div>
        </div>

        {/* Right Column Price Skeleton */}
        <div className="h-64 bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between">
          <div className="h-4 w-32 bg-surface-container rounded" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-3 w-20 bg-surface-container-low rounded" />
              <div className="h-3 w-16 bg-surface-container-low rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 w-24 bg-surface-container-low rounded" />
              <div className="h-3 w-16 bg-surface-container-low rounded" />
            </div>
          </div>
          <div className="pt-4 border-t border-border flex justify-between items-end">
            <div className="h-4 w-16 bg-surface-container rounded" />
            <div className="h-6 w-24 bg-surface-container rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
