"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatCurrency } from "@/utils/format";
import type { Booking } from "@/types";

interface Props {
  booking: Booking;
}

export function PaymentSummaryCard({ booking }: Props) {
  const t = useTranslations("tour.payment");
  const locale = useLocale();
  const payableAmount = Math.max(0, Number(booking.final_amount ?? booking.total_amount ?? 0));

  const getMethodName = (method: string) => {
    const map: Record<string, string> = {
      momo: t("methods.momo"),
      vnpay: t("methods.vnpay"),
      zalopay: t("methods.zalopay"),
      bank_transfer: t("methods.bank_transfer"),
      credit_card: t("methods.credit_card"),
      cash: t("methods.cash"),
      paypal: t("methods.paypal"),
    };
    return map[method] || method;
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-md rounded-[28px] border border-border bg-white p-6 text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <h3 className="mb-4 border-b border-border pb-4 text-lg font-semibold text-on-surface">
        {t("transaction_info")}
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-on-surface-subtle text-sm">{t("booking_code")}</span>
          <span className="font-semibold uppercase tracking-wider text-on-surface">{booking.booking_code}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-on-surface-subtle text-sm">{t("method")}</span>
          <span className="font-medium text-on-surface">{getMethodName(booking.payment_method)}</span>
        </div>

        <div className="flex justify-between items-center pt-2 mt-2 border-t border-border border-dashed">
          <span className="text-on-surface-subtle font-medium">{t("amount")}</span>
          <span className="font-black text-xl text-primary">
            {formatCurrency(payableAmount, "VND", locale === "vi" ? "vi-VN" : "en-US")}
          </span>
        </div>
      </div>
    </div>
  );
}
