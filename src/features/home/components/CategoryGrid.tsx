"use client";

import { memo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import { useTranslations } from "next-intl";
import { useLocations } from "../hooks/use-locations";

const CategoryGrid = () => {
  const { categories } = useLocations();
  const t = useTranslations();

  if (categories.length === 0) return null;

  return (
    <section className="py-[120px] bg-surface font-sans overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20 reveal-up">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-12 h-[2px] bg-azure/30" />
            <span className="text-azure font-black text-[12px] tracking-[0.4em] uppercase">
              {t("home.hero_tagline_premium")}
            </span>
            <span className="w-12 h-[2px] bg-azure/30" />
          </div>
          <h2 className="text-[36px] md:text-[48px] font-black leading-[1.1] mb-8 text-dark">
            {t("home.categories_title_prefix")} <span className="text-azure underline decoration-azure/30 underline-offset-8">{t("home.categories_title_highlight")}</span>
          </h2>
          <p className="text-slate-500 text-[18px] max-w-2xl mx-auto font-medium leading-relaxed">
            {t("home.categories_subtitle")}
          </p>
        </div>


        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.slice(0, 4).map((category, index) => (
            <Link
              key={category.id}
              href={`${ROUTES.LOCATIONS}?category=${category.slug}`}
              className="group relative h-[300px] rounded-[40px] overflow-hidden shadow-xl reveal-up"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <Image
                src={category.image || "/images/placeholder.png"}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white text-[24px] font-black leading-tight mb-2 group-hover:text-azure transition-colors">
                  {category.name}
                </h3>
                <p className="text-white/70 text-[14px] font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                   {t("home.tour_categories.cta")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(CategoryGrid);
