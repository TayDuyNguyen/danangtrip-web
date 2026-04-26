import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <div className="design-page design-container design-section reveal-up">
      <div className="design-content prose-content glass-shell">
        <section className="glass-surface glass-inner rounded-lg p-8">
          <h1 className="text-4xl font-semibold mb-6 text-white">{t("title")}</h1>
          <p className="text-lg text-[#a3a3a3]">
            {t("subtitle")}
          </p>
        </section>
      </div>
    </div>
  );
}
