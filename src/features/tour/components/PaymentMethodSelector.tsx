"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/string";
import { useAppConfig } from "@/hooks/use-app-config";

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const t = useTranslations("tour");
  const { data: config } = useAppConfig();

  const isSepayEnabled = (config?.payment?.sepay ?? config?.payment?.payos) !== false;
  const isCodEnabled = config?.payment?.cod !== false;

  const methods = [
    {
      id: "sepay",
      name: t("payment.methods.sepay"),
      icon: "/images/payment/logo-sepay-blue.svg",
      badge: t("payment.badges.automatic"),
      enabled: isSepayEnabled,
    },
    {
      id: "bank_transfer",
      name: t("payment.methods.bank_transfer_manual"),
      icon: null,
      badge: t("payment.badges.manual"),
      enabled: isCodEnabled,
    }
  ].filter((m) => m.enabled);

  // Auto-select first active option if current selection is invalid or filtered out
  useEffect(() => {
    if (methods.length > 0 && !methods.some((m) => m.id === value)) {
      onChange(methods[0].id);
    }
  }, [methods, value, onChange]);

  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <label
          key={method.id}
          className={cn(
            "flex items-center justify-between p-4 rounded-xl cursor-pointer border-2 transition-all duration-300",
            value === method.id
              ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(255,56,92,0.12)]"
              : "border-border bg-[#f7f7f7] hover:border-primary/30 hover:bg-white"
          )}
        >
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="payment"
              checked={value === method.id}
              onChange={() => onChange(method.id)}
              className="w-4 h-4 text-primary focus:ring-primary bg-transparent border-border"
            />
            <div className="flex items-center gap-3">
              {method.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={method.icon}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-lg bg-white object-contain p-0.5"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-black uppercase text-primary">
                  QR
                </span>
              )}
              <span className={cn(
                "text-sm font-bold",
                value === method.id ? "text-primary" : "text-on-surface"
              )}>
                {method.name}
              </span>
            </div>
          </div>
          {method.badge && (
            <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-normal text-success">
              {method.badge}
            </span>
          )}
        </label>
      ))}
    </div>
  );
}
