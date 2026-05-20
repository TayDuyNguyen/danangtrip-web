"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import { formatNumber } from "@/utils/format";
import { Calendar, Users, InfoCircle } from "@/components/icons/solar";
import { Button } from "@/components/ui";
import { useTourSchedules, useCheckTourAvailability } from "@/features/tour/hooks/useTourDetail";

interface BookingSidebarProps {
  tour: {
    id: number;
    slug: string;
    price_adult: string;
    price_child: string;
    price_infant: string;
    discount_percent: number;
  };
}

export default function BookingSidebar({ tour }: BookingSidebarProps) {
  const t = useTranslations("tour");
  const td = useTranslations("tour.detail");
  const locale = useLocale();
  
  const discountPercent = tour.discount_percent;
  const adultPrice = parseFloat(tour.price_adult);
  const adultDiscounted = adultPrice * (1 - discountPercent / 100);
  const suffix = td("per_person");

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | "">("");
  const dateFormatter = new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US");

  const { data: schedules = [], isLoading: loadingSchedules } = useTourSchedules(tour.id);
  const { mutate: checkAvailability, data: availability, isPending: checking } = useCheckTourAvailability(tour.id);

  useEffect(() => {
    if (selectedScheduleId !== "") {
      checkAvailability({
        schedule_id: Number(selectedScheduleId),
        quantity_adult: adults,
        quantity_child: children,
      });
    }
  }, [selectedScheduleId, adults, children, checkAvailability]);

  // Calculate total price
  const totalAmount = (adults * adultDiscounted) + (children * parseFloat(tour.price_child));

  return (
    <div
      id="booking-cta"
      className="sticky top-28 space-y-6 reveal-up"
      style={{ animationDelay: "150ms" }}
    >
      <div className="glass-shell shadow-2xl">
        <div className="glass-inner bg-surface-container-low p-6 md:p-8 space-y-6">
          {/* Price Header */}
          <div>
            <p className="text-[10px] font-bold text-on-surface-subtle uppercase tracking-widest mb-2">
              {t("card.starting_from")}
            </p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-4xl font-black text-primary">
                {formatNumber(adultDiscounted)}đ
              </span>
              {discountPercent > 0 && (
                <span className="text-sm text-on-surface-subtle line-through">
                  {formatNumber(adultPrice)}đ
                </span>
              )}
            </div>
            <span className="text-xs text-on-surface-variant">{suffix}</span>
          </div>

          {/* Booking Info Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-subtle uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {t("filters.departure_date")}
              </label>
              <select 
                value={selectedScheduleId}
                onChange={(e) => setSelectedScheduleId(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-surface-container border border-border rounded-lg px-4 py-3 text-sm text-on-surface-variant focus:border-primary/50 outline-none transition-colors"
                disabled={loadingSchedules}
                aria-label={td("select_date")}
              >
                <option value="">{td("select_date")}</option>
                {schedules.map((schedule) => (
                  <option
                    key={schedule.id}
                    value={schedule.id}
                    disabled={schedule.status !== "available" || schedule.booking_availability === "sold_out"}
                  >
                    {dateFormatter.format(new Date(schedule.start_date))}{" "}
                    {schedule.booking_availability === "sold_out" ? `(${td("schedule_full")})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-subtle uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                {td("stats_group")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container border border-border rounded-lg px-4 py-2 text-sm flex items-center justify-between">
                  <span className="text-on-surface-variant">{td("adults_short")}</span>
                  <input 
                    type="number" 
                    min={1} 
                    max={10} 
                    value={adults} 
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-12 bg-transparent text-right outline-none"
                    aria-label={td("adults_short")}
                  />
                </div>
                <div className="bg-surface-container border border-border rounded-lg px-4 py-2 text-sm flex items-center justify-between">
                  <span className="text-on-surface-variant">{td("children_short")}</span>
                  <input 
                    type="number" 
                    min={0} 
                    max={10} 
                    value={children} 
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-12 bg-transparent text-right outline-none"
                    aria-label={td("children_short")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Availability Status */}
          {selectedScheduleId !== "" && availability && (
            <div className={`p-3 rounded-lg text-sm ${availability.is_available ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
              {checking ? (
                <span>{td("availability_checking")}</span>
              ) : availability.is_available ? (
                <span>{td("availability_seats_left", { seats: availability.available_seats })}</span>
              ) : (
                <span>{td("availability_not_enough", { seats: availability.available_seats })}</span>
              )}
            </div>
          )}

          {/* Detailed Pricing */}
          <div className="space-y-3 text-sm border-t border-border pt-6">
            <div className="flex justify-between gap-4 text-on-surface-subtle">
              <span className="flex items-center gap-1.5">
                {adults} x {td("price_adult")}
              </span>
              <span className="text-on-surface font-medium tabular-nums">
                {formatNumber(adults * adultDiscounted)}đ
              </span>
            </div>
            {children > 0 && (
              <div className="flex justify-between gap-4 text-on-surface-subtle">
                <span className="flex items-center gap-1.5">
                  {children} x {td("price_child")}
                </span>
                <span className="text-on-surface font-medium tabular-nums">
                  {formatNumber(children * parseFloat(tour.price_child))}đ
                </span>
              </div>
            )}
            <div className="flex justify-between gap-4 font-bold text-lg pt-2 border-t border-border">
              <span className="text-on-surface">{td("booking_total")}</span>
              <span className="text-primary">{formatNumber(totalAmount)}đ</span>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href={`/tours/${tour.slug}/book${selectedScheduleId ? `?tour_schedule_id=${selectedScheduleId}&adults=${adults}&children=${children}` : ""}`}
            className="block"
          >
            <Button 
              disabled={!availability?.is_available && selectedScheduleId !== ""}
              className="w-full h-14 text-base font-bold uppercase tracking-wider shadow-[0_10px_20px_-10px_rgba(139,106,85,0.5)] disabled:opacity-50"
            >
              {t("card.book_now")}
            </Button>
          </Link>

          <p className="text-[11px] text-on-surface-variant leading-relaxed text-center italic">
            {td("book_cta_hint")}
          </p>
        </div>
      </div>

      {/* Support Card */}
      <div className="glass-surface rounded-xl p-6 flex items-center gap-4 border-primary/20">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <InfoCircle className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-on-surface">{td("support_title")}</p>
          <p className="text-xs text-on-surface-variant">{td("support_desc")}</p>
        </div>
      </div>
    </div>
  );
}
