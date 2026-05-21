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
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className={`p-4 rounded-full ${currentConfig.bg} ${currentConfig.border} border mb-6`}>
        {currentConfig.icon}
      </div>
      <h2 className={`text-2xl font-black mb-2 ${currentConfig.color}`}>
        {currentConfig.title}
      </h2>
      {message && (
        <p className="text-on-surface-subtle text-sm max-w-sm mx-auto">
          {message}
        </p>
      )}
    </div>
  );
}
