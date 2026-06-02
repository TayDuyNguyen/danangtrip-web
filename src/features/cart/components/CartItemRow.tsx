"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { IoCloseOutline } from "@/components/icons/solar";
import { useRemoveCartItem, useUpdateCartItem } from "../hooks/useCartQueries";
import { QuantityCounter } from "@/features/tour/components/QuantityCounter";
import type { CartItem } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";
import { useDebounce } from "@/hooks/useDebounce";
import { formatPriceVND } from "@/utils/format";

interface CartItemRowProps {
  item: CartItem;
  isSelected?: boolean;
  onToggleSelect?: (id: number) => void;
}

export function CartItemRow({ item, isSelected = false, onToggleSelect }: CartItemRowProps) {
  const t = useTranslations("cart");
  const td = useTranslations("tour.detail");
  const locale = useLocale();
  const dateLocale = locale === "vi" ? vi : enUS;
  const priceLocale = locale === "vi" ? "vi-VN" : "en-US";

  const { mutate: updateQuantity, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem();

  const tour = item.tour;
  const schedule = item.tour_schedule;

  // Local state for quantities to allow instant UI update (cast to Number to prevent type coercion mismatch)
  const [localAdults, setLocalAdults] = useState(Number(item.quantity_adult || 0));
  const [localChildren, setLocalChildren] = useState(Number(item.quantity_child || 0));
  const [localInfants, setLocalInfants] = useState(Number(item.quantity_infant || 0));

  // Sync local state when item changes (e.g. from server refetch)
  useEffect(() => {
    setLocalAdults(Number(item.quantity_adult || 0));
    setLocalChildren(Number(item.quantity_child || 0));
    setLocalInfants(Number(item.quantity_infant || 0));
  }, [item.quantity_adult, item.quantity_child, item.quantity_infant]);

  // Debounce the local quantities individually (using primitive values to prevent reference-based re-triggering)
  const debouncedAdults = useDebounce(localAdults, 500);
  const debouncedChildren = useDebounce(localChildren, 500);
  const debouncedInfants = useDebounce(localInfants, 500);

  // Trigger update when debounced values change and differ from original item values
  useEffect(() => {
    const serverAdults = Number(item.quantity_adult || 0);
    const serverChildren = Number(item.quantity_child || 0);
    const serverInfants = Number(item.quantity_infant || 0);

    if (
      debouncedAdults !== serverAdults ||
      debouncedChildren !== serverChildren ||
      debouncedInfants !== serverInfants
    ) {
      updateQuantity({
        id: item.id,
        scheduleId: item.tour_schedule_id,
        payload: {
          quantity_adult: debouncedAdults,
          quantity_child: debouncedChildren,
          quantity_infant: debouncedInfants,
        },
      });
    }
  }, [
    debouncedAdults,
    debouncedChildren,
    debouncedInfants,
    item.id,
    item.tour_schedule_id,
    item.quantity_adult,
    item.quantity_child,
    item.quantity_infant,
    updateQuantity,
  ]);

  if (!tour || !schedule) return null;

  const priceAdult = Number(schedule.price_adult ?? tour.price_adult ?? 0);
  const priceChild = Number(schedule.price_child ?? tour.price_child ?? 0);
  const priceInfant = Number(schedule.price_infant ?? tour.price_infant ?? 0);

  // Calculate subtotal using local values for instant visual feedback
  const subtotal =
    localAdults * priceAdult +
    localChildren * priceChild +
    localInfants * priceInfant;

  const availableSeats = schedule.max_people - schedule.booked_people;
  const requestedSeats = localAdults + localChildren;
  const isSoldOut = schedule.booking_availability === "sold_out" || availableSeats <= 0;
  const isExpired = new Date(schedule.start_date) < new Date();
  const hasCapacityWarning = availableSeats < requestedSeats && !isSoldOut && !isExpired;

  const handleQuantityChange = (type: "adult" | "child" | "infant", val: number) => {
    const nextAdult = type === "adult" ? val : localAdults;
    const nextChild = type === "child" ? val : localChildren;

    // Check capacity locally
    const nextRequested = nextAdult + nextChild;
    if (nextRequested > availableSeats) {
      toast.error(t("quantity_limit"));
      return;
    }

    if (type === "adult") setLocalAdults(val);
    if (type === "child") setLocalChildren(val);
    if (type === "infant") setLocalInfants(val);
  };

  const handleRemove = () => {
    removeItem({
      id: item.id,
      scheduleId: item.tour_schedule_id,
    });
    toast.success(t("remove_item") + " success");
  };

  const formattedDate = format(new Date(schedule.start_date), "EEEE, dd/MM/yyyy", {
    locale: dateLocale,
  });

  return (
    <div className="relative flex flex-row items-center gap-5 rounded-[28px] border border-border bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)] transition-all hover:border-primary/25 hover:shadow-[0_20px_54px_rgba(15,23,42,0.1)] reveal-up">
      {/* Selection Checkbox */}
      {onToggleSelect && (
        <div className="shrink-0 flex items-center justify-center pl-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(item.id)}
            className="h-4.5 w-4.5 cursor-pointer rounded border-border bg-white text-primary accent-primary focus:ring-0 focus:ring-offset-0"
            aria-label={tour.name}
          />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-5 items-start md:items-center w-full flex-grow">
        {/* Thumbnail */}
        <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl border border-border bg-[#f7f7f7] md:w-28">
          <Image
            src={tour.thumbnail || "/images/placeholder-tour.jpg"}
            alt={tour.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 112px"
          />
        </div>

        {/* Details */}
        <div className="flex-grow space-y-2 w-full">
          <div className="flex justify-between items-start gap-4">
            <Link href={`/tours/${tour.slug}`} className="hover:text-primary transition-colors">
              <h3 className="text-base font-bold uppercase leading-snug tracking-tight text-on-surface">
                {tour.name}
              </h3>
            </Link>
            <button
              onClick={handleRemove}
              className="shrink-0 rounded-full border border-border bg-[#f7f7f7] p-1 text-on-surface-subtle transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              title={t("remove_item")}
              disabled={isRemoving}
            >
              <IoCloseOutline className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-on-surface-subtle">
            <span>
              {t("schedule_label")}: <strong className="text-on-surface">{formattedDate}</strong>
            </span>
            {schedule.departure_code && (
              <span>
                {t("departure_code_label")}: <strong className="text-on-surface">{schedule.departure_code}</strong>
              </span>
            )}
          </div>

          {/* Warnings */}
          {isExpired ? (
            <p className="text-xs font-bold uppercase tracking-wider text-red-400">
              {t("expired_warning")}
            </p>
          ) : isSoldOut ? (
            <p className="text-xs font-bold uppercase tracking-wider text-red-400">
              {td("schedule_full")}
            </p>
          ) : hasCapacityWarning ? (
            <p className="text-xs font-bold uppercase tracking-wider text-orange-400">
              {t("capacity_warning", { available: availableSeats })}
            </p>
          ) : null}

          {/* Counters & Prices Grid */}
          <div className="flex flex-col justify-between gap-4 border-t border-border pt-3 sm:flex-row sm:items-center">
            {/* Passenger count selectors */}
            <div className="flex flex-col gap-1 shrink-0 w-full sm:max-w-xs">
              <QuantityCounter
                label={t("adults")}
                subLabel={formatPriceVND(priceAdult, priceLocale)}
                value={localAdults}
                onChange={(val) => handleQuantityChange("adult", val)}
                min={1}
                max={Math.max(1, availableSeats - localChildren)}
                disabled={isUpdating || isExpired || isSoldOut}
                className="py-1 border-0"
              />
              <QuantityCounter
                label={t("children")}
                subLabel={formatPriceVND(priceChild, priceLocale)}
                value={localChildren}
                onChange={(val) => handleQuantityChange("child", val)}
                min={0}
                max={Math.max(0, availableSeats - localAdults)}
                disabled={isUpdating || isExpired || isSoldOut}
                className="py-1 border-0"
              />
              <QuantityCounter
                label={t("infants")}
                subLabel={formatPriceVND(priceInfant, priceLocale)}
                value={localInfants}
                onChange={(val) => handleQuantityChange("infant", val)}
                min={0}
                disabled={isUpdating || isExpired || isSoldOut}
                className="py-1 border-0"
              />
            </div>

            {/* Subtotal */}
            <div className="text-right sm:self-end">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-subtle">{t("price_label")}</p>
              <p className="text-xl font-black text-primary tracking-tight">{formatPriceVND(subtotal, priceLocale)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
