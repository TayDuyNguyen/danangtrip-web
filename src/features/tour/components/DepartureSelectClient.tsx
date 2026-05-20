"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui";
import { ScheduleCalendar } from "./ScheduleCalendar";
import { QuantityCounter } from "./QuantityCounter";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { useTourSchedules, useCheckTourAvailability } from "../hooks/useTourDetail";
import { useBookingCalculate } from "../hooks/useBookingQueries";
import { departureSelectSchema } from "../validators/departure-select.schema";
import type { Tour } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";

interface Props {
  tour: Tour;
}

export default function DepartureSelectClient({ tour }: Props) {
  const t = useTranslations("tour");
  const router = useRouter();

  const { data: schedules = [], isLoading: isLoadingSchedules, error: schedulesError, refetch: refetchSchedules } = useTourSchedules(tour.id);

  const [tour_schedule_id, setTourScheduleId] = useState<number | undefined>();
  const [quantity_adult, setQuantityAdult] = useState(1);
  const [quantity_child, setQuantityChild] = useState(0);
  const [quantity_infant, setQuantityInfant] = useState(0);

  const selectedSchedule = useMemo(
    () => schedules.find((s) => s.id === tour_schedule_id),
    [schedules, tour_schedule_id]
  );

  const params = useMemo(() => ({
    tour_id: tour.id,
    tour_schedule_id,
    quantity_adult,
    quantity_child,
    quantity_infant
  }), [tour.id, tour_schedule_id, quantity_adult, quantity_child, quantity_infant]);

  const debouncedParams = useDebounce(params, 500);

  // Queries
  const { 
    mutate: calculate, 
    data: calculation, 
    isPending: isCalculating,
    error: calculateError 
  } = useBookingCalculate();

  const {
    mutate: checkAvailability,
    data: availability,
    isPending: isCheckingAvailability,
    error: availabilityError
  } = useCheckTourAvailability(tour.id);

  // Effects to trigger API calls
  useEffect(() => {
    if (debouncedParams.tour_schedule_id) {
      calculate({
        tour_id: debouncedParams.tour_id,
        tour_schedule_id: debouncedParams.tour_schedule_id,
        quantity_adult: debouncedParams.quantity_adult,
        quantity_child: debouncedParams.quantity_child,
        quantity_infant: debouncedParams.quantity_infant
      });

      checkAvailability({
        schedule_id: debouncedParams.tour_schedule_id, // API expects schedule_id
        quantity_adult: debouncedParams.quantity_adult,
        quantity_child: debouncedParams.quantity_child,
        quantity_infant: debouncedParams.quantity_infant
      });
    }
  }, [debouncedParams, calculate, checkAvailability]);

  const isOverCapacity = availability?.is_available === false;
  const availableSeats = availability?.available_seats ?? (selectedSchedule ? selectedSchedule.max_people - selectedSchedule.booked_people : 0);

  const handleContinue = () => {
    const result = departureSelectSchema.safeParse({
      tour_schedule_id,
      quantity_adult,
      quantity_child,
      quantity_infant,
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message || t("detail.error_desc"));
      return;
    }

    if (isOverCapacity) {
      toast.error(t("departures.over_capacity") || "Vượt quá số chỗ trống!");
      return;
    }

    const params = new URLSearchParams();
    params.set("tour_schedule_id", result.data.tour_schedule_id.toString());
    params.set("adults", result.data.quantity_adult.toString());
    params.set("children", result.data.quantity_child.toString());
    params.set("infants", result.data.quantity_infant.toString());

    router.push(`/tours/${tour.slug}/book?${params.toString()}`);
  };

  const isContinueDisabled = !tour_schedule_id || isOverCapacity || isCalculating || isCheckingAvailability;

  if (schedulesError) {
    return (
      <div className="design-page min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center space-y-4">
          <p className="text-on-surface-subtle">{t("detail.error_desc")}</p>
          <Button onClick={() => refetchSchedules()}>{t("common.retry") || "Thử lại"}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="design-page min-h-screen pb-20 bg-surface">
      <div className="design-container pt-28 md:pt-32">
        <div className="mb-8 reveal-up">
          <h1 className="text-3xl md:text-4xl font-black text-on-surface tracking-tight uppercase">
            {t("departures.title")}
          </h1>
          <p className="text-on-surface-subtle mt-2">
            {tour.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-8 space-y-12">
            {/* Lịch khởi hành */}
            <section className="space-y-6 reveal-up" style={{ animationDelay: "100ms" }}>
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">1</span>
                {t("departures.select_date")}
              </h2>
              {isLoadingSchedules ? (
                <div className="h-[400px] w-full bg-surface-container-low animate-pulse rounded-xl" />
              ) : schedules.length === 0 ? (
                <div className="h-[200px] w-full border border-dashed border-border rounded-xl flex items-center justify-center text-on-surface-subtle">
                  {t("departures.no_schedules") || "Không có lịch khởi hành nào khả dụng."}
                </div>
              ) : (
                <ScheduleCalendar 
                  schedules={schedules}
                  selectedId={tour_schedule_id}
                  onSelect={setTourScheduleId}
                />
              )}
            </section>

            {/* Số lượng khách */}
            <section className="space-y-6 reveal-up" style={{ animationDelay: "200ms" }}>
              <div className="flex justify-between items-end">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">2</span>
                  {t("departures.passengers")}
                </h2>
                {isOverCapacity && (
                  <span className="text-sm font-bold text-error animate-pulse">
                    Vượt quá số chỗ trống! (Còn {availableSeats} chỗ)
                  </span>
                )}
              </div>
              <div className="glass-surface p-6 rounded-xl space-y-2">
                <QuantityCounter 
                  label={t("detail.price_adult")}
                  value={quantity_adult}
                  onChange={setQuantityAdult}
                  min={1}
                  max={Math.max(quantity_adult, availableSeats)}
                />
                <QuantityCounter 
                  label={t("detail.price_child")}
                  value={quantity_child}
                  onChange={setQuantityChild}
                  min={0}
                  max={Math.max(quantity_child, availableSeats)}
                />
                <QuantityCounter 
                  label={t("detail.price_infant")}
                  value={quantity_infant}
                  onChange={setQuantityInfant}
                  min={0}
                  max={Math.max(quantity_infant, availableSeats)}
                />
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 reveal-up" style={{ animationDelay: "300ms" }}>
            <OrderSummaryCard 
              tour={tour}
              selectedSchedule={selectedSchedule}
              adults={quantity_adult}
              childrenCount={quantity_child}
              infants={quantity_infant}
              calculation={calculation}
              isLoading={isCalculating}
            />

            {(calculateError || availabilityError) && (
              <p className="text-xs text-error mt-2">
                {t("departures.calc_error") || "Lỗi khi cập nhật giá hoặc chỗ trống."}
              </p>
            )}

            <div className="mt-6">
              <Button 
                onClick={handleContinue}
                disabled={isContinueDisabled}
                className="w-full h-14 text-base font-bold uppercase tracking-wider shadow-[0_10px_20px_-10px_rgba(139,106,85,0.5)] disabled:opacity-50"
              >
                {t("departures.continue")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
