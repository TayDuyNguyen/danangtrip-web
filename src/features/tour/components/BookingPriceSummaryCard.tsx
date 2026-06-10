"use client";

import { useTranslations } from "next-intl";
import { formatPriceVND } from "@/utils/format";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types";

interface BookingPriceSummaryCardProps {
  booking: Booking;
}

export function BookingPriceSummaryCard({ booking }: BookingPriceSummaryCardProps) {
  const t = useTranslations("tour.history");
  const tp = useTranslations("tour.payment");

  const item = booking.booking_items?.[0] || booking.items?.[0];

  const quantityAdult = item?.quantity_adult || 0;
  const quantityChild = item?.quantity_child || 0;
  const quantityInfant = item?.quantity_infant || 0;

  const unitPriceAdult = Number(item?.unit_price_adult || 0);
  const unitPriceChild = Number(item?.unit_price_child || 0);
  const unitPriceInfant = Number(item?.unit_price_infant || 0);

  const discountAmount = Number(booking.discount_amount || 0);
  const finalAmount = Number(booking.final_amount || 0);

  // Determine booking status badge variant & styling
  const getBookingStatusBadge = (status: Booking["booking_status"]) => {
    switch (status) {
      case "pending":
        return { variant: "warning" as const, text: t("booking_states.pending") };
      case "confirmed":
        return { variant: "ghost" as const, text: t("booking_states.confirmed"), className: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
      case "completed":
        return { variant: "success" as const, text: t("booking_states.completed") };
      case "cancelled":
        return { variant: "error" as const, text: t("booking_states.cancelled") };
      default:
        return { variant: "outline" as const, text: status };
    }
  };

  // Determine payment status badge variant & styling
  const getPaymentStatusBadge = (status: Booking["payment_status"]) => {
    switch (status) {
      case "pending":
      case "unpaid":
        return { variant: "warning" as const, text: tp("status_pending") };
      case "success":
        return { variant: "success" as const, text: tp("status_success") };
      case "failed":
        return { variant: "error" as const, text: tp("status_failed") };
      case "refunded":
        return { variant: "outline" as const, text: t("payment_states.refunded") };
      case "partially_paid":
        return { variant: "warning" as const, text: t("payment_states.partially_paid") };
      default:
        return { variant: "outline" as const, text: status };
    }
  };

  const bookingBadge = getBookingStatusBadge(booking.booking_status);
  const paymentBadge = getPaymentStatusBadge(booking.payment_status);

  // Map payment method key to translated name
  const getPaymentMethodName = (method: Booking["payment_method"]) => {
    const keys = {
      sepay: "methods.sepay",
      payos: "methods.sepay",
      momo: "methods.momo",
      vnpay: "methods.vnpay",
      zalopay: "methods.zalopay",
      bank_transfer: "methods.bank_transfer",
      credit_card: "methods.credit_card",
      cash: "methods.cash",
      paypal: "methods.paypal",
    } as const;

    const key = keys[method as keyof typeof keys];
    return key ? tp(key) : method;
  };

  return (
    <div className="w-full rounded-[20px] border border-border bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] md:p-6 reveal-up">
      <h3 className="text-sm font-black text-on-surface uppercase tracking-wider mb-5">
        {t("section_price")}
      </h3>

      <div className="space-y-4">
        {/* Breakdown details */}
        <div className="space-y-2.5 text-xs text-on-surface-subtle">
          {/* Adults */}
          <div className="flex justify-between items-center">
            <span className="text-on-surface-subtle">
              {t("price_adult_detail", { count: quantityAdult, price: formatPriceVND(unitPriceAdult) })}
            </span>
            <span className="text-on-surface font-medium tabular-nums">
              {formatPriceVND(quantityAdult * unitPriceAdult)}
            </span>
          </div>

          {/* Children */}
          {quantityChild > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-on-surface-subtle">
                {t("price_child_detail", { count: quantityChild, price: formatPriceVND(unitPriceChild) })}
              </span>
              <span className="text-on-surface font-medium tabular-nums">
                {formatPriceVND(quantityChild * unitPriceChild)}
              </span>
            </div>
          )}

          {/* Infants */}
          {quantityInfant > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-on-surface-subtle">
                {t("price_infant_detail", { count: quantityInfant, price: formatPriceVND(unitPriceInfant) })}
              </span>
              <span className="text-on-surface font-medium tabular-nums">
                {formatPriceVND(quantityInfant * unitPriceInfant)}
              </span>
            </div>
          )}

          {/* Discount if any */}
          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-red-400">
              <span>{t("coupon_discount")}</span>
              <span className="font-medium tabular-nums">-{formatPriceVND(discountAmount)}</span>
            </div>
          )}
        </div>

        {/* Totals & Metadata */}
        <div className="pt-4 border-t border-border/60 space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-xs font-black text-on-surface uppercase">{t("total_amount")}</span>
            <span className="text-xl font-bold text-primary tabular-nums">
              {formatPriceVND(finalAmount)}
            </span>
          </div>

          {/* Table meta */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] border-t border-border/30">
            <div className="flex flex-col gap-1">
              <span className="text-on-surface-subtle uppercase">{t("payment_method_label")}</span>
              <span className="text-on-surface font-semibold">{getPaymentMethodName(booking.payment_method)}</span>
            </div>

            <div className="flex flex-col gap-1 items-end">
              <span className="text-on-surface-subtle uppercase">{t("payment_status_label")}</span>
              <Badge variant={paymentBadge.variant} className="text-[9px] font-bold py-0">
                {paymentBadge.text}
              </Badge>
            </div>

            <div className="flex flex-col gap-1 pt-2">
              <span className="text-on-surface-subtle uppercase">{t("booking_status_label")}</span>
              <Badge variant={bookingBadge.variant} className={cn("text-[9px] font-bold py-0 w-fit", bookingBadge.className)}>
                {bookingBadge.text}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
