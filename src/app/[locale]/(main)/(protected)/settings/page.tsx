import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const t = useTranslations("settings");
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">{t("title")}</h1>
      <div className="glass-shell">
        <div className="glass-surface glass-inner rounded-lg p-6">
          <p className="text-[#a3a3a3]">
            {t("subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
}
