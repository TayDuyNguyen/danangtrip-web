"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button, Input } from "@/components/ui";
import type { CartItem } from "@/types";
import { toast } from "sonner";

interface CartSummaryProps {
  items: CartItem[];
}

export function CartSummary({ items }: CartSummaryProps) {
  const t = useTranslations("cart");
  const router = useRouter();

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");

  // Only calculate pricing for items that are not expired or sold out
  const activeItems = items.filter((item) => {
    const schedule = item.tour_schedule;
    if (!schedule) return false;
    const isExpired = new Date(schedule.start_date) < new Date();
    const isSoldOut =
      schedule.booking_availability === "sold_out" ||
      schedule.max_people - schedule.booked_people <= 0;
    return !isExpired && !isSoldOut;
  });

  const subtotal = activeItems.reduce((sum, item) => {
    const tour = item.tour;
    const schedule = item.tour_schedule;
    if (!tour || !schedule) return sum;

    const priceAdult = Number(schedule.price_adult ?? tour.price_adult ?? 0);
    const priceChild = Number(schedule.price_child ?? tour.price_child ?? 0);
    const priceInfant = Number(schedule.price_infant ?? tour.price_infant ?? 0);

    return (
      sum +
      item.quantity_adult * priceAdult +
      item.quantity_child * priceChild +
      item.quantity_infant * priceInfant
    );
  }, 0);

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === "DANANGTRIP" || cleanCode === "DATN2026") {
      setDiscountPercent(10);
      setAppliedCode(cleanCode);
      toast.success(t("promo_apply_success", { discount: 10 }));
    } else {
      toast.error(t("promo_invalid"));
    }
  };

  const handleCheckout = () => {
    if (activeItems.length === 0) {
      toast.error(t("checkout_no_active"));
      return;
    }

    // Backend only supports 1 tour per booking → always book the first active item
    const firstItem = activeItems[0];
    const tour = firstItem.tour;
    const schedule = firstItem.tour_schedule;
    if (!tour || !schedule) return;

    const availableSeats = schedule.max_people - schedule.booked_people;
    if (firstItem.quantity_adult + firstItem.quantity_child > availableSeats) {
      toast.error(
        t("checkout_capacity_error", {
          tourName: tour.name,
          availableSeats,
        })
      );
      return;
    }

    if (activeItems.length > 1) {
      toast.info(
        t("checkout_multi_info", {
          tourName: tour.name,
          remainingTours: activeItems.length - 1,
        }),
        { duration: 5000 }
      );
    }

    router.push(
      `/tours/${tour.slug}/book?schedule_id=${firstItem.tour_schedule_id}&adults=${firstItem.quantity_adult}&children=${firstItem.quantity_child}&infants=${firstItem.quantity_infant}`
    );
  };

  return (
    <div className="sticky top-24 space-y-6 rounded-[28px] border border-border bg-white p-6 shadow-[0_18px_54px_rgba(15,23,42,0.08)] reveal-up delay-100">
      <h3 className="border-b border-border pb-4 text-sm font-black uppercase tracking-widest text-on-surface">
        {t("summary_title")}
      </h3>

      {/* Step-by-step booking list — shown only when multiple tours are selected */}
      {activeItems.length > 1 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-on-surface-subtle uppercase tracking-widest">
            {t("order_sequence", { count: activeItems.length })}
          </p>
          <div className="space-y-1.5">
            {activeItems.map((item, index) => {
              const tour = item.tour;
              if (!tour) return null;
              const isNext = index === 0;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isNext
                      ? "bg-primary/15 border border-primary/30 text-primary"
                      : "bg-[#f7f7f7] border border-border text-on-surface-subtle"
                  }`}
                >
                  {/* Step number bubble */}
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                      isNext
                        ? "bg-primary text-white"
                        : "bg-white text-on-surface-subtle border border-border"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="truncate flex-1">{tour.name}</span>
                  {isNext && (
                    <span className="text-[9px] font-black uppercase tracking-wider text-primary shrink-0">
                      {t("next_up")}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-on-surface-subtle leading-relaxed pt-1">
            {t("multi_booking_hint")}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-on-surface-subtle font-medium">{t("subtotal")}</span>
          <span className="text-on-surface font-bold tabular-nums">{subtotal.toLocaleString()}đ</span>
        </div>

        {/* Discount */}
        {discountPercent > 0 && (
          <div className="flex justify-between items-center text-sm text-green-400">
            <span className="font-medium">
              {t("discount")} ({appliedCode})
            </span>
            <span className="font-bold tabular-nums">-{discountAmount.toLocaleString()}đ</span>
          </div>
        )}

        {/* Promo code form */}
        <form onSubmit={handleApplyPromo} className="flex gap-2 pt-2">
          <div className="flex-1">
            <Input
              placeholder={t("promo_placeholder")}
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="h-10 text-xs py-0"
              disabled={discountPercent > 0}
            />
          </div>
          <Button
            type="submit"
            className="h-10 px-4 text-xs font-bold uppercase tracking-widest shrink-0"
            disabled={discountPercent > 0 || !promoCode.trim()}
          >
            {t("promo_apply")}
          </Button>
        </form>

        {/* Final Total */}
        <div className="border-t border-border pt-4 flex justify-between items-end">
          <span className="text-sm font-black text-on-surface uppercase tracking-widest">
            {t("final_total")}
          </span>
          <span className="text-2xl font-black text-primary tracking-tight tabular-nums">
            {finalTotal.toLocaleString()}đ
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={handleCheckout}
        disabled={activeItems.length === 0}
        className="w-full h-12 text-xs font-black uppercase tracking-widest"
      >
        {activeItems.length > 1
          ? t("book_first_now", { count: activeItems.length })
          : t("checkout_btn")}
      </Button>
    </div>
  );
}
