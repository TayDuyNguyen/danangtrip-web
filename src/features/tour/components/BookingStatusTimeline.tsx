"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { CheckCircle2, Clock, X } from "@/components/icons/solar";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types";

interface BookingStatusTimelineProps {
  booking: Booking;
}

export function BookingStatusTimeline({ booking }: BookingStatusTimelineProps) {
  const t = useTranslations("tour.history");
  const locale = useLocale();

  const item = booking.booking_items?.[0] || booking.items?.[0];
  const travelDateStr = item?.travel_date;

  const formatDateString = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  const formatOnlyDateString = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(dateStr));
  };

  const isCancelled = booking.booking_status === "cancelled";
  
  // Mốc 1: Đặt tour (Booked)
  const stepBooked = {
    title: t("status_booked"),
    time: formatDateString(booking.booked_at),
    status: "completed" as const,
  };

  // Mốc 2: Xác nhận / Hủy
  let stepConfirm = {
    title: t("status_confirmed"),
    time: booking.confirmed_at ? formatDateString(booking.confirmed_at) : "",
    status: (booking.confirmed_at ? "completed" : "active") as "completed" | "active" | "pending" | "cancelled",
  };

  if (isCancelled) {
    stepConfirm = {
      title: t("status_cancelled_label"),
      time: booking.cancelled_at ? formatDateString(booking.cancelled_at) : formatDateString(booking.booked_at),
      status: "cancelled" as const,
    };
  }

  // Mốc 3: Khởi hành
  const [isPastTravelDate] = useState(() => {
    return travelDateStr ? new Date(travelDateStr).getTime() < Date.now() : false;
  });
  const stepDeparture = {
    title: t("status_departure"),
    time: travelDateStr ? formatOnlyDateString(travelDateStr) : "",
    status: "pending" as "completed" | "active" | "pending" | "cancelled",
  };

  if (isCancelled) {
    stepDeparture.status = "pending";
  } else if (booking.booking_status === "completed") {
    stepDeparture.status = "completed";
  } else if (booking.booking_status === "confirmed") {
    stepDeparture.status = isPastTravelDate ? "completed" : "active";
  }

  // Mốc 4: Hoàn thành
  const stepCompleted = {
    title: t("status_completed"),
    time: booking.completed_at ? formatDateString(booking.completed_at) : "",
    status: "pending" as "completed" | "active" | "pending" | "cancelled",
  };

  if (isCancelled) {
    stepCompleted.status = "pending";
  } else if (booking.booking_status === "completed") {
    stepCompleted.status = "completed";
  }

  const steps = [
    { ...stepBooked, id: 1 },
    { ...stepConfirm, id: 2 },
    { ...stepDeparture, id: 3 },
    { ...stepCompleted, id: 4 },
  ];

  return (
    <div className="w-full rounded-2xl bg-surface border border-border p-5 md:p-6 reveal-up">
      <h3 className="text-sm font-black text-white uppercase tracking-wider mb-8 flex items-center gap-2">
        <Clock className="w-4.5 h-4.5 text-primary shrink-0" />
        {t("section_timeline")}
      </h3>

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-4 md:px-4">
        {/* Connecting line (Desktop) */}
        <div className="absolute hidden md:block top-[22px] left-[5%] right-[5%] h-[2px] bg-border z-0" />
        
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          const isFirst = idx === 0;

          // CSS properties based on status
          let stepColorClass = "";
          let icon = null;

          switch (step.status) {
            case "completed":
              stepColorClass = "bg-primary text-white border-primary shadow-[0_0_12px_rgba(139,106,85,0.3)]";
              icon = <CheckCircle2 className="w-5 h-5" />;
              break;
            case "cancelled":
              stepColorClass = "bg-red-500 text-white border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]";
              icon = <X className="w-5 h-5" />;
              break;
            case "active":
              stepColorClass = "bg-surface text-primary border-primary shadow-[0_0_12px_rgba(139,106,85,0.15)] animate-pulse";
              icon = <Clock className="w-5 h-5 text-primary animate-spin" style={{ animationDuration: '6s' }} />;
              break;
            case "pending":
            default:
              stepColorClass = "bg-surface-container-high text-on-surface-subtle border-border";
              icon = <span className="text-xs font-bold">{step.id}</span>;
              break;
          }

          return (
            <div
              key={step.id}
              className={cn(
                "relative z-10 flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-3 flex-1",
                isFirst && "md:items-start",
                isLast && "md:items-end"
              )}
            >
              {/* Connecting line (Mobile) */}
              {!isLast && (
                <div className="absolute md:hidden left-[22px] top-[44px] w-[2px] h-[calc(100%+32px)] bg-border z-0" />
              )}

              {/* Circle Step */}
              <div
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center border font-bold transition-all duration-500 shrink-0",
                  stepColorClass
                )}
              >
                {icon}
              </div>

              {/* Step Info */}
              <div className={cn(
                "flex flex-col md:items-center text-left md:text-center min-w-0 md:max-w-[140px]",
                isFirst && "md:items-start md:text-left",
                isLast && "md:items-end md:text-right"
              )}>
                <span
                  className={cn(
                    "text-xs font-black uppercase tracking-wider",
                    step.status === "completed" || step.status === "active" ? "text-white" : "text-on-surface-subtle",
                    step.status === "cancelled" && "text-red-400 font-bold"
                  )}
                >
                  {step.title}
                </span>
                {step.time ? (
                  <span className="text-[10px] text-on-surface-variant font-mono mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis w-full">
                    {step.time}
                  </span>
                ) : (
                  <span className="text-[10px] text-on-surface-variant font-mono mt-0.5">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
