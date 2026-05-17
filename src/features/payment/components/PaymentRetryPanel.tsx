"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { IoTimeOutline } from "@/components/icons/solar";

interface Props {
  bookedAt: string;
  onRetry: () => void;
  isRetrying: boolean;
  disabled?: boolean;
}

export function PaymentRetryPanel({ bookedAt, onRetry, isRetrying, disabled }: Props) {
  const t = useTranslations("tour.payment");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const bookedTime = new Date(bookedAt).getTime();
      const expireTime = bookedTime + 15 * 60 * 1000;
      const now = new Date().getTime();
      const diff = Math.max(0, expireTime - now);

      setTimeLeft(diff);
      if (diff <= 0) {
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [bookedAt]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-[#171717]/60 border border-[#262626] rounded-2xl p-6 mt-6 w-full max-w-md mx-auto text-center shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-center gap-2 mb-4 text-[#8b6a55]">
        <IoTimeOutline className="w-5 h-5 animate-pulse" />
        <span className="text-sm font-medium tracking-wide">
          {isExpired ? t("expired_title").toUpperCase() : t("countdown_prefix").toUpperCase()}
        </span>
      </div>

      {!isExpired ? (
        <div className="text-3xl font-mono font-black text-white tracking-widest bg-[#0a0a0a]/80 py-3 px-6 rounded-lg border border-[#262626] inline-block shadow-inner">
          {formatTime(timeLeft)}
        </div>
      ) : (
        <p className="text-red-500 text-sm font-medium">
          {t("expired_message")}
        </p>
      )}

      <div className="mt-6">
        <button
          onClick={onRetry}
          disabled={isRetrying || isExpired || disabled}
          className="btn-primary w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
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
