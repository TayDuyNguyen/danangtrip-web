import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const t = useTranslations("settings");
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <p className="text-gray-600">
        {t("subtitle")}
      </p>
    </div>
  );
}
