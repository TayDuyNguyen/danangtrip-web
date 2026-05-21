"use client";
import { useTranslations } from "next-intl";

export const ContactHero = () => {
  const t = useTranslations("contact");

  return (
    <section className="relative py-24 md:py-32 overflow-hidden reveal-up">
      <div className="container relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
          {t("hero.title")}
        </h1>
        <p className="text-lg md:text-xl text-[#a3a3a3] max-w-2xl mx-auto font-medium leading-relaxed">
          {t("hero.subtitle")}
        </p>
      </div>
      
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-primary/10 blur-[120px] -z-10 rounded-full" />
    </section>
  );
};
