"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTours } from "../hooks/use-tours";

const TourCategories = () => {
  const { tourCategories: categories } = useTours();
  const t = useTranslations();

  if (categories.length === 0) return null;

  return (
    <section className="py-[60px] bg-white font-sans">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-[24px] reveal-up">
          <h2 className="text-[24px] font-bold text-[#1E293B]">
            {t("home.tour_categories.title")}
          </h2>
          <Link href={ROUTES.TOURS} className="text-[14px] text-azure font-semibold hover:underline">
            {t("common.tour.see_all")}
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[16px]">
          {categories.slice(0, 6).map((category, index) => (
            <Link
              key={category.id}
              href={`${ROUTES.TOURS}?category=${category.slug}`}
              className="group flex flex-col items-center p-[20px] rounded-[24px] bg-[#F8FAFC] hover:bg-white hover:shadow-[0_12px_24px_rgba(0,102,204,0.1)] transition-all duration-300 border border-transparent hover:border-azure/10 reveal-up"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="w-[64px] h-[64px] relative mb-[12px] p-[12px] bg-white rounded-[20px] shadow-sm group-hover:shadow-md transition-all">
                <Image
                  src={category.icon || "/images/placeholder.png"}
                  alt={category.name}
                  fill
                  className="object-contain p-3"
                />
              </div>
              <span className="text-[14px] font-bold text-[#1E293B] group-hover:text-azure transition-colors text-center">
                {category.name}
              </span>
              <span className="text-[11px] text-[#64748B] mt-1">
                 {t("home.tour_categories.cta")}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(TourCategories);
