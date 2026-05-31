"use client";

import { useState, useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { formatNumber } from "@/utils/format";
import { Calendar, Users, InfoCircle } from "@/components/icons/solar";
import { Button, Select, type SelectOption } from "@/components/ui";
import { useTourSchedules, useCheckTourAvailability } from "@/features/tour/hooks/useTourDetail";
import { useAddToCart } from "@/features/cart/hooks/useCartQueries";
import type { Tour } from "@/types";

interface BookingSidebarProps {
  tour: Tour;
}

export default function BookingSidebar({ tour }: BookingSidebarProps) {
  const t = useTranslations("tour");
  const td = useTranslations("tour.detail");
  const tb = useTranslations("tour.booking");
  const locale = useLocale();

  const discountPercent = tour.discount_percent;
  const adultPrice = parseFloat(tour.price_adult);
  const adultDiscounted = adultPrice * (1 - discountPercent / 100);
  const suffix = td("per_person");

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | "">("");
  const [showDateTooltip, setShowDateTooltip] = useState(false);

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US"),
    [locale]
  );

  const { data: schedules = [], isLoading: loadingSchedules } = useTourSchedules(tour.id);
  const { mutate: checkAvailability, data: availability, isPending: checking } = useCheckTourAvailability(tour.id);
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();

  const scheduleOptions = useMemo(
    () =>
      schedules.map((schedule) => ({
        value: schedule.id,
        label: `${dateFormatter.format(new Date(schedule.start_date))}${
          schedule.booking_availability === "sold_out" ? ` (${td("schedule_full")})` : ""
        }`,
        isDisabled: schedule.status !== "available" || schedule.booking_availability === "sold_out",
      })),
    [schedules, dateFormatter, td]
  );

  const selectedOption = useMemo(
    () => scheduleOptions.find((option) => option.value === selectedScheduleId) || null,
    [scheduleOptions, selectedScheduleId]
  );

  const handleScheduleChange = (option: SelectOption | null) => {
    setSelectedScheduleId(option ? Number(option.value) : "");
  };

  useEffect(() => {
    if (selectedScheduleId === "") return;

    checkAvailability({
      schedule_id: Number(selectedScheduleId),
      quantity_adult: adults,
      quantity_child: children,
    });
  }, [selectedScheduleId, adults, children, checkAvailability]);

  const handleAddToCart = () => {
    if (selectedScheduleId === "") return;

    const selectedSchedule = schedules.find((schedule) => schedule.id === Number(selectedScheduleId));

    addToCart(
      {
        tour_id: tour.id,
        tour_schedule_id: Number(selectedScheduleId),
        quantity_adult: adults,
        quantity_child: children,
        quantity_infant: 0,
        tour,
        tour_schedule: selectedSchedule,
      },
      {
        onSuccess: () => {
          toast.success(tb("add_to_cart_success"));
        },
      }
    );
  };

  const totalAmount = adults * adultDiscounted + children * parseFloat(tour.price_child);

  return (
    <div id="booking-cta" className="sticky top-28 space-y-6 reveal-up" style={{ animationDelay: "150ms" }}>
      <div className="rounded-[28px] border border-border bg-white shadow-[0_24px_70px_rgba(15,23,42,0.1)]">
        <div className="space-y-6 p-6 md:p-8">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-subtle">
              {t("card.starting_from")}
            </p>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-4xl font-black text-primary">{formatNumber(adultDiscounted)}đ</span>
              {discountPercent > 0 && (
                <span className="text-sm line-through text-on-surface-subtle">{formatNumber(adultPrice)}đ</span>
              )}
            </div>
            <span className="text-xs text-on-surface-subtle">{suffix}</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-subtle">
                <Calendar className="h-4 w-4 text-primary" />
                {t("filters.departure_date")}
              </label>
              <Select
                options={scheduleOptions}
                value={selectedOption}
                onChange={handleScheduleChange}
                isDisabled={loadingSchedules}
                isLoading={checking}
                placeholder={td("select_date")}
                variant="minimal"
                containerClassName="rounded-2xl border border-border bg-[#f7f7f7] px-3 py-1"
                className="bg-transparent text-sm font-medium text-on-surface"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-subtle">
                <Users className="h-4 w-4 text-primary" />
                {td("stats_group")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between rounded-2xl border border-border bg-[#f7f7f7] px-4 py-2 text-sm">
                  <span className="text-on-surface-subtle">{td("adults_short")}</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={adults}
                    onChange={(event) => setAdults(Number(event.target.value))}
                    className="w-12 bg-transparent text-right font-semibold text-on-surface outline-none"
                    aria-label={td("adults_short")}
                  />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-border bg-[#f7f7f7] px-4 py-2 text-sm">
                  <span className="text-on-surface-subtle">{td("children_short")}</span>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={children}
                    onChange={(event) => setChildren(Number(event.target.value))}
                    className="w-12 bg-transparent text-right font-semibold text-on-surface outline-none"
                    aria-label={td("children_short")}
                  />
                </div>
              </div>
            </div>
          </div>

          {selectedScheduleId !== "" && (checking || availability) && (
            <div
              className={`rounded-lg p-3 text-sm ${
                checking
                  ? "border border-border bg-[#f7f7f7] text-on-surface-subtle"
                  : availability?.is_available
                    ? "bg-green-500/10 text-green-600"
                    : "bg-red-500/10 text-red-600"
              }`}
            >
              {checking ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  {td("availability_checking") || "Đang kiểm tra chỗ..."}
                </span>
              ) : availability?.is_available ? (
                <span>{td("availability_seats_left", { seats: availability.available_seats })}</span>
              ) : (
                <span>{td("availability_not_enough", { seats: availability?.available_seats ?? 0 })}</span>
              )}
            </div>
          )}

          <div className="space-y-3 border-t border-border pt-6 text-sm">
            <div className="flex justify-between gap-4 text-on-surface-subtle">
              <span className="flex items-center gap-1.5">
                {adults} x {td("price_adult")}
              </span>
              <span className="font-medium tabular-nums text-on-surface">{formatNumber(adults * adultDiscounted)}đ</span>
            </div>

            {children > 0 && (
              <div className="flex justify-between gap-4 text-on-surface-subtle">
                <span className="flex items-center gap-1.5">
                  {children} x {td("price_child")}
                </span>
                <span className="font-medium tabular-nums text-on-surface">
                  {formatNumber(children * parseFloat(tour.price_child))}đ
                </span>
              </div>
            )}

            <div className="flex justify-between gap-4 border-t border-border pt-2 text-lg font-bold">
              <span className="text-on-surface">{td("booking_total")}</span>
              <span className="text-primary">{formatNumber(totalAmount)}đ</span>
            </div>
          </div>

          <div
            className="relative space-y-3"
            onMouseEnter={() => {
              if (selectedScheduleId === "") {
                setShowDateTooltip(true);
              }
            }}
            onMouseLeave={() => setShowDateTooltip(false)}
          >
            {showDateTooltip && (
              <div className="absolute bottom-full left-1/2 z-10 mb-3 flex -translate-x-1/2 animate-in items-center justify-center whitespace-nowrap rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-bold text-on-surface shadow-xl duration-200 fade-in slide-in-from-bottom-1">
                {locale === "vi" ? "Vui lòng chọn ngày khởi hành" : "Please select departure date"}
                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-white" />
              </div>
            )}

            <Link
              href={`/tours/${tour.slug}/book${selectedScheduleId ? `?tour_schedule_id=${selectedScheduleId}&adults=${adults}&children=${children}` : ""}`}
              className="block"
              onClick={(event) => {
                if (selectedScheduleId === "") {
                  event.preventDefault();
                }
              }}
            >
              <Button
                disabled={(!availability?.is_available && selectedScheduleId !== "") || selectedScheduleId === ""}
                className="h-14 w-full text-base font-bold uppercase tracking-wider shadow-[0_10px_20px_-10px_rgba(139,106,85,0.5)] disabled:opacity-50"
              >
                {t("card.book_now")}
              </Button>
            </Link>

            <Button
              type="button"
              variant="secondary"
              disabled={(!availability?.is_available && selectedScheduleId !== "") || selectedScheduleId === "" || addingToCart}
              onClick={handleAddToCart}
              className="h-12 w-full border-border text-sm font-bold uppercase tracking-wider text-primary hover:border-primary hover:bg-primary/10 hover:text-primary"
            >
              {tb("add_to_cart")}
            </Button>
          </div>

          <p className="text-center text-[11px] italic leading-relaxed text-on-surface-subtle">{td("book_cta_hint")}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-[24px] border border-border bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.07)]">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <InfoCircle className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-on-surface">{td("support_title")}</p>
          <p className="text-xs text-on-surface-subtle">{td("support_desc")}</p>
        </div>
      </div>
    </div>
  );
}
