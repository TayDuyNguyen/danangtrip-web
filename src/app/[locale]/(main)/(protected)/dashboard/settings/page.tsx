"use client";

import { useTranslations } from "next-intl";

export default function DashboardSettingsPage() {
  const t = useTranslations("dashboardAdmin");

  return (
    <div className="max-w-4xl">
      <h1 className="text-on-surface-subtlexl font-bold mb-6 text-white tracking-tight">
        {t("settings.title")}
      </h1>
      <div className="bg-surface-container-low p-8 rounded-xl border border-border">
        <p className="text-[#a3a3a3]">
          {t("settings.description")}
        </p>
      </div>
    </div>
  );
}
