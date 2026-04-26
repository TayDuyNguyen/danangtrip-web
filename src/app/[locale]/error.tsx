"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { IoAlertCircleOutline, IoRefreshOutline, IoHomeOutline } from "react-icons/io5";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  const t = useTranslations("common");

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] p-4">
      <div className="text-center max-w-lg w-full bg-[#111111]/90 p-12 rounded-xl shadow-xl shadow-black/40 border border-[#262626] animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-[#171717] rounded-xl flex items-center justify-center mx-auto mb-8 animate-bounce border border-[#5c3822]/40">
          <IoAlertCircleOutline className="text-5xl text-[#8b6a55]" />
        </div>
        
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
          {t("error.title")}
        </h1>
        
        <p className="text-on-surface-subtle mb-10 text-lg leading-relaxed">
          {error.message || t("error.desc")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#8b6a55] text-base font-bold rounded-xl text-white bg-[#8b6a55] hover:bg-[#5c3822] shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1 active:scale-95"
          >
            <IoRefreshOutline className="text-xl" />
            {t("error.retry")}
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#262626] text-base font-bold rounded-xl text-white bg-[#171717] hover:bg-[#1f1f1f] transition-all duration-300 hover:border-[#8b6a55]/30"
          >
            <IoHomeOutline className="text-xl" />
            {t("error.go_home")}
          </Link>
        </div>
        
        {error.digest && (
          <p className="mt-8 text-xs text-on-surface-subtle font-mono tracking-wider">
            ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
