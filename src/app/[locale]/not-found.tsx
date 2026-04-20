"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-6 group-hover:scale-110 transition-transform duration-300">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {t("error.not_found_title")}
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg leading-relaxed">
          {t("error.not_found_desc")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3.5 border border-transparent text-base font-bold rounded-2xl text-white bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:-translate-y-1 active:scale-95"
          >
            {t("error.go_home")}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-8 py-3.5 border border-gray-200 text-base font-bold rounded-2xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 hover:border-cyan-500/30"
          >
            {t("error.back")}
          </button>
        </div>
      </div>
    </div>
  );
}
