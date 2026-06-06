"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbfbfb] px-4">
      <div className="text-on-surface-subtleenter w-full max-w-xl rounded-[32px] border border-border bg-white px-8 py-12 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <h1 className="mb-6 text-6xl font-semibold text-primary transition-transform duration-300">404</h1>
        <h2 className="mb-4 text-on-surface-subtlexl font-semibold text-on-surface">
          {t("error.not_found_title")}
        </h2>
        <p className="text-on-surface-subtle mb-8 max-w-md mx-auto text-lg leading-relaxed">
          {t("error.not_found_desc")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-primary bg-primary px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-primary-hover"
          >
            {t("error.go_home")}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center rounded-full border border-border bg-[#f7f7f7] px-8 py-3.5 text-base font-semibold text-on-surface transition-all duration-300 hover:border-primary/20 hover:bg-[#efefef]"
          >
            {t("error.back")}
          </button>
        </div>
      </div>
    </div>
  );
}
