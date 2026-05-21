"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Booking } from "@/types";

interface Props {
  status: "pending" | "success" | "failed" | "redirecting";
  booking?: Booking | null;
  isMissingContext?: boolean;
}

export function PaymentActions({ status, booking, isMissingContext = false }: Props) {
  const t = useTranslations("tour.payment");

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
      {(status === "failed" || isMissingContext) && (
        <Link
          href="/"
          className="btn-secondary w-full sm:w-auto text-on-surface-subtle border-[#262626] hover:bg-[#1f1f1f] flex items-center justify-center transition-all duration-300 py-3 px-8 rounded-full border text-sm font-semibold"
        >
          {t("back_home")}
        </Link>
      )}

      {status === "success" && (
        <Link
          href="/profile"
          className="btn-primary w-full sm:w-auto bg-[#171717] border border-[#262626] text-white hover:border-[#8b6a55] flex items-center justify-center transition-all duration-300 py-3 px-8 rounded-full text-sm font-semibold shadow-lg"
        >
          {booking ? t("view_profile") : t("view_profile")}
        </Link>
      )}
    </div>
  );
}
