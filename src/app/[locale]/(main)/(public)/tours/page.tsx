"use client";

import { useTranslations } from "next-intl";

export default function ToursPage() {
  const t = useTranslations("common");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-6">{t("tour.list_title")}</h1>
      <p className="text-gray-600">{t("tour.list_subtitle")}</p>
    </div>
  );
}
