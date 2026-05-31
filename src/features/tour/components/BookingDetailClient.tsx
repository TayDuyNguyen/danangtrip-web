"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useBookingDetail, useBookingDetailByCode } from "../hooks/useBookingQueries";
import { BookingStatusTimeline } from "./BookingStatusTimeline";
import { BookingTourInfoCard } from "./BookingTourInfoCard";
import { BookingCustomerInfoCard } from "./BookingCustomerInfoCard";
import { BookingPriceSummaryCard } from "./BookingPriceSummaryCard";
import { CancelBookingDialog } from "./CancelBookingDialog";
import { bookingService } from "@/services/booking.service";
import { ChevronLeft, InfoCircle } from "@/components/icons/solar";
import { Button } from "@/components/ui";
import { toast } from "sonner";
import { Download, Printer } from "lucide-react";

interface BookingDetailClientProps {
  id?: string;
  bookingCode?: string;
}

export function BookingDetailClient({ id, bookingCode }: BookingDetailClientProps) {
  const t = useTranslations("tour.history");
  const locale = useLocale();
  const router = useRouter();

  const detailQuery = useBookingDetail(id as string);
  const detailByCodeQuery = useBookingDetailByCode(bookingCode as string);

  const { data: response, isLoading, error, refetch } = bookingCode ? detailByCodeQuery : detailQuery;
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
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[28px] border border-border bg-white p-6 text-center shadow-[0_18px_54px_rgba(15,23,42,0.08)] reveal-up">
        <InfoCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="mb-2 text-xl font-bold text-on-surface">
          {error ? t("error_load") : t("empty_title")}
        </h3>
        <p className="text-sm text-on-surface-subtle max-w-md mb-6">
          {error ? t("error_desc") : t("empty_desc")}
        </p>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => router.push("/profile/bookings")}
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
    // Pre-flight check: Trạng thái thanh toán phải là "success"
    if (booking.payment_status !== "success") {
      toast.warning(t("invoice_unpaid_error"), {
        style: {
          background: "#FEF3C7",
          color: "#F59E0B",
          borderColor: "#FCD34D",
        },
      });
      return;
    }

    setIsDownloading(true);
    try {
      const res = await bookingService.invoice(booking.id);
      // res.data ở đây là một Blob nhị phân do responseType: "blob"
      if (!res.data) throw new Error("Empty invoice response");
      const blobUrl = window.URL.createObjectURL(res.data);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", blobUrl);
      downloadAnchor.setAttribute("download", `invoice-${booking.booking_code}.pdf`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success(
        locale === "vi" ? "Đang tải xuống hóa đơn PDF của bạn..." : "Downloading your PDF invoice...",
        {
          style: {
            background: "#ECFDF5",
            color: "#10B981",
            borderColor: "#A7F3D0",
          },
        }
      );
    } catch (err: unknown) {
      const apiErr = err as { status?: number; rawData?: unknown; message?: string };
      if (apiErr?.status === 401) {
        router.push("/login");
        return;
      }

      let errorMessage = t("invoice_server_error");
      if (apiErr?.rawData instanceof Blob) {
        try {
          const errorText = await apiErr.rawData.text();
          const errorJson = JSON.parse(errorText) as { message?: string; user_message?: string };
          errorMessage = errorJson.message || errorJson.user_message || errorMessage;
        } catch (parseErr) {
          console.error("Failed to parse error blob", parseErr);
        }
      } else if (apiErr?.message) {
        errorMessage = apiErr.message;
      }

      toast.error(errorMessage, {
        style: {
          background: "#FEE2E2",
          color: "#EF4444",
          borderColor: "#FCA5A5",
        },
      });
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
            onClick={() => router.push("/profile/bookings")}
            className="rounded-full border border-border bg-white p-2.5 text-on-surface shadow-sm transition-colors hover:border-primary/30 hover:bg-[#f7f7f7] hover:text-primary active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">{t("detail_title")}</h1>
            <p className="text-xs text-on-surface-subtle font-mono mt-1">
              {t("booking_code")}: <span className="select-all font-bold text-on-surface">{booking.booking_code}</span>
            </p>
          </div>
        </div>

        {/* Print & Cancel Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleDownloadInvoice}
            disabled={isDownloading}
            className={`flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-xs font-semibold text-on-surface transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary ${
              isDownloading ? "bg-[#3385D6] border-[#3385D6] hover:bg-[#3385D6]/90 cursor-not-allowed" : ""
            }`}
          >
            {isDownloading ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Download className="w-4 h-4 text-primary" />
            )}
            <span>{isDownloading ? t("invoice_downloading") : t("button_download_invoice")}</span>
          </Button>

          <Button
            variant="secondary"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-xs font-semibold text-on-surface transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
          >
            <Printer className="w-4 h-4 text-on-surface-subtle" />
            <span>{t("button_print_invoice")}</span>
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
        <h1 className="text-3xl font-bold text-on-surface uppercase tracking-wider">{t("invoice_title")}</h1>
        <p className="text-sm font-mono text-on-surface-subtle">
          {t("booking_code")}: <span className="font-bold text-on-surface">{booking.booking_code}</span>
        </p>
        <p className="text-xs text-on-surface-subtle">
          {t("booked_date")}: <span className="font-medium text-on-surface">{new Date(booking.booked_at).toLocaleString()}</span>
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
            <div className="space-y-2.5 rounded-[24px] border border-red-200 bg-red-50 p-5 text-xs leading-relaxed text-red-600 reveal-up">
              <div className="flex items-center gap-2 font-bold text-red-400">
                <InfoCircle className="w-5 h-5 shrink-0" />
                <span>{t("cancellation_reason_label")}</span>
              </div>
              <p className="rounded-xl border border-red-100 bg-white p-3 font-mono">
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
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-[#eceff3]" />
          <div className="space-y-2">
            <div className="h-6 w-48 rounded bg-[#eceff3]" />
            <div className="h-4 w-32 rounded bg-[#f3f4f6]" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-24 rounded-full bg-[#eceff3]" />
          <div className="h-10 w-24 rounded-full bg-[#eceff3]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex h-44 flex-col justify-between rounded-[24px] border border-border bg-white p-6">
            <div className="h-4 w-32 rounded bg-[#eceff3]" />
            <div className="flex justify-between items-center px-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-[#eceff3]" />
                  <div className="h-3 w-16 rounded bg-[#f3f4f6]" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex h-36 gap-6 rounded-[24px] border border-border bg-white p-6">
            <div className="h-24 w-36 shrink-0 rounded-xl bg-[#eceff3]" />
            <div className="flex-1 space-y-4">
              <div className="h-5 w-2/3 rounded bg-[#eceff3]" />
              <div className="h-3 w-1/3 rounded bg-[#f3f4f6]" />
              <div className="h-3 w-1/2 rounded bg-[#f3f4f6]" />
            </div>
          </div>

          <div className="h-48 space-y-6 rounded-[24px] border border-border bg-white p-6">
            <div className="h-4 w-36 rounded bg-[#eceff3]" />
            <div className="space-y-3">
              <div className="h-3 w-1/3 rounded bg-[#f3f4f6]" />
              <div className="h-3 w-1/2 rounded bg-[#f3f4f6]" />
              <div className="h-3 w-1/4 rounded bg-[#f3f4f6]" />
            </div>
          </div>
        </div>

        <div className="flex h-64 flex-col justify-between rounded-[24px] border border-border bg-white p-6">
          <div className="h-4 w-32 rounded bg-[#eceff3]" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-3 w-20 rounded bg-[#f3f4f6]" />
              <div className="h-3 w-16 rounded bg-[#f3f4f6]" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 w-24 rounded bg-[#f3f4f6]" />
              <div className="h-3 w-16 rounded bg-[#f3f4f6]" />
            </div>
          </div>
          <div className="pt-4 border-t border-border flex justify-between items-end">
            <div className="h-4 w-16 rounded bg-[#eceff3]" />
            <div className="h-6 w-24 rounded bg-[#eceff3]" />
          </div>
        </div>
      </div>
    </div>
  );
}
