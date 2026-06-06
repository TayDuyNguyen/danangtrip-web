"use client";
import { useTranslations } from "next-intl";

export const ContactHero = () => {
  const t = useTranslations("contact");

  return (
    <section className="reveal-up relative overflow-hidden pb-6 pt-12 md:pb-8 md:pt-16">
      <div className="container relative z-10 text-center">
        <h1 className="mb-6 text-4xl font-semibold tracking-tight text-on-surface md:text-6xl lg:text-4xl">
          {t("hero.title")}
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-on-surface-subtle md:text-xl">
          {t("hero.subtitle")}
        </p>
      </div>
    </section>
  );
};
