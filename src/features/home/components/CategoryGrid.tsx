"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import { useTranslations } from "next-intl";
import { useLocations } from "../hooks/use-locations";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  IoBedOutline,
  IoMapOutline,
  IoMapPinOutline,
  IoBagHandleOutline,
  IoLibraryOutline,
  IoGameControllerOutline,
  IoCompassOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCoffeeOutline,
  IoUtensilsOutline,
  IoMoonOutline,
  IoGlassOutline,
  IoTicketOutline,
  IoHouseOutline,
  IoShieldOutline,
  IoRocketOutline,
  IoBriefcaseOutline,
  IoBusinessOutline,
  IoBoxOutline,
  IoBoatOutline,
  IoHeartOutline,
  IoPeopleOutline,
  IoEarthOutline,
  IoWrenchOutline,
  IoHardHatOutline,
  IoFlame,
} from "@/components/icons/solar";

const normalizeIconKey = (value?: string | null) => value?.trim().toLowerCase().replace(/_/g, "-");

const getCategoryTheme = (slug: string, icon?: string | null, iconBackground?: string | null) => {
  const key = normalizeIconKey(icon) || slug;

  switch (key) {
    case "music":
    case "coffee":
    case "cafe":
    case "ca-phe-tra-sua":
      return {
        icon: <IoCoffeeOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#2b1f14",
        textColor: "text-[#c59a5f]",
      };
    case "international-dining":
    case "utensils":
    case "dining":
    case "am-thuc":
    case "restaurant":
    case "food":
      return {
        icon: <IoUtensilsOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#2b1f14",
        textColor: "text-[#c59a5f]",
      };
    case "nightlife":
      return {
        icon: <IoMoonOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#221622",
        textColor: "text-[#d884c7]",
      };
    case "bar":
    case "pub":
    case "glass":
    case "bar-pub":
      return {
        icon: <IoGlassOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#221622",
        textColor: "text-[#d884c7]",
      };
    case "mappinned":
    case "map-pinned":
    case "map-pin":
      return {
        icon: <IoMapPinOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#1a1f14",
        textColor: "text-[#929852]",
      };
    case "luu-tru":
    case "hotel":
    case "stay":
    case "khach-san-homestay":
      return {
        icon: <IoBedOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#171717",
        textColor: "text-[#8b6a55]",
      };
    case "tham-quan":
    case "tour":
    case "discovery":
      return {
        icon: <IoMapOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#1a1f14",
        textColor: "text-[#929852]",
      };
    case "mua-sam":
    case "shopping":
      return {
        icon: <IoBagHandleOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#2a1616",
        textColor: "text-[#d88484]",
      };
    case "van-hoa":
    case "culture":
    case "shrine":
      return {
        icon: <IoLibraryOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#2b1f14",
        textColor: "text-[#c59a5f]",
      };
    case "giai-tri":
    case "entertainment":
      return {
        icon: <IoGameControllerOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#171717",
        textColor: "text-[#8b6a55]",
      };
    case "ticket":
      return { icon: <IoTicketOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#1f1a14", textColor: "text-[#c59a5f]" };
    case "home":
      return { icon: <IoHouseOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#171717", textColor: "text-[#8b6a55]" };
    case "pill":
    case "shield":
      return { icon: <IoShieldOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#12201a", textColor: "text-[#7dd3a8]" };
    case "test-tube":
      return { icon: <IoBusinessOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#171717", textColor: "text-[#8b6a55]" };
    case "code":
      return { icon: <IoBusinessOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#171717", textColor: "text-[#8b6a55]" };
    case "rocket":
      return { icon: <IoRocketOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#1f1a14", textColor: "text-[#c59a5f]" };
    case "briefcase":
      return { icon: <IoBriefcaseOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#171717", textColor: "text-[#8b6a55]" };
    case "building":
    case "factory":
      return { icon: <IoBusinessOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#171717", textColor: "text-[#8b6a55]" };
    case "box":
      return { icon: <IoBoxOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#171717", textColor: "text-[#8b6a55]" };
    case "ship":
      return { icon: <IoBoatOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#11202a", textColor: "text-[#7fb7d8]" };
    case "heart":
      return { icon: <IoHeartOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#2a161f", textColor: "text-[#d884a6]" };
    case "users":
    case "user":
      return { icon: <IoPeopleOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#17202a", textColor: "text-[#8ab4d8]" };
    case "globe":
      return { icon: <IoEarthOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#1a1f14", textColor: "text-[#929852]" };
    case "tool":
      return { icon: <IoWrenchOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#171717", textColor: "text-[#8b6a55]" };
    case "hard-hat":
      return { icon: <IoHardHatOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#1f1a14", textColor: "text-[#c59a5f]" };
    case "flame":
      return { icon: <IoFlame className="w-8 h-8" />, bgColor: iconBackground ?? "#2a1616", textColor: "text-[#d88484]" };
    default:
      return {
        icon: <IoCompassOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#171717",
        textColor: "text-[#737373]",
      };
  }
};

const CategoryGrid = () => {
  const { categories } = useLocations();
  const t = useTranslations();
  const { elementRef, isVisible } = useScrollReveal();

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
    <section className="py-[120px] bg-surface/12 backdrop-blur-[1px] font-sans overflow-hidden">
      <div className="design-container relative" ref={elementRef}>
        <Link
          href={ROUTES.LOCATIONS}
          className={`absolute right-4 top-0 text-[14px] text-[#8b6a55] font-semibold hover:underline transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {t("common.tour.see_all")}
        </Link>

        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className={`flex items-center justify-center gap-4 mb-6 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <span className="w-12 h-[2px] bg-[#8b6a55]/30" />
            <span className="text-[#8b6a55] font-black text-[12px] tracking-[0.4em] uppercase">
              {t("home.location_categories.tagline")}
            </span>
            <span className="w-12 h-[2px] bg-[#8b6a55]/30" />
          </div>
          <h2 className={`text-[36px] md:text-[48px] font-black leading-[1.1] mb-8 text-white transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {t("home.location_categories.title_prefix")}{" "}
            <span className="text-[#8b6a55] underline decoration-[#8b6a55]/30 underline-offset-8">
              {t("home.location_categories.title_highlight")}
            </span>
          </h2>
          <p className={`text-[#a3a3a3] text-[18px] max-w-2xl mx-auto font-medium leading-relaxed transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {t("home.location_categories.subtitle")}
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
              const theme = getCategoryTheme(category.slug, category.icon, category.icon_background);
              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}/locations`}
                  className="group flex flex-col items-center gap-6 shrink-0"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  {/* Circle Icon Container */}
                  <div
                    className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center ${theme.textColor} transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]`}
                    style={{ backgroundColor: theme.bgColor }}
                    title={`API icon: ${category.icon ?? "fallback"}${category.icon_background ? ` | API color: ${category.icon_background}` : ""}`}
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
