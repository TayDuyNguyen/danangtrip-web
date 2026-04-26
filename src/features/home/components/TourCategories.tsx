"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  IoLeafOutline,
  IoUmbrellaOutline,
  IoBusinessOutline,
  IoFlashOutline,
  IoCompassOutline,
  IoWalkOutline
} from "react-icons/io5";
import { useTours } from "../hooks/use-tours";

const IconMapper = ({ icon, className }: { icon: string; className?: string }) => {
  if (icon.startsWith("/") || icon.startsWith("http")) {
    return (
      <Image
        src={icon}
        alt="Category icon"
        fill
        sizes="40px"
        className={`object-contain ${className}`}
      />
    );
  }

  switch (icon) {
    case "mountain":
      return <IoLeafOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "beach_access":
      return <IoUmbrellaOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "fort":
      return <IoBusinessOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "trending_up":
      return <IoFlashOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "adventure":
      return <IoCompassOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    default:
      return <IoWalkOutline className={`w-full h-full text-[#737373] ${className}`} />;
  }
};

const TourCategories = () => {
  const { tourCategories: categories } = useTours();
  const t = useTranslations();

  if (categories.length === 0) return null;

  return (
    <section className="py-[60px] bg-[#080808] font-sans">
      <div className="design-container">
        <div className="flex justify-between items-center mb-[24px] reveal-up">
          <h2 className="text-[24px] font-bold text-white">
            {t("home.tour_categories.title")}
          </h2>
          <Link href={ROUTES.TOURS} className="text-[14px] text-[#8b6a55] font-semibold hover:underline">
            {t("common.tour.see_all")}
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[16px]">
          {categories.slice(0, 6).map((category, index) => (
            <Link
              key={category.id}
              href={`${ROUTES.TOURS}?category=${category.id}`}
              className="group flex flex-col items-center p-[20px] rounded-xl bg-[#080808] hover:bg-[#111111] hover:shadow-[0_12px_24px_rgba(0,0,0,0.35)] transition-all duration-300 border border-[#262626] hover:border-[#8b6a55]/30 reveal-up"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="w-[64px] h-[64px] flex items-center justify-center mb-[12px] p-[16px] bg-[#171717] rounded-lg border border-[#262626] transition-all relative">
                <IconMapper icon={category.icon} />
              </div>
              <span className="text-[14px] font-bold text-white group-hover:text-[#8b6a55] transition-colors text-center">
                {category.name}
              </span>
              <span className="text-[11px] text-[#737373] mt-1">
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
