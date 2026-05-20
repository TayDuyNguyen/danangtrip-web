"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui";
import { ScheduleCalendar } from "./ScheduleCalendar";
import { QuantityCounter } from "./QuantityCounter";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { useTourSchedules } from "../hooks/useTourDetail";
import { departureSelectSchema } from "../validators/departure-select.schema";
import type { Tour } from "@/types";

interface Props {
  tour: Tour;
}

export default function DepartureSelectClient({ tour }: Props) {
  const t = useTranslations("tour");
  const router = useRouter();

  const { data: schedules = [], isLoading: isLoadingSchedules } = useTourSchedules(tour.id);

  const [schedule_id, setScheduleId] = useState<number | undefined>();
  const [quantity_adult, setQuantityAdult] = useState(1);
  const [quantity_child, setQuantityChild] = useState(0);
  const [quantity_infant, setQuantityInfant] = useState(0);

  const selectedSchedule = useMemo(
    () => schedules.find((s) => s.id === schedule_id),
    [schedules, schedule_id]
  );

  // Calculate local price summary
  const discountPercent = tour.discount_percent || 0;
  const adultPrice = parseFloat(tour.price_adult) || 0;
  const childPrice = parseFloat(tour.price_child) || 0;
  const infantPrice = parseFloat(tour.price_infant) || 0;

  const adultDiscounted = adultPrice * (1 - discountPercent / 100);
  const totalAmount = quantity_adult * adultDiscounted + quantity_child * childPrice + quantity_infant * infantPrice;

  // Real-time capacity check
  const totalPassengers = quantity_adult + quantity_child + quantity_infant;
  const availableSeats = selectedSchedule ? selectedSchedule.max_people - selectedSchedule.booked_people : 0;
  const isOverCapacity = selectedSchedule && totalPassengers > availableSeats;

  const handleContinue = () => {
    const result = departureSelectSchema.safeParse({
      schedule_id,
      quantity_adult,
      quantity_child,
      quantity_infant,
    });

    if (!result.success || isOverCapacity) return;

    const params = new URLSearchParams();
    params.set("schedule_id", result.data.schedule_id.toString());
    params.set("adults", result.data.quantity_adult.toString());
    params.set("children", result.data.quantity_child.toString());
    params.set("infants", result.data.quantity_infant.toString());

    router.push(`/tours/${tour.slug}/book?${params.toString()}`);
  };

  const isContinueDisabled = !schedule_id || isOverCapacity;

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
              ) : (
                <ScheduleCalendar 
                  schedules={schedules}
                  selectedId={schedule_id}
                  onSelect={setScheduleId}
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
                    Vượt quá số chỗ trống!
                  </span>
                )}
              </div>
              <div className="glass-surface p-6 rounded-xl space-y-2">
                <QuantityCounter 
                  label={t("detail.price_adult")}
                  value={quantity_adult}
                  onChange={setQuantityAdult}
                  min={1}
                  max={selectedSchedule ? availableSeats : 20}
                />
                <QuantityCounter 
                  label={t("detail.price_child")}
                  value={quantity_child}
                  onChange={setQuantityChild}
                  min={0}
                  max={selectedSchedule ? availableSeats : 20}
                />
                <QuantityCounter 
                  label={t("detail.price_infant")}
                  value={quantity_infant}
                  onChange={setQuantityInfant}
                  min={0}
                  max={selectedSchedule ? availableSeats : 20}
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
              calculation={{
                total_amount: totalAmount,
                final_amount: totalAmount
              }}
              isLoading={false}
            />

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
