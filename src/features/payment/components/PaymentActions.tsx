"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Booking } from "@/types";

interface Props {
  status: "pending" | "success" | "failed" | "redirecting" | "expired";
  booking?: Booking | null;
  isMissingContext?: boolean;
}

export function PaymentActions({ status, booking, isMissingContext = false }: Props) {
  const t = useTranslations("tour.payment");
  const tHistory = useTranslations("tour.history");

  return (
    <div className="mt-8 flex w-full max-w-xl flex-col items-center justify-center gap-4 sm:flex-row">
      {(status === "failed" || isMissingContext) && (
        <Link
          href="/"
          className="flex w-full items-center justify-center rounded-full border border-border bg-white px-8 py-3 text-sm font-semibold text-on-surface transition-all duration-300 hover:bg-[#f7f7f7] sm:w-auto"
        >
          {t("back_home")}
        </Link>
      )}

      {status === "success" && (
        <>
          <Link
            href={booking ? `/profile/bookings/code/${booking.booking_code}` : "/profile/bookings"}
            className="flex w-full items-center justify-center rounded-full border border-primary bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary-hover sm:w-auto"
          >
            {booking ? tHistory("action_detail") : t("view_profile")}
          </Link>
          <Link
            href="/profile/bookings"
            className="flex w-full items-center justify-center rounded-full border border-border bg-white px-8 py-3 text-sm font-semibold text-on-surface transition-all duration-300 hover:bg-[#f7f7f7] sm:w-auto"
          >
            {tHistory("back_to_list")}
          </Link>
        </>
      )}

      {status === "pending" && booking && (
        <Link
          href={`/profile/bookings/code/${booking.booking_code}`}
          className="flex w-full items-center justify-center rounded-full border border-border bg-white px-8 py-3 text-sm font-semibold text-on-surface transition-all duration-300 hover:bg-[#f7f7f7] sm:w-auto"
        >
          {tHistory("action_detail")}
        </Link>
      )}
    </div>
  );
}
