"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui";
import type { Tour } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { ScheduleCalendar } from "./ScheduleCalendar";
import { QuantityCounter } from "./QuantityCounter";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { useTourSchedules, useCheckTourAvailability } from "../hooks/useTourDetail";
import { useBookingCalculate } from "../hooks/useBookingQueries";
import { departureSelectSchema } from "../validators/departure-select.schema";

interface Props {
  tour: Tour;
}

export default function DepartureSelectClient({ tour }: Props) {
  const t = useTranslations("tour");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const {
    data: schedules = [],
    isLoading: isLoadingSchedules,
    error: schedulesError,
    refetch: refetchSchedules,
  } = useTourSchedules(tour.id);

  const [tour_schedule_id, setTourScheduleId] = useState<number | undefined>();
  const [quantity_adult, setQuantityAdult] = useState(1);
  const [quantity_child, setQuantityChild] = useState(0);
  const [quantity_infant, setQuantityInfant] = useState(0);

  const selectedSchedule = useMemo(
    () => schedules.find((schedule) => schedule.id === tour_schedule_id),
    [schedules, tour_schedule_id]
  );

  const params = useMemo(
    () => ({
      tour_id: tour.id,
      tour_schedule_id,
      quantity_adult,
      quantity_child,
      quantity_infant,
    }),
    [tour.id, tour_schedule_id, quantity_adult, quantity_child, quantity_infant]
  );

  const debouncedParams = useDebounce(params, 500);

  const {
    mutate: calculate,
    data: calculation,
    isPending: isCalculating,
    error: calculateError,
  } = useBookingCalculate();

  const {
    mutate: checkAvailability,
    data: availability,
    isPending: isCheckingAvailability,
    error: availabilityError,
  } = useCheckTourAvailability(tour.id);

  useEffect(() => {
    if (!debouncedParams.tour_schedule_id) return;

    calculate({
      tour_id: debouncedParams.tour_id,
      tour_schedule_id: debouncedParams.tour_schedule_id,
      quantity_adult: debouncedParams.quantity_adult,
      quantity_child: debouncedParams.quantity_child,
      quantity_infant: debouncedParams.quantity_infant,
    });

    checkAvailability({
      schedule_id: debouncedParams.tour_schedule_id,
      quantity_adult: debouncedParams.quantity_adult,
      quantity_child: debouncedParams.quantity_child,
      quantity_infant: debouncedParams.quantity_infant,
    });
  }, [debouncedParams, calculate, checkAvailability]);

  const isOverCapacity = availability?.is_available === false;
  const availableSeats =
    availability?.available_seats ??
    (selectedSchedule ? selectedSchedule.max_people - selectedSchedule.booked_people : 0);

  const handleContinue = () => {
    const result = departureSelectSchema.safeParse({
      tour_schedule_id,
      quantity_adult,
      quantity_child,
      quantity_infant,
    });

    if (!result.success) {
      const issueMessage = result.error.issues[0]?.message;
      toast.error(issueMessage ? t(issueMessage) : t("detail.error_desc"));
      return;
    }

    if (isOverCapacity) {
      toast.error(t("departures.over_capacity"));
      return;
    }

    const nextParams = new URLSearchParams();
    nextParams.set("tour_schedule_id", result.data.tour_schedule_id.toString());
    nextParams.set("adults", result.data.quantity_adult.toString());
    nextParams.set("children", result.data.quantity_child.toString());
    nextParams.set("infants", result.data.quantity_infant.toString());

    router.push(`/tours/${tour.slug}/book?${nextParams.toString()}`);
  };

  const isContinueDisabled = !tour_schedule_id || isOverCapacity || isCalculating || isCheckingAvailability;

  if (schedulesError) {
    return (
      <div className="design-page flex min-h-screen items-center justify-center bg-surface">
        <div className="space-y-4 text-center">
          <p className="text-on-surface-subtle">{t("detail.error_desc")}</p>
          <Button onClick={() => refetchSchedules()}>{tCommon("error.retry")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="design-page min-h-screen bg-surface pb-20">
      <div className="design-container pt-28 md:pt-32">
        <div className="reveal-up mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tight text-on-surface md:text-4xl">
            {t("departures.title")}
          </h1>
          <p className="mt-2 text-on-surface-subtle">{tour.name}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-6">
          <div className="space-y-6 lg:col-span-8">
            <section className="reveal-up space-y-6" style={{ animationDelay: "100ms" }}>
              <h2 className="flex items-center gap-2 text-xl font-bold text-on-surface">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm text-primary">1</span>
                {t("departures.select_date")}
              </h2>

              {isLoadingSchedules ? (
                <div className="h-[400px] w-full animate-pulse rounded-[24px] border border-border bg-[#f3f4f6]" />
              ) : schedules.length === 0 ? (
                <div className="flex h-[200px] w-full items-center justify-center rounded-xl border border-dashed border-border text-on-surface-subtle">
                  {t("departures.no_schedules")}
                </div>
              ) : (
                <ScheduleCalendar schedules={schedules} selectedId={tour_schedule_id} onSelect={setTourScheduleId} />
              )}
            </section>

            <section className="reveal-up space-y-6" style={{ animationDelay: "200ms" }}>
              <div className="flex items-end justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold text-on-surface">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm text-primary">2</span>
                  {t("departures.passengers")}
                </h2>
                {isOverCapacity && (
                  <span className="animate-pulse text-sm font-bold text-on-surfacerror">
                    {t("departures.over_capacity_remaining", { seats: availableSeats })}
                  </span>
                )}
              </div>

              <div className="space-y-2 rounded-[24px] border border-border bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
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

          <div className="reveal-up lg:col-span-4" style={{ animationDelay: "300ms" }}>
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
              <p className="mt-2 text-xs text-on-surfacerror">
                {t("departures.calc_error")}
              </p>
            )}

            <div className="mt-6">
              <Button
                onClick={handleContinue}
                disabled={isContinueDisabled}
                className="h-14 w-full text-base font-semibold uppercase tracking-normal shadow-[0_10px_20px_-10px_rgba(255,56,92,0.28)] disabled:opacity-50"
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
