"use client";

import { useEffect } from "react";
import Image from "next/image";
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

  const isPayosEnabled = config?.payment?.payos !== false;
  const isCodEnabled = config?.payment?.cod !== false;
  const isVnpayEnabled = !!config?.payment?.vnpay;
  const isMomoEnabled = !!config?.payment?.momo;
  const isZalopayEnabled = !!config?.payment?.zalopay;

  const methods = [
    {
      id: "payos",
      name: t("payment.methods.payos"),
      icon: "/images/payment/payOS.png",
      badge: t("payment.badges.automatic"),
      enabled: isPayosEnabled,
    },
    {
      id: "vnpay",
      name: t("payment.methods.vnpay"),
      icon: "/images/payment/vnpay.png",
      badge: t("payment.badges.automatic"),
      enabled: isVnpayEnabled,
    },
    {
      id: "momo",
      name: t("payment.methods.momo"),
      icon: "/images/payment/momo.png",
      badge: t("payment.badges.automatic"),
      enabled: isMomoEnabled,
    },
    {
      id: "zalopay",
      name: t("payment.methods.zalopay"),
      icon: "/images/payment/zalopay.png",
      badge: t("payment.badges.automatic"),
      enabled: isZalopayEnabled,
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
              {method.icon && (
                <Image
                  src={method.icon}
                  alt={method.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-lg object-contain bg-white p-0.5"
                />
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
