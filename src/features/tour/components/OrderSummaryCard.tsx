"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { formatPriceVND } from "@/utils/format";
import { cn } from "@/utils/string";
import { InfoCircle, Calendar, MapPin } from "@/components/icons/solar";
import type { Tour, BookingCalculation, TourSchedule } from "@/types";
import { format } from "date-fns";
import { normalizeImageUrl } from "@/features/tour/utils/tour-mapper";

interface OrderSummaryCardProps {
  tour: Tour;
  selectedSchedule?: TourSchedule;
  adults: number;
  childrenCount: number;
  infants: number;
  calculation?: BookingCalculation;
  isLoading?: boolean;
}

export function OrderSummaryCard({
  tour,
  selectedSchedule,
  adults,
  childrenCount,
  infants,
  calculation,
  isLoading
}: OrderSummaryCardProps) {
  const t = useTranslations("tour.booking");
  const td = useTranslations("tour.detail");
  const [imageSrc, setImageSrc] = useState(
    normalizeImageUrl(tour.thumbnail) || "/images/placeholder.png"
  );

  return (
    <aside className="w-full lg:w-[380px]">
      <div className="sticky top-28 rounded-[28px] border border-border bg-white shadow-[0_24px_70px_rgba(15,23,42,0.1)]">
        <div className="space-y-6 p-6">
          {/* Tour Brief */}
          <div className="flex gap-4 pb-5 border-b border-border/50">
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-border/30 bg-[#f7f7f7]">
                <Image
                  src={imageSrc}
                  alt={tour.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  onError={() => setImageSrc("/images/placeholder.png")}
                />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <h3 className="text-sm font-black text-on-surface line-clamp-2 leading-snug uppercase tracking-tight">
                {tour.name}
              </h3>
              <div className="mt-2 flex items-center gap-1.5 text-on-surface-subtle text-[11px] font-bold">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {td("location_short")}
              </div>
            </div>
          </div>

          {/* Selection Details */}
          <div className="space-y-4 py-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-on-surface-subtle font-bold uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {t("order_summary")}
              </span>
            </div>

            <div className="space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-subtle">{td("select_date")}</span>
                    <span className="text-on-surface font-black tabular-nums">
                        {selectedSchedule ? format(new Date(selectedSchedule.start_date), "dd/MM/yyyy") : "---"}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-subtle">{td("price_adult")}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-on-surface font-black tabular-nums">× {adults}</span>
                      {calculation?.breakdown?.adult && (
                        <span className="text-[10px] text-on-surface-subtle">
                          {formatPriceVND(calculation.breakdown.adult.subtotal)}
                        </span>
                      )}
                    </div>
                </div>
                {childrenCount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-on-surface-subtle">{td("price_child")}</span>
                        <div className="flex flex-col items-end">
                          <span className="text-on-surface font-black tabular-nums">× {childrenCount}</span>
                          {calculation?.breakdown?.child && (
                            <span className="text-[10px] text-on-surface-subtle">
                              {formatPriceVND(calculation.breakdown.child.subtotal)}
                            </span>
                          )}
                        </div>
                    </div>
                )}
                {infants > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-on-surface-subtle">{td("price_infant")}</span>
                        <div className="flex flex-col items-end">
                          <span className="text-on-surface font-black tabular-nums">× {infants}</span>
                          {calculation?.breakdown?.infant && (
                            <span className="text-[10px] text-on-surface-subtle">
                              {formatPriceVND(calculation.breakdown.infant.subtotal)}
                            </span>
                          )}
                        </div>
                    </div>
                )}
            </div>
          </div>

          {/* Pricing */}
          <div className={cn(
              "rounded-2xl border border-border bg-[#f7f7f7] p-4 space-y-3 transition-opacity duration-300",
              isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
          )}>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black text-on-surface-subtle uppercase tracking-widest">
                {t("order_summary")}
              </span>
              {isLoading && (
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
            </div>
            
            <div className="pt-2 border-t border-border/30 flex justify-between items-end">
              <span className="text-xs font-bold text-on-surface uppercase">{td("booking_total")}</span>
              <div className="text-right">
                <div className="text-2xl font-black text-primary tabular-nums">
                  {calculation ? formatPriceVND(calculation.final_amount) : "---"}
                </div>
              </div>
            </div>
          </div>

          {/* Policy */}
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex gap-3">
            <InfoCircle className="w-5 h-5 text-orange-500 shrink-0" />
            <div className="flex flex-col gap-1">
                <p className="text-[11px] font-black text-orange-500 uppercase tracking-tighter">
                    {t("cancellation_policy")}
                </p>
                <p className="text-[11px] text-orange-400 leading-relaxed font-medium">
                    {t("cancellation_note")}
                </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
