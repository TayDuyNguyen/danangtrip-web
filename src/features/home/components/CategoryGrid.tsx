"use client";

import { memo, useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useLocationCategories } from "../hooks/use-locations";
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
        bgColor: iconBackground ?? "#FFF4E8",
        textColor: "text-[#B45F06]",
      };
    case "international-dining":
    case "utensils":
    case "dining":
    case "am-thuc":
    case "restaurant":
    case "food":
      return {
        icon: <IoUtensilsOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#FFF4E8",
        textColor: "text-[#B45F06]",
      };
    case "nightlife":
      return {
        icon: <IoMoonOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#F7F0FF",
        textColor: "text-[#7C3AED]",
      };
    case "bar":
    case "pub":
    case "glass":
    case "bar-pub":
      return {
        icon: <IoGlassOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#F7F0FF",
        textColor: "text-[#7C3AED]",
      };
    case "mappinned":
    case "map-pinned":
    case "map-pin":
      return {
        icon: <IoMapPinOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#ECFDF5",
        textColor: "text-[#047857]",
      };
    case "luu-tru":
    case "hotel":
    case "stay":
    case "khach-san-homestay":
      return {
        icon: <IoBedOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#FFF1F2",
        textColor: "text-primary",
      };
    case "tham-quan":
    case "tour":
    case "discovery":
      return {
        icon: <IoMapOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#ECFDF5",
        textColor: "text-[#047857]",
      };
    case "mua-sam":
    case "shopping":
      return {
        icon: <IoBagHandleOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#FFF1F2",
        textColor: "text-[#E11D48]",
      };
    case "van-hoa":
    case "culture":
    case "shrine":
      return {
        icon: <IoLibraryOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#EFF6FF",
        textColor: "text-[#2563EB]",
      };
    case "giai-tri":
    case "entertainment":
      return {
        icon: <IoGameControllerOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#FFF1F2",
        textColor: "text-primary",
      };
    case "ticket":
      return { icon: <IoTicketOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#FFF4E8", textColor: "text-[#B45F06]" };
    case "home":
      return { icon: <IoHouseOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#FFF1F2", textColor: "text-primary" };
    case "pill":
    case "shield":
      return { icon: <IoShieldOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#ECFDF5", textColor: "text-[#047857]" };
    case "test-tube":
      return { icon: <IoBusinessOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#FFF1F2", textColor: "text-primary" };
    case "code":
      return { icon: <IoBusinessOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#FFF1F2", textColor: "text-primary" };
    case "rocket":
      return { icon: <IoRocketOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#FFF4E8", textColor: "text-[#B45F06]" };
    case "briefcase":
      return { icon: <IoBriefcaseOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#FFF1F2", textColor: "text-primary" };
    case "building":
    case "factory":
      return { icon: <IoBusinessOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#FFF1F2", textColor: "text-primary" };
    case "box":
      return { icon: <IoBoxOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#FFF1F2", textColor: "text-primary" };
    case "ship":
      return { icon: <IoBoatOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#EFF6FF", textColor: "text-[#2563EB]" };
    case "heart":
      return { icon: <IoHeartOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#FFF1F2", textColor: "text-[#E11D48]" };
    case "users":
    case "user":
      return { icon: <IoPeopleOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#EFF6FF", textColor: "text-[#2563EB]" };
    case "globe":
      return { icon: <IoEarthOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#ECFDF5", textColor: "text-[#047857]" };
    case "tool":
      return { icon: <IoWrenchOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#FFF1F2", textColor: "text-primary" };
    case "hard-hat":
      return { icon: <IoHardHatOutline className="w-8 h-8" />, bgColor: iconBackground ?? "#FFF4E8", textColor: "text-[#B45F06]" };
    case "flame":
      return { icon: <IoFlame className="w-8 h-8" />, bgColor: iconBackground ?? "#FFF1F2", textColor: "text-[#E11D48]" };
    default:
      return {
        icon: <IoCompassOutline className="w-8 h-8" />,
        bgColor: iconBackground ?? "#F7F7F7",
        textColor: "text-on-surface-subtle",
      };
  }
};

const CategoryGrid = () => {
  const t = useTranslations();
  const { elementRef, isVisible } = useScrollReveal();
  const { categories } = useLocationCategories();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categories]);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  // Remove early return to keep layout stable
  // if (categories.length === 0) return null;

  return (
    <section className="overflow-hidden bg-transparent py-4 font-sans">
      <div className="design-container" ref={elementRef}>
        
        {/* Header */}
        <div className={`flex justify-between items-end mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className={`transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-[2px] bg-primary/40" />
              <span className="text-xs font-semibold uppercase tracking-normal text-primary">
                {t("home.location_categories.tagline")}
              </span>
            </div>
            <h2 className="text-[28px] font-semibold leading-[1.1] text-on-surface md:text-[34px]">
              {t("home.location_categories.title_prefix")}{" "}
              <span className="text-primary underline decoration-primary/30 underline-offset-8">
                {t("home.location_categories.title_highlight")}
              </span>
            </h2>
          </div>
          <Link
            href={ROUTES.LOCATIONS}
            className={`mb-1 flex items-center rounded-full border border-border bg-white px-5 py-2.5 text-[13px] font-semibold text-on-surface shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-[#f7f7f7] hover:text-primary ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {t("home.hot_tours.explore_more")} <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Slider Wrapper */}
        <div className={`relative group/nav transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* Navigation Buttons */}
          <button
            onClick={scrollLeft}
            className={`absolute left-0 top-[40%] -translate-y-1/2 -translate-x-1/2 z-30 w-10 h-10 rounded-full bg-surface border border-border text-on-surface hover:bg-primary hover:border-primary hover:text-white flex items-center justify-center shadow-md transition-all hidden lg:flex active:scale-90 hover:scale-110 opacity-0 ${
              canScrollLeft
                ? "group-hover/nav:opacity-100 cursor-pointer"
                : "group-hover/nav:opacity-10 pointer-events-none cursor-default"
            }`}
            aria-label={t("common.accessibility.previous")}
          >
            <IoChevronBackOutline size={18} />
          </button>

          <button
            onClick={scrollRight}
            className={`absolute right-0 top-[40%] -translate-y-1/2 translate-x-1/2 z-30 w-10 h-10 rounded-full bg-surface border border-border text-on-surface hover:bg-primary hover:border-primary hover:text-white flex items-center justify-center shadow-md transition-all hidden lg:flex active:scale-90 hover:scale-110 opacity-0 ${
              canScrollRight
                ? "group-hover/nav:opacity-100 cursor-pointer"
                : "group-hover/nav:opacity-10 pointer-events-none cursor-default"
            }`}
            aria-label={t("common.accessibility.next")}
          >
            <IoChevronForwardOutline size={18} />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex items-center gap-[24px] overflow-x-auto no-scrollbar scroll-smooth px-2 py-3 snap-x snap-mandatory"
          >
            {categories.map((category, index) => {
              const theme = getCategoryTheme(category.slug, category.icon, category.icon_background);
              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}/locations`}
                  className={cn(
                    "group flex flex-col items-center justify-center shrink-0 snap-start min-w-[90px] md:min-w-[110px] pb-2 border-b-2 border-transparent hover:border-primary/60 transition-all duration-200 cursor-pointer",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                  style={{ transitionDelay: isVisible ? `${index * 40}ms` : "0ms" }}
                >
                  {/* Minimalist Icon */}
                  <div
                    className="w-9 h-9 flex items-center justify-center mb-1 text-on-surface-subtle group-hover:text-primary transition-colors duration-300"
                    title={`API icon: ${category.icon ?? "fallback"}`}
                  >
                    <div className="transition-transform duration-500 group-hover:scale-110">
                      {theme.icon}
                    </div>
                  </div>

                  {/* Name */}
                  <span className="text-[13px] font-semibold text-on-surface-subtle group-hover:text-primary transition-colors text-center line-clamp-1">
                    {category.name}
                  </span>
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
