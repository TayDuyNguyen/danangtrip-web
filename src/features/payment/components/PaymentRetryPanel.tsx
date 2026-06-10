"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { IoTimeOutline } from "@/components/icons/solar";

interface Props {
  expiresAt?: string | null;
  fallbackStartedAt: string;
  onRetry: () => void;
  isRetrying: boolean;
  disabled?: boolean;
}

export function PaymentRetryPanel({ expiresAt, fallbackStartedAt, onRetry, isRetrying, disabled }: Props) {
  const t = useTranslations("tour.payment");
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const fallbackExpireTime = new Date(fallbackStartedAt).getTime() + 15 * 60 * 1000;
      const configuredExpireTime = expiresAt ? new Date(expiresAt).getTime() : NaN;
      const expireTime = Number.isNaN(configuredExpireTime) ? fallbackExpireTime : configuredExpireTime;
      const now = new Date().getTime();
      const diff = Math.max(0, expireTime - now);

      setTimeLeft(diff);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, fallbackStartedAt]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const isExpired = timeLeft <= 0;

  return (
    <div className="mx-auto mt-6 w-full max-w-md rounded-[28px] border border-border bg-white p-6 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-center gap-2 mb-4 text-primary">
        <IoTimeOutline className="w-5 h-5 animate-pulse" />
        <span className="text-sm font-medium tracking-wide">
          {t("countdown_prefix").toUpperCase()}
        </span>
      </div>

      <div className="inline-block rounded-2xl border border-border bg-[#f7f7f7] px-6 py-3 font-mono text-3xl font-semibold tracking-widest text-on-surface shadow-inner">
        {formatTime(timeLeft)}
      </div>

      <div className="mt-6">
        <button
          onClick={onRetry}
          disabled={isRetrying || disabled || !isExpired}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-primary-hover active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          {isRetrying ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t("redirecting")}
            </>
          ) : (
            t("retry")
          )}
        </button>
      </div>
    </div>
  );
}
