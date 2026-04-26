"use client";

import { useTranslations } from "next-intl";

export default function DashboardSettingsPage() {
  const t = useTranslations("dashboardAdmin");

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-white tracking-tight">
        {t("settings.title")}
      </h1>
      <div className="bg-[#080808] p-8 rounded-xl border border-[#262626]">
        <p className="text-[#a3a3a3]">
          {t("settings.description")}
        </p>
      </div>
    </div>
  );
}
