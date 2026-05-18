"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui";
import { ScheduleCalendar } from "./ScheduleCalendar";
import { QuantityCounter } from "./QuantityCounter";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { useTourSchedules } from "../hooks/useTourDetail";
import type { Tour } from "@/types";

interface Props {
  tour: Tour;
}

export default function DepartureSelectClient({ tour }: Props) {
  const t = useTranslations("tour");
  const router = useRouter();

  const [selectedScheduleId, setSelectedScheduleId] = useState<number | undefined>();
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);

  const { data: schedules = [], isLoading: isLoadingSchedules } = useTourSchedules(tour.id);

  const selectedSchedule = useMemo(
    () => schedules.find((s) => s.id === selectedScheduleId),
    [schedules, selectedScheduleId]
  );

  // Local calculation to bypass the 401 on /bookings/calculate for public users
  const discountPercent = tour.discount_percent || 0;
  const adultPrice = parseFloat(tour.price_adult) || 0;
  const childPrice = parseFloat(tour.price_child) || 0;
  const infantPrice = parseFloat(tour.price_infant) || 0;

  const adultDiscounted = adultPrice * (1 - discountPercent / 100);
  // Based on BookingSidebar logic, child price isn't discounted by default.
  const totalAmount = adults * adultDiscounted + childrenCount * childPrice + infants * infantPrice;

  const handleContinue = () => {
    if (!selectedScheduleId) return;
    
    // Construct search params to pass to the booking page
    const params = new URLSearchParams();
    params.set("schedule_id", selectedScheduleId.toString());
    params.set("adults", adults.toString());
    params.set("children", childrenCount.toString());
    params.set("infants", infants.toString());

    router.push(`/tours/${tour.slug}/book?${params.toString()}`);
  };

  const isContinueDisabled = !selectedScheduleId || adults < 1;

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
                  selectedId={selectedScheduleId}
                  onSelect={(id) => setSelectedScheduleId(id)}
                />
              )}
            </section>

            {/* Số lượng khách */}
            <section className="space-y-6 reveal-up" style={{ animationDelay: "200ms" }}>
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">2</span>
                {t("departures.passengers")}
              </h2>
              <div className="glass-surface p-6 rounded-xl space-y-2">
                <QuantityCounter 
                  label={t("detail.price_adult")}
                  value={adults}
                  onChange={setAdults}
                  min={1}
                />
                <QuantityCounter 
                  label={t("detail.price_child")}
                  value={childrenCount}
                  onChange={setChildrenCount}
                  min={0}
                />
                <QuantityCounter 
                  label={t("detail.price_infant")}
                  value={infants}
                  onChange={setInfants}
                  min={0}
                />
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 reveal-up" style={{ animationDelay: "300ms" }}>
            <OrderSummaryCard 
              tour={tour}
              selectedSchedule={selectedSchedule}
              adults={adults}
              childrenCount={childrenCount}
              infants={infants}
              calculation={{
                final_amount: totalAmount,
                total_amount: totalAmount
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
