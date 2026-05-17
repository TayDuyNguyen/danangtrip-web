"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/utils/string";
import { CheckCircle2 } from "@/components/icons/solar";

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const t = useTranslations("tour.booking");

  const methods = [
    {
      id: "momo",
      name: "Ví MoMo",
      icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2CZ43CsmUXzMcvvB4NA2rOIbUNVc7IVDPsbogI9w34AJPkKQlta94-UAwyIe_QCSOnRCEg7UgDaqFY-TOhDXrp_4Z7biCLPSVVgVRxPamGKgxE1XkggDdhPfCkTxMnhGRnjXF3gxfpDYcpPQu3FKrhis5ra7y_5VkucsICkzPKMp4UrGsfZa4wdYDAyrYHtHanSlNdtsZFnm779zVir1yGNr1-SApChhv79iKw6rqKfRi5qKwwJ2DHBoYqeptnyz0ubf6oVm_tw",
      badge: "Phổ biến",
    },
    {
      id: "vnpay",
      name: "VNPay",
      icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHM-5xmfkyzkkQzAgsaby8ijgKzvbtnyD_j7GOdLe0YwF-u4KCoAGTfdoDQW5vNgdAfnt21Qo8uvMXD9FMnrynV9SZRN4BpiDyhA93gf0yNVnpEIfxFec_7oPIDoMW7ecIftKZLdqhrq4WnSytuLibEOW7_juKydWKMmk7mCfT5a-kcigqqCvSj7Wz4s95Lkwjv4pwIcXeid4sii7ThXTKFXH0uUw3gqFS2TGZb4bDdmXTshbkoH2YDBvupSHAupR8Bjvdm_sRvQ",
    },
    {
      id: "zalopay",
      name: "ZaloPay",
      icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoBTj_apc5jF8qVe1Yy9_D8WW6f4IdRqUFItZuyzZEbELcej2Z1D6dGba6zMFFsOrTWXLJ-4hSyqP3lNwci9URDiv9AWRm1DoxP1DrUIS5MeR8hJY_WZpvmJM5JHcswqgMV8clEFD5nk2zKykFuA2OREm7NcjWpDkqTe9XW5TYspNlnmdOEtWQVQ-SUaX-RKPCxQTEJ-B6dVd4aaJCuNRKvnu7Taumo0NMLFSR6MEBXPjD8depEc8DHnTBW7h8c7VvBIMKd9EJVw",
    },
    {
        id: "bank_transfer",
        name: "Chuyển khoản",
        icon: null
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
                <img
                  src={method.icon}
                  alt={method.name}
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
