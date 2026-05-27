"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/string";

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const t = useTranslations("tour");

  const methods = [
    {
      id: "payos",
      name: t("payment.methods.payos"),
      icon: "/images/payment/payOS.png",
      badge: t("payment.badges.automatic"),
    },
    {
      id: "bank_transfer",
      name: t("payment.methods.bank_transfer_manual"),
      icon: null,
      badge: t("payment.badges.manual"),
    }
  ];

  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <label
          key={method.id}
          className={cn(
            "flex items-center justify-between p-4 rounded-xl cursor-pointer border-2 transition-all duration-300",
            value === method.id
              ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(139,106,85,0.1)]"
              : "border-border bg-surface-container-low hover:border-border-strong"
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
