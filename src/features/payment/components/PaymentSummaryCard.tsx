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
    <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-6 mt-8 w-full max-w-md mx-auto text-left shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-4 pb-4 border-b border-[#262626]">
        {t("transaction_info")}
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-on-surface-subtle text-sm">{t("booking_code")}</span>
          <span className="font-semibold text-white uppercase tracking-wider">{booking.booking_code}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-on-surface-subtle text-sm">{t("method")}</span>
          <span className="font-medium text-[#d4d4d4]">{getMethodName(booking.payment_method)}</span>
        </div>

        <div className="flex justify-between items-center pt-2 mt-2 border-t border-[#262626] border-dashed">
          <span className="text-on-surface-subtle font-medium">{t("amount")}</span>
          <span className="font-black text-xl text-primary">
            {formatCurrency(booking.total_amount, "VND", locale === "vi" ? "vi-VN" : "en-US")}
          </span>
        </div>
      </div>
    </div>
  );
}
