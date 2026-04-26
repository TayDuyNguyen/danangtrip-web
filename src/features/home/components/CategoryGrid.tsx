"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import { useTranslations } from "next-intl";
import { useLocations } from "../hooks/use-locations";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  IoRestaurantOutline,
  IoBedOutline,
  IoMapOutline,
  IoBagHandleOutline,
  IoLibraryOutline,
  IoGameControllerOutline,
  IoCompassOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";

const getCategoryTheme = (slug: string) => {
  // Mapping based on common categories and Stitch design audit
  switch (slug) {
    case "am-thuc":
    case "restaurant":
    case "food":
      return {
        icon: <IoRestaurantOutline className="w-8 h-8" />,
        bgColor: "bg-[#2b1f14]",
        textColor: "text-[#c59a5f]",
      };
    case "luu-tru":
    case "hotel":
    case "stay":
      return {
        icon: <IoBedOutline className="w-8 h-8" />,
        bgColor: "bg-[#171717]",
        textColor: "text-[#8b6a55]",
      };
    case "tham-quan":
    case "tour":
    case "discovery":
      return {
        icon: <IoMapOutline className="w-8 h-8" />,
        bgColor: "bg-[#1a1f14]",
        textColor: "text-[#929852]",
      };
    case "mua-sam":
    case "shopping":
      return {
        icon: <IoBagHandleOutline className="w-8 h-8" />,
        bgColor: "bg-[#2a1616]",
        textColor: "text-[#d88484]",
      };
    case "van-hoa":
    case "culture":
    case "shrine":
      return {
        icon: <IoLibraryOutline className="w-8 h-8" />,
        bgColor: "bg-[#2b1f14]",
        textColor: "text-[#c59a5f]",
      };
    case "giai-tri":
    case "entertainment":
      return {
        icon: <IoGameControllerOutline className="w-8 h-8" />,
        bgColor: "bg-[#171717]",
        textColor: "text-[#8b6a55]",
      };
    default:
      return {
        icon: <IoCompassOutline className="w-8 h-8" />,
        bgColor: "bg-[#171717]",
        textColor: "text-[#737373]",
      };
  }
};

const CategoryGrid = () => {
  const { categories } = useLocations();
  const t = useTranslations();
  const { elementRef, isVisible } = useScrollReveal(0.1);

  const scrollLeft = () => {
    const el = document.getElementById("categories-scroll");
    if (el) el.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    const el = document.getElementById("categories-scroll");
    if (el) el.scrollBy({ left: 300, behavior: "smooth" });
  };

  // Remove early return to keep layout stable
  // if (categories.length === 0) return null;

  return (
    <section className="py-[120px] bg-surface font-sans overflow-hidden">
      <div className="design-container" ref={elementRef}>
        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className={`flex items-center justify-center gap-4 mb-6 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <span className="w-12 h-[2px] bg-[#8b6a55]/30" />
            <span className="text-[#8b6a55] font-black text-[12px] tracking-[0.4em] uppercase">
              {t("home.hero_tagline_premium")}
            </span>
            <span className="w-12 h-[2px] bg-[#8b6a55]/30" />
          </div>
          <h2 className={`text-[36px] md:text-[48px] font-black leading-[1.1] mb-8 text-white transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {t("home.categories_title_prefix")}{" "}
            <span className="text-[#8b6a55] underline decoration-[#8b6a55]/30 underline-offset-8">
              {t("home.categories_title_highlight")}
            </span>
          </h2>
          <p className={`text-[#a3a3a3] text-[18px] max-w-2xl mx-auto font-medium leading-relaxed transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {t("home.categories_subtitle")}
          </p>
        </div>

        {/* Slider Wrapper */}
        <div className={`relative group/nav transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* Navigation Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-[45%] -translate-y-1/2 -translate-x-1/2 z-30 w-12 h-12 rounded-full bg-[#171717] border border-[#262626] items-center justify-center text-[#d4d4d4] hover:border-[#8b6a55] hover:text-[#8b6a55] shadow-xl transition-all opacity-0 group-hover/nav:opacity-100 hidden lg:flex active:scale-90"
            aria-label={t("common.accessibility.previous")}
          >
            <IoChevronBackOutline size={20} />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-[45%] -translate-y-1/2 translate-x-1/2 z-30 w-12 h-12 rounded-full bg-[#171717] border border-[#262626] items-center justify-center text-[#d4d4d4] hover:border-[#8b6a55] hover:text-[#8b6a55] shadow-xl transition-all opacity-0 group-hover/nav:opacity-100 hidden lg:flex active:scale-90"
            aria-label={t("common.accessibility.next")}
          >
            <IoChevronForwardOutline size={20} />
          </button>

          {/* Scrollable Container */}
          <div
            id="categories-scroll"
            className="flex items-center gap-10 md:gap-16 overflow-x-auto no-scrollbar scroll-smooth px-8 md:px-12 py-4"
          >
            {categories.map((category, index) => {
              const theme = getCategoryTheme(category.slug);
              return (
                <Link
                  key={category.id}
                  href={`${ROUTES.LOCATIONS}?category=${category.id}`}
                  className="group flex flex-col items-center gap-6 shrink-0"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  {/* Circle Icon Container */}
                  <div
                    className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center ${theme.bgColor} ${theme.textColor} transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]`}
                  >
                    <div className="transition-transform duration-500 group-hover:rotate-12">
                      {theme.icon}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="text-center">
                    <h3 className="text-[16px] md:text-[18px] font-black text-white group-hover:text-[#8b6a55] transition-colors uppercase tracking-wider">
                      {category.name}
                    </h3>
                    <div className="h-1 w-0 bg-[#8b6a55] mx-auto mt-2 transition-all duration-300 group-hover:w-full rounded-full" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(CategoryGrid);
