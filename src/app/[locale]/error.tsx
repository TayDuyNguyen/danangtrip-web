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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-lg w-full bg-white p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
          <IoAlertCircleOutline className="text-5xl text-red-500" />
        </div>
        
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
          {t("error.title")}
        </h1>
        
        <p className="text-gray-500 mb-10 text-lg leading-relaxed">
          {error.message || t("error.desc")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-transparent text-base font-bold rounded-2xl text-white bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:-translate-y-1 active:scale-95"
          >
            <IoRefreshOutline className="text-xl" />
            {t("error.retry")}
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-200 text-base font-bold rounded-2xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 hover:border-cyan-500/30"
          >
            <IoHomeOutline className="text-xl" />
            {t("error.go_home")}
          </Link>
        </div>
        
        {error.digest && (
          <p className="mt-8 text-xs text-gray-400 font-mono tracking-wider">
            ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
