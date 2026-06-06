"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { IoAlertCircleOutline, IoRefreshOutline, IoHomeOutline } from "@/components/icons/solar";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbfbfb] p-4">
      <div className="text-on-surface-subtleenter animate-in fade-in zoom-in duration-500 w-full max-w-lg rounded-[32px] border border-border bg-white p-12 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[24px] border border-primary/10 bg-primary/8 animate-bounce">
          <IoAlertCircleOutline className="text-on-surface-subtlexl text-primary" />
        </div>
        
        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-on-surface">
          {t("error.title")}
        </h1>
        
        <p className="text-on-surface-subtle mb-10 text-lg leading-relaxed">
          {error.message || t("error.desc")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary bg-primary px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-primary-hover sm:w-auto"
          >
            <IoRefreshOutline className="text-xl" />
            {t("error.retry")}
          </button>
          
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-[#f7f7f7] px-8 py-4 text-base font-semibold text-on-surface transition-all duration-300 hover:border-primary/20 hover:bg-[#efefef] sm:w-auto"
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
