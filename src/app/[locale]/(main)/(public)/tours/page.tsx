"use client";

import { useTranslations } from "next-intl";

export default function ToursPage() {
  const t = useTranslations("common");

  return (
    <div className="design-page design-container design-section reveal-up">
      <div className="glass-shell">
        <section className="glass-surface glass-inner rounded-lg p-8">
          <h1 className="text-4xl font-semibold mb-6 text-white">{t("tour.list_title")}</h1>
          <p className="text-[#a3a3a3]">{t("tour.list_subtitle")}</p>
        </section>
      </div>
    </div>
  );
}
