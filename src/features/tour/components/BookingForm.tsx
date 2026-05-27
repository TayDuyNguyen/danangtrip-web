"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { bookingSchema, type BookingFormValues } from "../validators/booking.schema";
import { useBookingCalculate, useCreateBooking } from "../hooks/useBookingQueries";
import { useTourSchedules } from "../hooks/useTourDetail";
import { useAuthStore } from "@/store/auth.store";
import { Input, Button, Textarea, Select, type SelectOption } from "@/components/ui";
import { BookingProgressSteps } from "./BookingProgressSteps";
import { QuantityCounter } from "./QuantityCounter";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { useDebounce } from "@/hooks/useDebounce";
import { useFieldFocus } from "@/hooks/use-field-focus";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import type { Tour } from "@/types";
import { usePayment } from "@/features/payment/hooks/usePayment";

interface BookingFormProps {
  tour: Tour;
}

export function BookingForm({ tour }: BookingFormProps) {
  const t = useTranslations("tour.booking");
  const td = useTranslations("tour.detail");
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuthStore();
  const searchParams = useSearchParams();

  const initialScheduleId = searchParams.get("tour_schedule_id")
    ? Number(searchParams.get("tour_schedule_id"))
    : searchParams.get("schedule_id")
      ? Number(searchParams.get("schedule_id"))
      : 0;
  const initialAdults = searchParams.get("adults") ? Number(searchParams.get("adults")) : 1;
  const initialChildren = searchParams.get("children") ? Number(searchParams.get("children")) : 0;
  const initialInfants = searchParams.get("infants") ? Number(searchParams.get("infants")) : 0;
  
  const [formData, setFormData] = useState<BookingFormValues>({
    tour_id: tour.id,
    tour_schedule_id: initialScheduleId,
    quantity_adult: initialAdults,
    quantity_child: initialChildren,
    quantity_infant: initialInfants,
    payment_method: "payos",
    customer_name: user?.name || "",
    customer_email: user?.email || "",
    customer_phone: user?.phone || "",
    customer_address: "",
    customer_note: "",
    agree_terms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormValues, string>>>({});
  const [forceSchedulePicker, setForceSchedulePicker] = useState(false);
  const { isFocused, getFocusProps } = useFieldFocus<keyof BookingFormValues>();

  const { data: schedules = [] } = useTourSchedules(tour.id);
  const { mutate: calculate, data: priceData, isPending: isCalculating } = useBookingCalculate();
  const { mutate: createBooking, isPending: isCreating } = useCreateBooking();
  const { createPayment, isCreating: isCreatingPayment } = usePayment();

  const onlinePaymentMethods = ["payos"] as const;

  const availableSchedules = useMemo(
    () => schedules.filter(
      (schedule) => schedule.status === "available" && schedule.booking_availability === "open"
    ),
    [schedules]
  );

  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }), [locale]);

  const scheduleOptions = useMemo(() => {
    return availableSchedules.map((schedule) => {
      const seatsLeft = schedule.max_people - schedule.booked_people;
      return {
        value: schedule.id,
        label: `${dateFormatter.format(new Date(schedule.start_date))} (${t("seats_left", { seats: seatsLeft })})`,
      };
    });
  }, [availableSchedules, dateFormatter, t]);
  const autoSelectedScheduleId =
    formData.tour_schedule_id === 0 && availableSchedules.length === 1
      ? availableSchedules[0].id
      : 0;
  const effectiveScheduleId = formData.tour_schedule_id || autoSelectedScheduleId;
  const effectiveFormData = useMemo(
    () => ({
      ...formData,
      tour_schedule_id: effectiveScheduleId,
    }),
    [effectiveScheduleId, formData]
  );
  const debouncedFormData = useDebounce(effectiveFormData, 400);

  useEffect(() => {
    if (debouncedFormData.tour_schedule_id) {
      calculate({
        tour_id: tour.id,
        tour_schedule_id: debouncedFormData.tour_schedule_id,
        quantity_adult: debouncedFormData.quantity_adult,
        quantity_child: debouncedFormData.quantity_child,
        quantity_infant: debouncedFormData.quantity_infant,
      });
    }
  }, [
    debouncedFormData.tour_schedule_id,
    debouncedFormData.quantity_adult,
    debouncedFormData.quantity_child,
    debouncedFormData.quantity_infant,
    calculate,
    tour.id
  ]);

  const handleChange = (field: keyof BookingFormValues, value: string | number | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = bookingSchema.safeParse(effectiveFormData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof BookingFormValues, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof BookingFormValues;
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.error(t("step_info"));
      return;
    }

    createBooking(effectiveFormData, {
      onSuccess: (booking) => {
        if (booking?.id) {
          toast.success(t("step_confirm"));
          if (onlinePaymentMethods.includes(effectiveFormData.payment_method as typeof onlinePaymentMethods[number])) {
            createPayment({
              booking_id: booking.id,
              payment_method: effectiveFormData.payment_method as typeof onlinePaymentMethods[number],
            });
            return;
          }

          if (booking.booking_code) {
            router.push(`/payment/result?booking_code=${booking.booking_code}`);
          }
        }
      }
    });
  };

  const selectedSchedule = schedules.find(s => s.id === effectiveScheduleId);
  const hasInvalidInitialSchedule = initialScheduleId > 0 && schedules.length > 0 && !selectedSchedule;
  const shouldShowSchedulePicker = forceSchedulePicker || !effectiveScheduleId || hasInvalidInitialSchedule;
  const selectedAvailableSeats = selectedSchedule
    ? selectedSchedule.max_people - selectedSchedule.booked_people
    : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 space-y-8 pb-20">
        <form onSubmit={onSubmit} className="space-y-8" noValidate>
          
          <div className="lg:hidden">
            <BookingProgressSteps currentStep={1} />
          </div>

          {/* Section 1: Schedule */}
          <section className="glass-surface rounded-2xl p-6 md:p-8 space-y-6 reveal-up shadow-xl border-white/5">
            <div className="flex items-center justify-between gap-4 border-l-4 border-primary pl-4 text-white">
               <h2 className="text-lg font-black uppercase tracking-tight">
                {shouldShowSchedulePicker ? td("select_date") : t("selected_departure")}
               </h2>
               {!shouldShowSchedulePicker && (
                <button
                  type="button"
                  onClick={() => setForceSchedulePicker(true)}
                  className="text-[11px] font-bold text-primary hover:text-white transition-colors uppercase tracking-widest"
                >
                  {t("change_departure")}
                </button>
               )}
            </div>
            {shouldShowSchedulePicker ? (
              <div className="w-full">
                <Select
                  options={scheduleOptions}
                  value={scheduleOptions.find((opt) => opt.value === effectiveScheduleId) || null}
                  onChange={(opt) => {
                    if (opt) {
                      handleChange("tour_schedule_id", Number(opt.value));
                      setForceSchedulePicker(false);
                    }
                  }}
                  placeholder={td("select_date")}
                  menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                  menuPosition="fixed"
                />
              </div>
            ) : (
              <div className="border border-border rounded-xl p-5 bg-surface-container-low text-white">
                {selectedSchedule ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-on-surface-subtle uppercase tracking-widest">
                        {t("selected_departure")}
                      </p>
                      <p className="text-base font-black text-on-surface uppercase">
                        {dateFormatter.format(new Date(selectedSchedule.start_date))}
                      </p>
                    </div>
                    <div className="rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase text-primary">
                      {selectedSchedule.booking_availability === "open"
                        ? t("seats_left", { seats: selectedAvailableSeats })
                        : td("schedule_full")}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-subtle">{t("loading_departure")}</p>
                )}
              </div>
            )}
            {errors.tour_schedule_id && (
              <p className="text-xs text-red-400 font-bold uppercase tracking-wider">{errors.tour_schedule_id}</p>
            )}
          </section>

          {/* Section 2: Quantities */}
          <section className="glass-surface rounded-2xl p-6 md:p-8 space-y-6 reveal-up delay-100 shadow-xl border-white/5">
            <div className="flex items-center gap-3 border-l-4 border-primary pl-4 text-white">
               <h2 className="text-lg font-black uppercase tracking-tight">
                {td("guests_label")}
               </h2>
            </div>
            <div className="divide-y divide-border/30">
              <QuantityCounter 
                label={td("price_adult")} 
                subLabel={`${tour.price_adult}đ ${td("per_person")}`}
                value={formData.quantity_adult}
                onChange={(val) => handleChange("quantity_adult", val)}
                min={1}
              />
              <QuantityCounter 
                label={td("price_child")} 
                subLabel={`${tour.price_child}đ ${td("per_person")}`}
                value={formData.quantity_child}
                onChange={(val) => handleChange("quantity_child", val)}
              />
              <QuantityCounter 
                label={td("price_infant")} 
                subLabel={`${tour.price_infant}đ ${td("per_person")}`}
                value={formData.quantity_infant}
                onChange={(val) => handleChange("quantity_infant", val)}
              />
            </div>
          </section>

          {/* Section 3: Customer Info */}
          <section className="glass-surface rounded-2xl p-6 md:p-8 space-y-8 reveal-up delay-200 shadow-xl border-white/5">
            <div className="flex justify-between items-end border-l-4 border-primary pl-4 text-white">
               <h2 className="text-lg font-black uppercase tracking-tight">
                {t("customer_info")}
               </h2>
               <button 
                type="button"
                onClick={() => {
                  if (user) {
                    handleChange("customer_name", user.name || "");
                    handleChange("customer_email", user.email || "");
                    handleChange("customer_phone", user.phone || "");
                  }
                }}
                className="text-[11px] font-bold text-primary hover:text-white transition-colors uppercase tracking-widest"
               >
                 {t("fill_from_profile")}
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input 
                label={t("full_name")}
                placeholder={t("full_name")}
                value={formData.customer_name}
                onChange={(e) => handleChange("customer_name", e.target.value)}
                error={errors.customer_name}
                isFocused={isFocused("customer_name")}
                {...getFocusProps("customer_name")}
               />
               <Input 
                label={t("email")}
                type="email"
                placeholder="example@email.com"
                value={formData.customer_email}
                onChange={(e) => handleChange("customer_email", e.target.value)}
                error={errors.customer_email}
                isFocused={isFocused("customer_email")}
                {...getFocusProps("customer_email")}
               />
               <Input 
                label={t("phone")}
                placeholder="09xx xxx xxx"
                value={formData.customer_phone}
                onChange={(e) => handleChange("customer_phone", e.target.value)}
                error={errors.customer_phone}
                isFocused={isFocused("customer_phone")}
                {...getFocusProps("customer_phone")}
               />
               <Input 
                label={t("address")}
                placeholder={t("address")}
                value={formData.customer_address || ""}
                onChange={(e) => handleChange("customer_address", e.target.value)}
                error={errors.customer_address}
                isFocused={isFocused("customer_address")}
                {...getFocusProps("customer_address")}
               />
               <div className="md:col-span-2">
                 <Textarea 
                  label={t("note")}
                  placeholder={t("note_placeholder")}
                  rows={3}
                  value={formData.customer_note || ""}
                  onChange={(e) => handleChange("customer_note", e.target.value)}
                  isFocused={isFocused("customer_note")}
                  {...getFocusProps("customer_note")}
                 />
               </div>
            </div>
          </section>

          {/* Section 4: Payment Method */}
          <section className="glass-surface rounded-2xl p-6 md:p-8 space-y-6 reveal-up delay-300 shadow-xl border-white/5">
             <div className="flex items-center gap-3 border-l-4 border-primary pl-4 text-white">
               <h2 className="text-lg font-black uppercase tracking-tight">
                {t("payment_method")}
               </h2>
            </div>
            <PaymentMethodSelector 
              value={formData.payment_method}
              onChange={(val) => handleChange("payment_method", val)}
            />
          </section>

          {/* Accept Terms */}
          <div className="px-2 space-y-6 reveal-up delay-400">
             <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={formData.agree_terms}
                  onChange={(e) => handleChange("agree_terms", e.target.checked)}
                  className="mt-1 w-5 h-5 rounded bg-surface-container-high border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-on-surface-variant font-medium leading-relaxed select-none">
                  {t.rich("terms_agree", {
                    terms: (chunks) => <span className="text-primary font-bold hover:underline">{chunks}</span>,
                    policy: (chunks) => <span className="text-primary font-bold hover:underline">{chunks}</span>
                  })}
                </span>
             </label>
             {errors.agree_terms && (
               <p className="text-xs text-red-400 font-bold uppercase tracking-wider">{errors.agree_terms}</p>
             )}

             <Button 
                type="submit" 
                className="w-full h-16 text-lg font-black uppercase tracking-widest shadow-[0_10px_30px_-5px_rgba(139,106,85,0.4)]"
                isLoading={isCreating || isCreatingPayment}
                disabled={isCalculating || isCreatingPayment}
             >
               {t("continue_payment")}
             </Button>
          </div>
        </form>
      </div>

      <OrderSummaryCard 
        tour={tour}
        selectedSchedule={selectedSchedule}
        adults={formData.quantity_adult}
        childrenCount={formData.quantity_child}
        infants={formData.quantity_infant}
        calculation={priceData}
        isLoading={isCalculating}
      />
    </div>
  );
}
