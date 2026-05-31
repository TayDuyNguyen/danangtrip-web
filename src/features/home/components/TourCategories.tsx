"use client";

import { memo, useState, useEffect, useRef } from "react";
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
  IoWalkOutline,
  IoPlaneOutline,
  IoRestaurantOutline,
  IoBedOutline,
  IoMapOutline,
  IoHeartOutline,
  IoPeopleOutline,
  IoCameraOutline,
  IoCarSportOutline,
  IoBicycleOutline,
  IoBoatOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "@/components/icons/solar";
import { useHomeTourCategories } from "../hooks/use-tours";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

const IconMapper = ({ icon, className }: { icon?: string | null; className?: string }) => {
  if (typeof icon === "string" && (icon.startsWith("/") || icon.startsWith("http"))) {
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

  switch (icon?.toLowerCase()) {
    case "mountain":
    case "tree":
    case "trees":
    case "nature":
      return <IoLeafOutline className={`w-full h-full text-primary ${className}`} />;
    case "beach_access":
    case "beach":
    case "umbrella":
      return <IoUmbrellaOutline className={`w-full h-full text-primary ${className}`} />;
    case "fort":
    case "landmark":
    case "building":
      return <IoBusinessOutline className={`w-full h-full text-primary ${className}`} />;
    case "trending_up":
    case "hot":
    case "flash":
      return <IoFlashOutline className={`w-full h-full text-primary ${className}`} />;
    case "adventure":
    case "compass":
      return <IoCompassOutline className={`w-full h-full text-primary ${className}`} />;
    case "plane":
    case "flight":
      return <IoPlaneOutline className={`w-full h-full text-primary ${className}`} />;
    case "food":
    case "restaurant":
    case "utensils":
      return <IoRestaurantOutline className={`w-full h-full text-primary ${className}`} />;
    case "hotel":
    case "resort":
    case "bed":
      return <IoBedOutline className={`w-full h-full text-primary ${className}`} />;
    case "map":
    case "route":
      return <IoMapOutline className={`w-full h-full text-primary ${className}`} />;
    case "heart":
    case "honeymoon":
      return <IoHeartOutline className={`w-full h-full text-primary ${className}`} />;
    case "family":
    case "team":
    case "users":
      return <IoPeopleOutline className={`w-full h-full text-primary ${className}`} />;
    case "camera":
    case "photo":
      return <IoCameraOutline className={`w-full h-full text-primary ${className}`} />;
    case "car":
    case "jeep":
      return <IoCarSportOutline className={`w-full h-full text-primary ${className}`} />;
    case "bike":
    case "bicycle":
      return <IoBicycleOutline className={`w-full h-full text-primary ${className}`} />;
    case "boat":
    case "ship":
    case "cruise":
      return <IoBoatOutline className={`w-full h-full text-primary ${className}`} />;
    default:
      return <IoWalkOutline className={`w-full h-full text-on-surface-subtle ${className}`} />;
  }
};

const resolveTourCategoryIcon = (icon: string | null, slug: string, name: string) => {
  if (icon) return icon;

  const source = `${slug} ${name}`.toLowerCase();
  if (source.includes("ba-na") || source.includes("núi") || source.includes("thien-nhien") || source.includes("thiên nhiên")) return "mountain";
  if (source.includes("bien") || source.includes("biển") || source.includes("dao") || source.includes("đảo")) return "beach";
  if (source.includes("hoi-an") || source.includes("hội an") || source.includes("hue") || source.includes("huế") || source.includes("tam-linh")) return "landmark";
  if (source.includes("am-thuc") || source.includes("ẩm thực")) return "restaurant";
  if (source.includes("nghi-duong") || source.includes("nghỉ dưỡng") || source.includes("luxury")) return "hotel";
  if (source.includes("gia-dinh") || source.includes("team")) return "family";
  if (source.includes("trang-mat") || source.includes("trăng mật")) return "heart";
  if (source.includes("nhiep-anh") || source.includes("nhiếp ảnh")) return "camera";
  if (source.includes("jeep") || source.includes("xe-may")) return "jeep";
  if (source.includes("dap-xe") || source.includes("đạp xe")) return "bike";
  if (source.includes("du-thuyen") || source.includes("thuyen") || source.includes("thuyền")) return "boat";
  if (source.includes("mao-hiem") || source.includes("mạo hiểm")) return "adventure";

  return "map";
};

const TourCategories = () => {
  const t = useTranslations();
  const { elementRef, isVisible } = useScrollReveal();
  const { categories } = useHomeTourCategories();
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

  return (
    <section className="py-4 bg-surface-container-low/12 backdrop-blur-[1px] font-sans">
      <div className="design-container" ref={elementRef}>
        
        {/* Header */}
        <div className={`flex justify-between items-end mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className={`transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-[2px] bg-primary/40" />
              <span className="text-primary font-black text-[12px] tracking-[0.4em] uppercase">
                {t("home.featured_tours.badge")}
              </span>
            </div>
            <h2 className="text-[28px] md:text-[34px] font-black text-on-surface leading-tight">
              {t("home.tour_categories.title")}
            </h2>
          </div>
          <Link
            href={ROUTES.TOURS}
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
              const resolvedIcon = resolveTourCategoryIcon(category.icon, category.slug, category.name);

              return (
                <Link
                  key={category.id}
                  href={ROUTES.CATEGORY_TOURS(category.slug)}
                  className={cn(
                    "group flex flex-col items-center justify-center shrink-0 snap-start min-w-[90px] md:min-w-[110px] pb-2 border-b-2 border-transparent hover:border-primary/60 transition-all duration-200 cursor-pointer",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
                  )}
                  style={{ transitionDelay: isVisible ? `${index * 40}ms` : "0ms" }}
                >
                  <div
                    className="w-9 h-9 flex items-center justify-center mb-1 text-on-surface-subtle group-hover:text-primary transition-colors duration-300"
                    title={`API icon: ${category.icon ?? "fallback"}`}
                  >
                    <div className="w-6 h-6 transition-transform duration-500 group-hover:scale-110">
                      <IconMapper icon={resolvedIcon} />
                    </div>
                  </div>
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

export default memo(TourCategories);
