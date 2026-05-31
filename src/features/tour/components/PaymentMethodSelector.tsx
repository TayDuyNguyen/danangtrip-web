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
      name: t("payment.methods.payos", { defaultValue: "Cổng thanh toán payOS" }),
      icon: "/images/payment/payOS.png",
      badge: t("payment.badges.automatic", { defaultValue: "Tự động" }),
      enabled: isPayosEnabled,
    },
    {
      id: "vnpay",
      name: t("payment.methods.vnpay", { defaultValue: "Cổng thanh toán VNPAY" }),
      icon: "/images/payment/vnpay.png",
      badge: t("payment.badges.automatic", { defaultValue: "Tự động" }),
      enabled: isVnpayEnabled,
    },
    {
      id: "momo",
      name: t("payment.methods.momo", { defaultValue: "Ví điện tử MoMo" }),
      icon: "/images/payment/momo.png",
      badge: t("payment.badges.automatic", { defaultValue: "Tự động" }),
      enabled: isMomoEnabled,
    },
    {
      id: "zalopay",
      name: t("payment.methods.zalopay", { defaultValue: "Ví điện tử ZaloPay" }),
      icon: "/images/payment/zalopay.png",
      badge: t("payment.badges.automatic", { defaultValue: "Tự động" }),
      enabled: isZalopayEnabled,
    },
    {
      id: "bank_transfer",
      name: t("payment.methods.bank_transfer_manual", { defaultValue: "Chuyển khoản thủ công / COD" }),
      icon: null,
      badge: t("payment.badges.manual", { defaultValue: "Thủ công" }),
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
              ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(139,106,85,0.1)]"
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
            <span className="bg-success/20 text-success text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
              {method.badge}
            </span>
          )}
        </label>
      ))}
    </div>
  );
}
