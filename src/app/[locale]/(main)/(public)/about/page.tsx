"use client";

import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("common");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-6">{t("about.title")}</h1>
      <p className="text-lg text-gray-600">
        {t("about.subtitle")}
      </p>
    </div>
  );
}
