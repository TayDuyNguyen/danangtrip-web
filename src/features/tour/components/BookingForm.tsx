"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { bookingSchema, type BookingFormValues } from "../validators/booking.schema";
import { useBookingCalculate, useCreateBooking } from "../hooks/useBookingQueries";
import { useCheckTourAvailability, useTourSchedules } from "../hooks/useTourDetail";
import { useActivePromotions } from "../hooks/usePromotions";
import { useUserVouchers } from "@/features/profile/hooks/usePointQueries";
import { useAuthStore } from "@/store/auth.store";
import { Input, Button, Textarea, Select } from "@/components/ui";
import { BookingProgressSteps } from "./BookingProgressSteps";
import { QuantityCounter } from "./QuantityCounter";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { TermsAndPoliciesModal } from "./TermsAndPoliciesModal";
import { useDebounce } from "@/hooks/useDebounce";
import { useFieldFocus } from "@/hooks/use-field-focus";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import type { Tour } from "@/types";
import { usePayment } from "@/features/payment/hooks/usePayment";
import { formatPriceVND } from "@/utils/format";
import { ROUTES } from "@/config";
import { calculateTourPricing, getApplicablePromotionMatches } from "../utils/promotion-pricing";

interface BookingFormProps {
  tour: Tour;
}

export function BookingForm({ tour }: BookingFormProps) {
  const t = useTranslations("tour.booking");
  const td = useTranslations("tour.detail");
  const tTour = useTranslations("tour");
  const locale = useLocale();
  const priceLocale = locale === "vi" ? "vi-VN" : "en-US";
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
  const initialPromoCode = searchParams.get("promo_code") || "";
  
  const [formData, setFormData] = useState<BookingFormValues>({
    tour_id: tour.id,
    tour_schedule_id: initialScheduleId,
    quantity_adult: initialAdults,
    quantity_child: initialChildren,
    quantity_infant: initialInfants,
    payment_method: "sepay",
    customer_name: user?.name || "",
    customer_email: user?.email || "",
    customer_phone: user?.phone || "",
    customer_address: user?.city || "",
    customer_note: "",
    promotion_code: initialPromoCode,
    user_voucher_code: "",
    agree_terms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormValues, string>>>({});
  const [isPromotionManuallyEdited, setIsPromotionManuallyEdited] = useState(Boolean(initialPromoCode));
  const [forceSchedulePicker, setForceSchedulePicker] = useState(false);
  const [selectPortalTarget, setSelectPortalTarget] = useState<HTMLElement | null>(null);
  const autoAdjustedKeyRef = useRef("");
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [termsType, setTermsType] = useState<"terms" | "policy" | null>(null);

  const openTermsModal = (type: "terms" | "policy") => {
    setTermsType(type);
    setIsTermsOpen(true);
  };
  const { isFocused, getFocusProps } = useFieldFocus<keyof BookingFormValues>();

  const { data: schedules = [] } = useTourSchedules(tour.id);
  const { data: promotions = [] } = useActivePromotions();
  const { data: userVouchers = [] } = useUserVouchers();
  const { mutate: calculate, data: priceData, isPending: isCalculating } = useBookingCalculate();
  const { mutate: createBooking, isPending: isCreating } = useCreateBooking();
  const {
    mutate: checkAvailability,
    mutateAsync: checkAvailabilityAsync,
    data: availability,
    isPending: isCheckingAvailability,
  } = useCheckTourAvailability(tour.id);
  const { createPayment, isCreating: isCreatingPayment } = usePayment();

  const onlinePaymentMethods = ["sepay"] as const;

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
  const selectedSchedule = useMemo(
    () => schedules.find(s => s.id === effectiveScheduleId),
    [effectiveScheduleId, schedules]
  );
  const bookingPricing = useMemo(() => {
    return calculateTourPricing({
      adultPrice: Number(selectedSchedule?.price_adult ?? tour.price_adult ?? 0),
      childPrice: Number(selectedSchedule?.price_child ?? tour.price_child ?? 0),
      infantPrice: Number(selectedSchedule?.price_infant ?? tour.price_infant ?? 0),
      discountPercent: Number(tour.discount_percent || 0),
      adults: formData.quantity_adult,
      children: formData.quantity_child,
      infants: formData.quantity_infant,
    });
  }, [
    formData.quantity_adult,
    formData.quantity_child,
    formData.quantity_infant,
    selectedSchedule?.price_adult,
    selectedSchedule?.price_child,
    selectedSchedule?.price_infant,
    tour.discount_percent,
    tour.price_adult,
    tour.price_child,
    tour.price_infant,
  ]);

  const applicablePromotionMatches = useMemo(() => {
    return getApplicablePromotionMatches(promotions, bookingPricing.subtotalAfterTourDiscount);
  }, [
    bookingPricing.subtotalAfterTourDiscount,
    promotions,
  ]);
  const autoPromotionMatch = applicablePromotionMatches[0] ?? null;
  const selectedPromotionDiscount =
    applicablePromotionMatches.find(
      (match) => match.promotion.code === formData.promotion_code
    )?.discountAmount ?? 0;
  const voucherDiscountBase = Math.max(
    0,
    bookingPricing.subtotalAfterTourDiscount - selectedPromotionDiscount
  );
  const applicableVoucherMatches = useMemo(() => {
    return userVouchers
      .filter(
        (voucher) =>
          voucher.status === "active" &&
          bookingPricing.subtotalAfterTourDiscount >= Number(voucher.min_order_amount || 0)
      )
      .map((voucher) => {
        const rawDiscount =
          voucher.discount_type === "percent"
            ? (voucherDiscountBase * Number(voucher.discount_value || 0)) / 100
            : Number(voucher.discount_value || 0);
        const cappedDiscount =
          voucher.max_discount_amount !== null &&
          voucher.max_discount_amount !== undefined
            ? Math.min(rawDiscount, Number(voucher.max_discount_amount))
            : rawDiscount;

        return {
          voucher,
          discountAmount: Math.min(voucherDiscountBase, Math.max(0, cappedDiscount)),
        };
      })
      .filter((match) => match.discountAmount > 0)
      .sort((a, b) => b.discountAmount - a.discountAmount);
  }, [
    bookingPricing.subtotalAfterTourDiscount,
    userVouchers,
    voucherDiscountBase,
  ]);
  const debouncedFormData = useDebounce(effectiveFormData, 400);

  useEffect(() => {
    setSelectPortalTarget(document.body);
  }, []);

  useEffect(() => {
    if (isPromotionManuallyEdited) {
      return;
    }

    const nextPromotionCode = autoPromotionMatch?.promotion.code ?? "";
    setFormData((prev) =>
      prev.promotion_code === nextPromotionCode
        ? prev
        : {
            ...prev,
            promotion_code: nextPromotionCode,
          }
    );
  }, [autoPromotionMatch?.promotion.code, isPromotionManuallyEdited]);

  useEffect(() => {
    if (debouncedFormData.tour_schedule_id) {
      const availabilityPayload = {
        schedule_id: debouncedFormData.tour_schedule_id,
        quantity_adult: debouncedFormData.quantity_adult,
        quantity_child: debouncedFormData.quantity_child,
        quantity_infant: debouncedFormData.quantity_infant,
      };

      checkAvailability(availabilityPayload);
      calculate({
        tour_id: tour.id,
        tour_schedule_id: debouncedFormData.tour_schedule_id,
        quantity_adult: debouncedFormData.quantity_adult,
        quantity_child: debouncedFormData.quantity_child,
        quantity_infant: debouncedFormData.quantity_infant,
        promotion_code: debouncedFormData.promotion_code || undefined,
        user_voucher_code: debouncedFormData.user_voucher_code || undefined,
      });
    }
  }, [
    debouncedFormData.tour_schedule_id,
    debouncedFormData.quantity_adult,
    debouncedFormData.quantity_child,
    debouncedFormData.quantity_infant,
    debouncedFormData.promotion_code,
    debouncedFormData.user_voucher_code,
    checkAvailability,
    calculate,
    tour.id
  ]);

  useEffect(() => {
    if (formData.payment_method !== "sepay") {
      setFormData((prev) => ({ ...prev, payment_method: "sepay" }));
    }
  }, [formData.payment_method]);

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = bookingSchema.safeParse(effectiveFormData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof BookingFormValues, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof BookingFormValues;
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message.startsWith("validation.")
            ? t(issue.message)
            : issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.error(t("step_info"));
      return;
    }

    if (isOverCapacity || isRealtimeUnavailable) {
      toast.error(tTour("departures.over_capacity_remaining", { seats: realtimeAvailableSeats }));
      return;
    }

    try {
      const latestAvailability = await checkAvailabilityAsync({
        schedule_id: effectiveFormData.tour_schedule_id,
        quantity_adult: effectiveFormData.quantity_adult,
        quantity_child: effectiveFormData.quantity_child,
        quantity_infant: effectiveFormData.quantity_infant,
      });

      if (!latestAvailability?.is_available) {
        toast.error(tTour("departures.over_capacity_remaining", { seats: latestAvailability?.available_seats ?? 0 }));
        return;
      }
    } catch {
      toast.error(t("validation.schedule_required"));
      return;
    }

    const createBookingPayload = {
      tour_id: effectiveFormData.tour_id,
      tour_schedule_id: effectiveFormData.tour_schedule_id,
      quantity_adult: effectiveFormData.quantity_adult,
      quantity_child: effectiveFormData.quantity_child,
      quantity_infant: effectiveFormData.quantity_infant,
      customer_name: effectiveFormData.customer_name,
      customer_email: effectiveFormData.customer_email,
      customer_phone: effectiveFormData.customer_phone,
      customer_address: effectiveFormData.customer_address || undefined,
      customer_note: effectiveFormData.customer_note || undefined,
      payment_method: effectiveFormData.payment_method,
      promotion_code: effectiveFormData.promotion_code || undefined,
      user_voucher_code: effectiveFormData.user_voucher_code || undefined,
    };

    createBooking(createBookingPayload, {
      onSuccess: (booking) => {
        const bookingCode = booking?.booking_code;
        const paymentResultUrl = bookingCode
          ? `${ROUTES.PAYMENT_RESULT}?booking_code=${encodeURIComponent(bookingCode)}`
          : ROUTES.PAYMENT_RESULT;

        toast.success(t("step_confirm"));

        if (onlinePaymentMethods.includes(effectiveFormData.payment_method as typeof onlinePaymentMethods[number])) {
          if (booking?.id) {
            createPayment({
              booking_id: booking.id,
              payment_method: effectiveFormData.payment_method as typeof onlinePaymentMethods[number],
            });
            return;
          }

          router.push(paymentResultUrl);
          return;
        }

        router.push(paymentResultUrl);
      }
    });
  };

  const hasInvalidInitialSchedule = initialScheduleId > 0 && schedules.length > 0 && !selectedSchedule;
  const shouldShowSchedulePicker = forceSchedulePicker || !effectiveScheduleId || hasInvalidInitialSchedule;
  const selectedAvailableSeats = selectedSchedule
    ? selectedSchedule.max_people - selectedSchedule.booked_people
    : 0;
  const realtimeAvailableSeats = availability?.available_seats ?? selectedAvailableSeats;
  const totalSeatGuests = formData.quantity_adult + formData.quantity_child + formData.quantity_infant;
  const isRealtimeUnavailable = availability?.is_available === false;

  const isOverCapacity =
    selectedSchedule !== undefined &&
    totalSeatGuests > realtimeAvailableSeats;

  const maxAdults = selectedSchedule
    ? Math.max(1, realtimeAvailableSeats - formData.quantity_child - formData.quantity_infant)
    : 20;
  const maxChildren = selectedSchedule
    ? Math.max(0, realtimeAvailableSeats - formData.quantity_adult - formData.quantity_infant)
    : 20;
  const maxInfants = selectedSchedule
    ? Math.max(0, realtimeAvailableSeats - formData.quantity_adult - formData.quantity_child)
    : 20;

  useEffect(() => {
    if (!selectedSchedule || realtimeAvailableSeats <= 0) return;

    const nextAdults = Math.max(1, Math.min(formData.quantity_adult, realtimeAvailableSeats));
    const seatsAfterAdults = Math.max(0, realtimeAvailableSeats - nextAdults);
    const nextChildren = Math.max(0, Math.min(formData.quantity_child, seatsAfterAdults));
    const seatsAfterChildren = Math.max(0, seatsAfterAdults - nextChildren);
    const nextInfants = Math.max(0, Math.min(formData.quantity_infant, seatsAfterChildren));

    if (
      nextAdults === formData.quantity_adult &&
      nextChildren === formData.quantity_child &&
      nextInfants === formData.quantity_infant
    ) {
      return;
    }

    const adjustmentKey = [
      effectiveScheduleId,
      realtimeAvailableSeats,
      nextAdults,
      nextChildren,
      nextInfants,
    ].join(":");

    setFormData((prev) => ({
      ...prev,
      quantity_adult: nextAdults,
      quantity_child: nextChildren,
      quantity_infant: nextInfants,
    }));

    if (autoAdjustedKeyRef.current !== adjustmentKey) {
      autoAdjustedKeyRef.current = adjustmentKey;
      toast.error(tTour("departures.over_capacity_remaining", { seats: realtimeAvailableSeats }));
    }
  }, [
    effectiveScheduleId,
    formData.quantity_adult,
    formData.quantity_child,
    formData.quantity_infant,
    realtimeAvailableSeats,
    selectedSchedule,
    tTour,
  ]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 space-y-8 pb-20">
        <form onSubmit={onSubmit} className="space-y-8" noValidate>
          
          <div className="lg:hidden">
            <BookingProgressSteps currentStep={1} />
          </div>

          {/* Section 1: Schedule */}
          <section className="space-y-6 rounded-[28px] border border-border bg-white p-6 shadow-[0_18px_54px_rgba(15,23,42,0.08)] reveal-up md:p-8">
            <div className="flex items-center justify-between gap-4 border-l-4 border-primary pl-4 text-on-surface">
               <h2 className="text-lg font-black uppercase tracking-tight">
                {shouldShowSchedulePicker ? td("select_date") : t("selected_departure")}
               </h2>
               {!shouldShowSchedulePicker && (
                <button
                  type="button"
                  onClick={() => setForceSchedulePicker(true)}
                  className="text-xs font-semibold uppercase tracking-normal text-primary transition-colors hover:text-primary-hover"
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
                  menuPortalTarget={selectPortalTarget}
                  menuPosition="fixed"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-[#f7f7f7] p-5 text-on-surface">
                {selectedSchedule ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-normal text-on-surface-subtle">
                        {t("selected_departure")}
                      </p>
                      <p className="text-base font-black text-on-surface uppercase">
                        {dateFormatter.format(new Date(selectedSchedule.start_date))}
                      </p>
                    </div>
                    <div className="rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase text-primary">
                      {selectedSchedule.booking_availability === "open"
                        ? t("seats_left", { seats: realtimeAvailableSeats })
                        : td("schedule_full")}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-subtle">{t("loading_departure")}</p>
                )}
              </div>
            )}
            {errors.tour_schedule_id && (
              <p className="text-xs font-semibold uppercase tracking-normal text-red-500">{errors.tour_schedule_id}</p>
            )}
          </section>

          {/* Section 2: Quantities */}
          <section className="space-y-6 rounded-[28px] border border-border bg-white p-6 shadow-[0_18px_54px_rgba(15,23,42,0.08)] reveal-up delay-100 md:p-8">
            <div className="flex items-center gap-3 border-l-4 border-primary pl-4 text-on-surface">
               <h2 className="text-lg font-black uppercase tracking-tight">
                {td("guests_label")}
               </h2>
            </div>

            {(isOverCapacity || isRealtimeUnavailable) && (
              <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-semibold uppercase tracking-normal text-red-500 animate-in fade-in duration-300">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                {tTour("departures.over_capacity_remaining", { seats: realtimeAvailableSeats })}
              </div>
            )}

            {isCheckingAvailability && !isOverCapacity && !isRealtimeUnavailable && (
              <p className="text-xs font-semibold uppercase tracking-normal text-on-surface-subtle">
                {td("availability_checking")}
              </p>
            )}

            <div className="divide-y divide-border/30">
              <QuantityCounter 
                label={td("price_adult")} 
                subLabel={`${formatPriceVND(tour.price_adult, priceLocale)} ${td("per_person")}`}
                value={formData.quantity_adult}
                onChange={(val) => handleChange("quantity_adult", val)}
                min={1}
                max={maxAdults}
              />
              <QuantityCounter 
                label={td("price_child")} 
                subLabel={`${formatPriceVND(tour.price_child, priceLocale)} ${td("per_person")}`}
                value={formData.quantity_child}
                onChange={(val) => handleChange("quantity_child", val)}
                min={0}
                max={maxChildren}
              />
              <QuantityCounter 
                label={td("price_infant")} 
                subLabel={`${formatPriceVND(tour.price_infant, priceLocale)} ${td("per_person")}`}
                value={formData.quantity_infant}
                onChange={(val) => handleChange("quantity_infant", val)}
                min={0}
                max={maxInfants}
              />
            </div>
          </section>

          {/* Section 3: Customer Info */}
          <section className="space-y-8 rounded-[28px] border border-border bg-white p-6 shadow-[0_18px_54px_rgba(15,23,42,0.08)] reveal-up delay-200 md:p-8">
            <div className="flex justify-between items-end border-l-4 border-primary pl-4 text-on-surface">
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
                    handleChange("customer_address", user.city || "");
                  }
                }}
                className="text-xs font-semibold uppercase tracking-normal text-primary transition-colors hover:text-primary-hover"
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
          <section className="space-y-6 rounded-[28px] border border-border bg-white p-6 shadow-[0_18px_54px_rgba(15,23,42,0.08)] reveal-up delay-300 md:p-8">
             <div className="flex items-center gap-3 border-l-4 border-primary pl-4 text-on-surface">
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
                  className="mt-1 h-5 w-5 rounded border-border bg-white text-primary accent-primary focus:ring-primary"
                />
                <span className="text-sm text-on-surface-subtle font-medium leading-relaxed select-none">
                  {t.rich("terms_agree", {
                    terms: (chunks) => (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          openTermsModal("terms");
                        }}
                        className="text-primary font-bold hover:underline cursor-pointer focus:outline-hidden inline"
                      >
                        {chunks}
                      </button>
                    ),
                    policy: (chunks) => (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          openTermsModal("policy");
                        }}
                        className="text-primary font-bold hover:underline cursor-pointer focus:outline-hidden inline"
                      >
                        {chunks}
                      </button>
                    ),
                  })}
                </span>
             </label>
             {errors.agree_terms && (
               <p className="text-xs font-semibold uppercase tracking-normal text-red-500">{errors.agree_terms}</p>
             )}

             <Button 
                type="submit" 
                className="h-16 w-full text-lg font-semibold uppercase tracking-normal shadow-[0_10px_30px_-5px_rgba(255,56,92,0.28)]"
                isLoading={isCreating || isCreatingPayment || isCheckingAvailability}
                disabled={isCalculating || isCreatingPayment || isCheckingAvailability || isOverCapacity || isRealtimeUnavailable}
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
        promoCode={formData.promotion_code || ""}
        promotionChoices={applicablePromotionMatches.map((match, index) => ({
          code: match.promotion.code,
          name: match.promotion.name,
          discountAmount: match.discountAmount,
          isBest: index === 0,
        }))}
        onPromoCodeChange={(code) => {
          setIsPromotionManuallyEdited(true);
          handleChange("promotion_code", code);
        }}
        voucherCode={formData.user_voucher_code || ""}
        voucherChoices={applicableVoucherMatches.map((match) => ({
          code: match.voucher.code,
          name: match.voucher.name,
          discountAmount: match.discountAmount,
        }))}
        onVoucherCodeChange={(code) => handleChange("user_voucher_code", code)}
      />

      <TermsAndPoliciesModal 
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        type={termsType}
      />
    </div>
  );
}
