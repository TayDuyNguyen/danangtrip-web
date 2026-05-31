"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, IoCloseOutline, IoRefreshOutline } from "@/components/icons/solar";
import { PaymentStatus } from "@/types";

interface Props {
  status: PaymentStatus | "redirecting";
  message?: string;
}

export function PaymentStatusCard({ status, message }: Props) {
  const t = useTranslations("tour.payment");

  const config = {
    pending: {
      icon: <IoRefreshOutline className="w-16 h-16 text-yellow-500 animate-spin-slow" />,
      title: t("status_pending"),
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
    success: {
      icon: <CheckCircle2 className="w-16 h-16 text-green-500" />,
      title: t("status_success"),
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    failed: {
      icon: <IoCloseOutline className="w-16 h-16 text-red-500" />,
      title: t("status_failed"),
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
    redirecting: {
      icon: <IoRefreshOutline className="w-16 h-16 text-primary animate-spin" />,
      title: t("redirecting"),
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
  };

  // Map unpaid/partially_paid to pending/failed for UI simplicity if needed
  const normalizedStatus = 
    status === "unpaid" ? "failed" :
    status === "partially_paid" ? "pending" :
    status === "refunded" ? "failed" : status;

  const currentConfig = config[normalizedStatus] || config.pending;

  return (
    <div className="w-full animate-in fade-in zoom-in duration-500">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center rounded-[32px] border border-border bg-white px-6 py-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:px-10 md:py-12">
        <div className={`mb-6 rounded-full border p-4 ${currentConfig.bg} ${currentConfig.border}`}>
          {currentConfig.icon}
        </div>
        <h2 className={`mb-2 text-2xl font-black md:text-4xl ${currentConfig.color}`}>
          {currentConfig.title}
        </h2>
        {message && (
          <p className="mx-auto max-w-lg text-sm leading-6 text-on-surface-subtle md:text-base">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
