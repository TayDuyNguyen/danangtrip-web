"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Calendar, Users, InfoCircle, Clock } from "@/components/icons/solar";
import { Badge } from "@/components/ui";
import { formatNumber } from "@/utils/format";
import type { Booking } from "@/types";
import { cn } from "@/lib/utils";

interface BookingHistoryCardProps {
  booking: Booking;
  onCancelClick: (booking: Booking) => void;
  index?: number;
}

export function BookingHistoryCard({
  booking,
  onCancelClick,
  index = 0,
}: BookingHistoryCardProps) {
  const t = useTranslations("tour.history");
  const tp = useTranslations("tour.payment");
  const tTour = useTranslations("tour");
  const locale = useLocale();

  const item = booking.booking_items?.[0] || booking.items?.[0];
  const tour = item?.tour;
  const tourName = item?.item_name || tour?.name || tTour("detail.breadcrumb_tours") || "Tour";
  const tourThumbnail = tour?.thumbnail || "/images/placeholder.png";
  const travelDateStr = item?.travel_date || booking.booked_at;

  const dateFormatter = new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const bookedDateFormatter = new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const travelDate = dateFormatter.format(new Date(travelDateStr));
  const bookedDate = bookedDateFormatter.format(new Date(booking.booked_at));

  // Determine booking status badge variant & styling
  const getBookingStatusBadge = (status: Booking["booking_status"]) => {
    switch (status) {
      case "pending":
        return { variant: "warning" as const, text: t("tabs.pending") };
      case "confirmed":
        return { variant: "ghost" as const, text: t("tabs.confirmed"), className: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
      case "completed":
        return { variant: "success" as const, text: t("tabs.completed") };
      case "cancelled":
        return { variant: "error" as const, text: t("tabs.cancelled") };
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

  const [isPast] = useState(() => {
    const travelTime = new Date(travelDateStr).getTime();
    const now = Date.now();
    return travelTime < now;
  });

  // Can cancel if status is pending or confirmed, and travel date is in the future
  const canCancel =
    (booking.booking_status === "pending" || booking.booking_status === "confirmed") &&
    !isPast;

  const totalGuests =
    (item?.quantity_adult || 0) + (item?.quantity_child || 0) + (item?.quantity_infant || 0);

  return (
    <div
      className="w-full max-w-full overflow-hidden rounded-[28px] border border-border bg-white reveal-up shadow-[0_18px_54px_rgba(15,23,42,0.08)] transition-all duration-300 hover:border-primary/25 hover:shadow-[0_24px_64px_rgba(15,23,42,0.11)]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="group relative flex flex-col overflow-hidden rounded-[28px] bg-white p-5 md:flex-row md:p-6 gap-6">
        
        {/* Thumbnail Image */}
        <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-2xl bg-[#f7f7f7] md:w-44">
          <Image
            src={tourThumbnail}
            alt={tourName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 176px"
          />
        </div>

        {/* Content Details */}
        <div className="flex flex-col flex-1 min-w-0">
          
          {/* Top Row: Booking Code & Statuses */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="font-mono text-xs text-on-surface-subtle font-bold tracking-wider">
              {t("booking_code")}: <span className="select-all text-on-surface">{booking.booking_code}</span>
            </span>
            <div className="flex items-center gap-2">
              <Badge 
                variant={bookingBadge.variant} 
                className={cn("text-[10px] font-bold py-0.5", bookingBadge.className)}
              >
                {bookingBadge.text}
              </Badge>
              <Badge 
                variant={paymentBadge.variant} 
                className="text-[10px] font-bold py-0.5"
              >
                {paymentBadge.text}
              </Badge>
            </div>
          </div>

          {/* Tour Title Link */}
          <h4 className="mb-4 line-clamp-2 pr-2 text-lg font-bold text-on-surface transition-colors hover:text-primary">
            {tour ? (
              <Link href={`/tours/${tour.slug}`}>
                {tourName}
              </Link>
            ) : (
              <span>{tourName}</span>
            )}
          </h4>

          {/* Middle Row: Info Grid */}
          <div className="mb-5 grid grid-cols-1 gap-x-4 gap-y-3 font-mono text-[12px] text-on-surface-subtle sm:grid-cols-2 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-subtle uppercase font-semibold">{t("travel_date")}</span>
                <span className="font-medium text-on-surface">{travelDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-subtle uppercase font-semibold">{t("quantity")}</span>
                <span className="font-medium text-on-surface">
                  {totalGuests} {t("quantity").toLowerCase()}
                  <span className="text-[10px] text-on-surface-subtle ml-1">
                    ({item?.quantity_adult || 0}A / {item?.quantity_child || 0}C / {item?.quantity_infant || 0}I)
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:col-span-2 md:col-span-1">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-subtle uppercase font-semibold">{t("booked_date")}</span>
                <span className="font-medium text-on-surface">{bookedDate}</span>
              </div>
            </div>
          </div>

          {/* Cancellation reason if cancelled */}
          {booking.booking_status === "cancelled" && booking.cancellation_reason && (
            <div className="mb-5 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs leading-relaxed text-red-600">
              <InfoCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{t("cancel_reason_label")}: </span>
                <span>{booking.cancellation_reason}</span>
              </div>
            </div>
          )}

          {/* Bottom Row: Total Price & Actions */}
          <div className="mt-auto border-t border-border/60 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Price */}
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-subtle uppercase font-semibold tracking-wider">
                {t("total_amount")}
              </span>
              <span className="text-xl font-bold text-primary">
                {formatNumber(Number(booking.final_amount))}đ
              </span>
            </div>

            {/* Actions Panel */}
            <div className="flex items-center gap-2 flex-wrap sm:justify-end">
              {/* Detail view */}
              <Link 
                href={`/profile/bookings/code/${booking.booking_code}`}
                className={cn(
                  "inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-[#f7f7f7]",
                  "px-4 py-2.5 text-xs font-semibold text-on-surface transition-all duration-300",
                  "hover:border-primary/50 hover:bg-primary/10 hover:text-primary active:scale-95"
                )}
              >
                {t("action_detail")}
              </Link>

              {/* Cancel Button */}
              {canCancel && (
                <button
                  onClick={() => onCancelClick(booking)}
                  className={cn(
                    "inline-flex shrink-0 items-center justify-center rounded-full border border-red-500/20 bg-red-500/5",
                    "px-4 py-2.5 text-xs font-semibold text-red-400 transition-all duration-300",
                    "hover:border-red-500/50 hover:bg-red-500/10 active:scale-95"
                  )}
                >
                  {t("action_cancel")}
                </button>
              )}

              {/* Rebook Button */}
              {tour && (booking.booking_status === "cancelled" || booking.booking_status === "completed") && (
                <Link
                  href={`/tours/${tour.slug}#booking-cta`}
                  className={cn(
                    "inline-flex shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5",
                    "px-4 py-2.5 text-xs font-semibold text-primary transition-all duration-300",
                    "hover:border-primary hover:bg-primary/10 active:scale-95"
                  )}
                >
                  {t("action_rebook")}
                </Link>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
