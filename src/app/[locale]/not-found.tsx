"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808]">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-white mb-6 group-hover:scale-110 transition-transform duration-300">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">
          {t("error.not_found_title")}
        </h2>
        <p className="text-on-surface-subtle mb-8 max-w-md mx-auto text-lg leading-relaxed">
          {t("error.not_found_desc")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3.5 border border-[#8b6a55] text-base font-bold rounded-xl text-white bg-[#8b6a55] hover:bg-[#5c3822] shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1 active:scale-95"
          >
            {t("error.go_home")}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-8 py-3.5 border border-[#262626] text-base font-bold rounded-xl text-white bg-[#171717] hover:bg-[#1f1f1f] transition-all duration-300 hover:border-[#8b6a55]/30"
          >
            {t("error.back")}
          </button>
        </div>
      </div>
    </div>
  );
}
