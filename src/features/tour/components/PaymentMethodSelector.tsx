"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/string";

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const t = useTranslations("tour");
  const method = {
    id: "sepay",
    name: t("payment.methods.sepay"),
    icon: "/images/payment/logo-sepay-blue.svg",
    badge: t("payment.badges.automatic"),
  };

  useEffect(() => {
    if (value !== method.id) {
      onChange(method.id);
    }
  }, [method.id, onChange, value]);

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "flex items-center justify-between rounded-xl border-2 border-primary bg-primary/5 p-4 shadow-[0_0_20px_rgba(255,56,92,0.12)]",
        )}
      >
        <div className="flex items-center gap-4">
          <input
            type="radio"
            name="payment"
            checked
            readOnly
            className="h-4 w-4 border-border bg-transparent text-primary focus:ring-primary"
          />
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={method.icon}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg bg-white object-contain p-0.5"
            />
            <span className="text-sm font-bold text-primary">{method.name}</span>
          </div>
        </div>
        <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-normal text-success">
          {method.badge}
        </span>
      </div>
    </div>
  );
}
