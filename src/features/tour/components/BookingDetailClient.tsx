"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useBookingDetail, useBookingDetailByCode } from "../hooks/useBookingQueries";
import { isPaymentSessionExpired, usePayment } from "@/features/payment/hooks/usePayment";
import { BookingStatusTimeline } from "./BookingStatusTimeline";
import { BookingTourInfoCard } from "./BookingTourInfoCard";
import { BookingCustomerInfoCard } from "./BookingCustomerInfoCard";
import { BookingPriceSummaryCard } from "./BookingPriceSummaryCard";
import { CancelBookingDialog } from "./CancelBookingDialog";
import { bookingService } from "@/services/booking.service";
import { ChevronLeft, InfoCircle } from "@/components/icons/solar";
import { Button } from "@/components/ui";
import { toast } from "sonner";
import { CreditCard, Download, Printer, XCircle } from "lucide-react";
import { formatDate, formatDateTime, formatPriceVND } from "@/utils/format";
import type { Booking, BookingItem } from "@/types";

interface BookingDetailClientProps {
  id?: string;
  bookingCode?: string;
}

interface ActionIconButtonProps {
  label: string;
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  tone?: "default" | "primary" | "danger";
}

const translateInvoiceBookingStatus = (status: Booking["booking_status"]) => {
  switch (status) {
    case "pending":
      return "Chờ xác nhận";
    case "confirmed":
      return "Đã xác nhận";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};

const translateInvoicePaymentStatus = (status: Booking["payment_status"]) => {
  switch (status) {
    case "pending":
    case "unpaid":
      return "Chờ thanh toán";
    case "success":
      return "Thanh toán thành công";
    case "failed":
      return "Thanh toán thất bại";
    case "refunded":
      return "Đã hoàn tiền";
    case "partially_paid":
      return "Thanh toán một phần";
    default:
      return status;
  }
};

const translateInvoicePaymentMethod = (method: Booking["payment_method"]) => {
  switch (method) {
    case "sepay":
    case "payos":
      return "SePay VietQR";
    case "vnpay":
      return "VNPAY";
    case "momo":
      return "MoMo";
    case "zalopay":
      return "ZaloPay";
    case "bank_transfer":
      return "Chuyển khoản ngân hàng";
    case "cash":
      return "Tiền mặt";
    case "credit_card":
      return "Thẻ tín dụng";
    case "paypal":
      return "PayPal";
    default:
      return method;
  }
};

function ActionIconButton({
  label,
  children,
  onClick,
  disabled,
  isLoading,
  tone = "default",
}: ActionIconButtonProps) {
  const toneClass = {
    default: "border-border bg-white text-on-surface-subtle hover:border-primary/40 hover:bg-[#fff4f6] hover:text-primary",
    primary: "border-primary bg-primary text-white hover:bg-[#e31c5f]",
    danger: "border-red-200 bg-red-50 text-red-500 hover:border-red-300 hover:bg-red-100",
  }[tone];

  return (
    <div className="group relative inline-flex">
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${toneClass}`}
      >
        {isLoading ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          children
        )}
      </button>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[180px] -translate-x-1/2 rounded-full bg-[#222222] px-3 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-[0_8px_16px_rgba(0,0,0,0.16)] transition-opacity duration-150 group-hover:opacity-100">
        {label}
      </span>
    </div>
  );
}

export function BookingDetailClient({ id, bookingCode }: BookingDetailClientProps) {
  const t = useTranslations("tour.history");
  const tBooking = useTranslations("tour.booking");
  const router = useRouter();
  const { retryPayment, isRetrying } = usePayment();

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
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[20px] border border-border bg-white p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)] reveal-up">
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
  const latestRefundRequest = booking.refund_requests
    ?.slice()
    .sort((a, b) => b.id - a.id)[0];
  const canContinuePayment =
    ["pending", "failed", "unpaid", "partially_paid"].includes(booking.payment_status) &&
    booking.booking_status !== "cancelled";

  const handleContinuePayment = () => {
    const latestPayment = booking.latest_pending_payment;
    const latestPaymentMethod = latestPayment?.payment_method === "payos" ? "sepay" : latestPayment?.payment_method;
    const canReusePendingPayment =
      latestPaymentMethod === "sepay" || latestPaymentMethod === "bank_transfer";

    if (
      latestPayment?.transaction_code &&
      latestPayment.payment_status === "pending" &&
      canReusePendingPayment &&
      !isPaymentSessionExpired(latestPayment)
    ) {
      router.push(`/payment/result?transaction_code=${latestPayment.transaction_code}&booking_code=${booking.booking_code}`);
      return;
    }

    retryPayment({
      bookingCode: booking.booking_code,
      payment_method: "sepay",
    });
  };

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
        t("invoice_downloading"),
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
    <>
    <div className="space-y-6 md:space-y-8 print:hidden">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/profile/bookings")}
            className="rounded-full border border-border bg-white p-2.5 text-on-surface shadow-sm transition-colors hover:border-primary/30 hover:bg-[#f7f7f7] hover:text-primary active:scale-95"
            aria-label={t("back_to_list")}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">{t("detail_title")}</h1>
            <p className="text-xs text-on-surface-subtle mt-1">
              {t("booking_code")}: <span className="select-all font-bold text-on-surface">{booking.booking_code}</span>
            </p>
          </div>
        </div>

        {/* Print & Cancel Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <ActionIconButton
            label={isDownloading ? t("invoice_downloading") : t("button_download_invoice")}
            onClick={handleDownloadInvoice}
            disabled={isDownloading}
            isLoading={isDownloading}
          >
            <Download className="h-4 w-4" />
          </ActionIconButton>

          <ActionIconButton
            label={t("button_print_invoice")}
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" />
          </ActionIconButton>

          {canCancel && (
            <ActionIconButton
              label={t("button_cancel_booking")}
              onClick={() => setIsCancelOpen(true)}
              tone="danger"
            >
              <XCircle className="h-4 w-4" />
            </ActionIconButton>
          )}
        </div>
      </div>

      {/* Print-only Invoice Header */}
      <div className="hidden print:block border-b border-border pb-6 text-center space-y-2">
        <h1 className="text-3xl font-bold text-on-surface uppercase tracking-wider">{t("invoice_title")}</h1>
        <p className="text-sm text-on-surface-subtle">
          {t("booking_code")}: <span className="font-bold text-on-surface">{booking.booking_code}</span>
        </p>
        <p className="text-xs text-on-surface-subtle">
          {t("booked_date")}: <span className="font-medium text-on-surface">{new Date(booking.booked_at).toLocaleString()}</span>
        </p>
      </div>

      {/* Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 print:flex print:flex-col print:gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8 print:space-y-6 print:w-full">
          {/* Status Timeline */}
          <div className="print:hidden">
            <BookingStatusTimeline booking={booking} />
          </div>

          {/* Tour Card */}
          <BookingTourInfoCard item={item} />

          {/* Customer Card */}
          <BookingCustomerInfoCard booking={booking} />
        </div>

        {/* Right Column: Pricing & Cancel warnings */}
        <div className="space-y-6 md:space-y-8 print:w-full">
          {/* Price Summary */}
          <BookingPriceSummaryCard booking={booking} />

          {canContinuePayment && (
            <div className="rounded-[20px] border border-border bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] print:hidden">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-normal text-on-surface">
                    {tBooking("payment_method")}
                  </h3>
                  <p className="mt-1 text-xs text-on-surface-subtle">
                    SePay VietQR — {tBooking("continue_payment")}
                  </p>
                </div>
                <ActionIconButton
                  label={tBooking("continue_payment")}
                  onClick={handleContinuePayment}
                  isLoading={isRetrying}
                  disabled={isRetrying}
                  tone="primary"
                >
                  <CreditCard className="h-4 w-4" />
                </ActionIconButton>
              </div>
            </div>
          )}

          {/* Cancellation Info Panel if Cancelled */}
          {booking.booking_status === "cancelled" && booking.cancellation_reason && (
            <div className="space-y-2.5 rounded-[20px] border border-red-200 bg-red-50 p-5 text-xs leading-relaxed text-red-600 reveal-up">
              <div className="flex items-center gap-2 font-bold text-red-400">
                <InfoCircle className="w-5 h-5 shrink-0" />
                <span>{t("cancellation_reason_label")}</span>
              </div>
              <p className="rounded-xl border border-red-100 bg-white p-3">
                {booking.cancellation_reason}
              </p>
            </div>
          )}

          {latestRefundRequest && (
            <div className="space-y-3 rounded-[20px] border border-amber-200 bg-amber-50 p-5 text-sm print:hidden">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-amber-900">Yêu cầu hoàn tiền</span>
                <span className="rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-bold text-amber-700">
                  {latestRefundRequest.status === "completed"
                    ? "Đã hoàn tiền"
                    : latestRefundRequest.status === "processing"
                      ? "Đang xử lý"
                      : latestRefundRequest.status === "failed"
                        ? "Xử lý thất bại"
                        : latestRefundRequest.status === "rejected"
                          ? "Đã từ chối"
                          : "Chờ xử lý"}
                </span>
              </div>
              <div className="flex justify-between text-amber-900">
                <span>Mã hoàn tiền</span>
                <strong>{latestRefundRequest.refund_code}</strong>
              </div>
              <div className="flex justify-between text-amber-900">
                <span>Số tiền</span>
                <strong>
                  {formatPriceVND(
                    Number(
                      latestRefundRequest.approved_amount ??
                        latestRefundRequest.requested_amount
                    )
                  )}
                </strong>
              </div>
              {latestRefundRequest.transfer_reference && (
                <div className="flex justify-between text-amber-900">
                  <span>Mã giao dịch ngân hàng</span>
                  <strong>{latestRefundRequest.transfer_reference}</strong>
                </div>
              )}
            </div>
          )}

          {/* Rebook CTA link */}
          {booking.booking_status === "cancelled" && item.tour && (
            <div className="print:hidden">
              <Button
                variant="primary"
                onClick={() => router.push(`/tours/${item.tour?.slug}`)}
                className="w-full py-3.5 rounded-full text-sm font-semibold bg-primary text-white hover:bg-[#e31c5f] active:scale-95"
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
    <PrintableBookingInvoice booking={booking} item={item} />
    </>
  );
}

function PrintableBookingInvoice({ booking, item }: { booking: Booking; item: BookingItem }) {
  const quantityAdult = item.quantity_adult || 0;
  const quantityChild = item.quantity_child || 0;
  const quantityInfant = item.quantity_infant || 0;
  const quantityTotal = quantityAdult + quantityChild + quantityInfant;
  const totalAmount = Number(booking.total_amount || 0);
  const discountAmount = Number(booking.discount_amount || 0);
  const depositAmount = Number(booking.deposit_amount || 0);
  const finalAmount = Number(booking.final_amount || booking.total_amount || 0);
  const remainingAmount = Math.max(0, finalAmount - depositAmount);
  const unitPriceAdult = Number(item.unit_price_adult || 0);
  const tourName = item.item_name || item.tour?.name || "Tour du lịch";
  const travelDate = item.travel_date ? formatDate(item.travel_date, "vi-VN") : "Chưa cập nhật";
  const bookedAt = booking.booked_at ? formatDateTime(booking.booked_at, "vi-VN") : "Chưa cập nhật";
  const confirmedAt = booking.confirmed_at ? formatDateTime(booking.confirmed_at, "vi-VN") : "Chưa xác nhận";

  return (
    <section className="hidden print:block print:bg-white print:p-0 print:text-[#111827]">
      <div className="mx-auto w-full max-w-[780px] overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white text-[12px] leading-relaxed text-[#111827] print:max-w-none print:rounded-none print:border-0">
        <div className="flex items-start justify-between bg-primary px-8 py-7 text-white print:bg-[#ff385c]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg font-black text-primary print:text-[#ff385c]">
                D
              </div>
              <div>
                <div className="text-2xl font-black">DaNangTrip</div>
                <div className="text-xs font-medium text-white/80">Khám phá Đà Nẵng như người bản địa</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-black uppercase">Hóa đơn đặt tour</h1>
            <p className="mt-2 text-xs text-white/85">
              Mã đơn: <strong>{booking.booking_code}</strong>
            </p>
            <p className="text-xs text-white/85">
              Ngày xuất: <strong>{formatDateTime(new Date(), "vi-VN")}</strong>
            </p>
          </div>
        </div>

        <div className="space-y-6 px-8 py-7">
          <div className="grid grid-cols-2 gap-4">
            <InvoicePrintCard title="Thông tin khách hàng">
              <InvoicePrintLine label="Họ và tên" value={booking.customer_name} />
              <InvoicePrintLine label="Email" value={booking.customer_email} />
              <InvoicePrintLine label="Số điện thoại" value={booking.customer_phone} />
              <InvoicePrintLine label="Địa chỉ" value={booking.customer_address || "Chưa cập nhật"} />
            </InvoicePrintCard>

            <InvoicePrintCard title="Thông tin đơn hàng">
              <InvoicePrintLine label="Ngày đặt" value={bookedAt} />
              <InvoicePrintLine label="Ngày xác nhận" value={confirmedAt} />
              <InvoicePrintLine label="Trạng thái đơn" value={translateInvoiceBookingStatus(booking.booking_status)} strong />
              <InvoicePrintLine label="Thanh toán" value={translateInvoicePaymentStatus(booking.payment_status)} strong />
              <InvoicePrintLine label="Phương thức" value={translateInvoicePaymentMethod(booking.payment_method)} />
            </InvoicePrintCard>
          </div>

          <div>
            <h2 className="mb-3 text-xs font-black uppercase text-primary print:text-[#ff385c]">Chi tiết dịch vụ</h2>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-[#111827] text-white">
                  <th className="border border-[#111827] px-3 py-2 text-center">STT</th>
                  <th className="border border-[#111827] px-3 py-2 text-left">Tour / dịch vụ</th>
                  <th className="border border-[#111827] px-3 py-2 text-center">Ngày đi</th>
                  <th className="border border-[#111827] px-3 py-2 text-center">Số khách</th>
                  <th className="border border-[#111827] px-3 py-2 text-right">Đơn giá</th>
                  <th className="border border-[#111827] px-3 py-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#e5e7eb] px-3 py-3 text-center">1</td>
                  <td className="border border-[#e5e7eb] px-3 py-3">
                    <strong>{tourName}</strong>
                    <div className="mt-1 text-[11px] text-[#6b7280]">
                      Người lớn: {quantityAdult}
                      {quantityChild > 0 ? ` | Trẻ em: ${quantityChild}` : ""}
                      {quantityInfant > 0 ? ` | Em bé: ${quantityInfant}` : ""}
                    </div>
                  </td>
                  <td className="border border-[#e5e7eb] px-3 py-3 text-center">{travelDate}</td>
                  <td className="border border-[#e5e7eb] px-3 py-3 text-center">{quantityTotal} khách</td>
                  <td className="border border-[#e5e7eb] px-3 py-3 text-right">{formatPriceVND(unitPriceAdult)}</td>
                  <td className="border border-[#e5e7eb] px-3 py-3 text-right font-bold">{formatPriceVND(Number(item.subtotal || 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-2xl border border-dashed border-primary/40 bg-[#fff4f6] p-4 print:border-[#fda4af]">
              <h2 className="mb-2 text-xs font-black uppercase text-primary print:text-[#ff385c]">Ghi chú</h2>
              <p>{booking.customer_note || "Không có ghi chú."}</p>
              <p className="mt-3 text-[11px] text-[#6b7280]">
                Hóa đơn được tạo tự động từ hệ thống DaNangTrip. Vui lòng giữ mã đơn để đối chiếu khi cần hỗ trợ.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e5e7eb] p-4">
              <InvoicePrintMoney label="Tạm tính" value={totalAmount} />
              <InvoicePrintMoney label="Giảm giá" value={discountAmount} prefix="- " />
              <InvoicePrintMoney label="Đã thanh toán / đặt cọc" value={depositAmount} />
              <InvoicePrintMoney label="Còn lại" value={remainingAmount} />
              <div className="mt-3 flex items-end justify-between border-t border-[#e5e7eb] pt-3">
                <span className="font-black uppercase">Tổng thanh toán</span>
                <span className="text-xl font-black text-primary print:text-[#ff385c]">{formatPriceVND(finalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4 text-center">
            <div>
              <div className="font-black">Khách hàng</div>
              <div className="mt-1 text-[11px] text-[#9ca3af]">Ký và ghi rõ họ tên nếu cần đối chiếu</div>
            </div>
            <div>
              <div className="font-black">DaNangTrip</div>
              <div className="mt-1 text-[11px] text-[#9ca3af]">Hóa đơn điện tử tạo tự động</div>
            </div>
          </div>

          <div className="border-t border-[#e5e7eb] pt-4 text-center text-[11px] text-[#6b7280]">
            <strong className="text-primary print:text-[#ff385c]">Cảm ơn quý khách đã sử dụng DaNangTrip.</strong>
            <br />
            Hỗ trợ: info@danangtrip.com | Hotline: 1900 1800 | Đà Nẵng, Việt Nam
          </div>
        </div>
      </div>
    </section>
  );
}

function InvoicePrintCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#edf2f7] bg-[#f9fafb] p-4">
      <h2 className="mb-3 text-xs font-black uppercase text-primary print:text-[#ff385c]">{title}</h2>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function InvoicePrintLine({ label, value, strong }: { label: string; value: ReactNode; strong?: boolean }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-2">
      <span className="text-[#6b7280]">{label}:</span>
      <span className={strong ? "font-black" : "font-bold"}>{value}</span>
    </div>
  );
}

function InvoicePrintMoney({ label, value, prefix = "" }: { label: string; value: number; prefix?: string }) {
  return (
    <div className="flex justify-between border-b border-[#edf2f7] py-2 last:border-b-0">
      <span className="text-[#6b7280]">{label}</span>
      <span className="font-black">{prefix}{formatPriceVND(value)}</span>
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
          <div className="flex h-44 flex-col justify-between rounded-[20px] border border-border bg-white p-6">
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

          <div className="flex h-36 gap-6 rounded-[20px] border border-border bg-white p-6">
            <div className="h-24 w-36 shrink-0 rounded-xl bg-[#eceff3]" />
            <div className="flex-1 space-y-4">
              <div className="h-5 w-2/3 rounded bg-[#eceff3]" />
              <div className="h-3 w-1/3 rounded bg-[#f3f4f6]" />
              <div className="h-3 w-1/2 rounded bg-[#f3f4f6]" />
            </div>
          </div>

          <div className="h-48 space-y-6 rounded-[20px] border border-border bg-white p-6">
            <div className="h-4 w-36 rounded bg-[#eceff3]" />
            <div className="space-y-3">
              <div className="h-3 w-1/3 rounded bg-[#f3f4f6]" />
              <div className="h-3 w-1/2 rounded bg-[#f3f4f6]" />
              <div className="h-3 w-1/4 rounded bg-[#f3f4f6]" />
            </div>
          </div>
        </div>

        <div className="flex h-64 flex-col justify-between rounded-[20px] border border-border bg-white p-6">
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
