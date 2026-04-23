"use client";

import { useTranslations } from "next-intl";

export default function DashboardSettingsPage() {
  const t = useTranslations("dashboardAdmin");

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight">
        {t("settings.title")}
      </h1>
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
        <p className="text-gray-600">
          {t("settings.description")}
        </p>
      </div>
    </div>
  );
}
