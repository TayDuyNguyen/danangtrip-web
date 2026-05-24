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
} from "@/components/icons/solar";
import { useTours } from "../hooks/use-tours";
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
      return <IoLeafOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "beach_access":
    case "beach":
    case "umbrella":
      return <IoUmbrellaOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "fort":
    case "landmark":
    case "building":
      return <IoBusinessOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "trending_up":
    case "hot":
    case "flash":
      return <IoFlashOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "adventure":
    case "compass":
      return <IoCompassOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "plane":
    case "flight":
      return <IoPlaneOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "food":
    case "restaurant":
    case "utensils":
      return <IoRestaurantOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "hotel":
    case "resort":
    case "bed":
      return <IoBedOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "map":
    case "route":
      return <IoMapOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "heart":
    case "honeymoon":
      return <IoHeartOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "family":
    case "team":
    case "users":
      return <IoPeopleOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "camera":
    case "photo":
      return <IoCameraOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "car":
    case "jeep":
      return <IoCarSportOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "bike":
    case "bicycle":
      return <IoBicycleOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    case "boat":
    case "ship":
    case "cruise":
      return <IoBoatOutline className={`w-full h-full text-[#8b6a55] ${className}`} />;
    default:
      return <IoWalkOutline className={`w-full h-full text-[#737373] ${className}`} />;
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

const resolveTourCategoryBackground = (iconBackground: string | null | undefined, icon: string) => {
  if (iconBackground) return iconBackground;

  switch (icon) {
    case "mountain":
      return "#1a1f14";
    case "beach":
    case "boat":
      return "#11202a";
    case "restaurant":
      return "#2b1f14";
    case "hotel":
      return "#171717";
    case "heart":
      return "#2a161f";
    case "family":
      return "#17202a";
    case "camera":
      return "#20172a";
    default:
      return "#171717";
  }
};

const TourCategories = () => {
  const { tourCategories: categories } = useTours();
  const t = useTranslations();
  const { elementRef, isVisible } = useScrollReveal();

  if (categories.length === 0) return null;

  return (
    <section className="py-[80px] bg-[#080808]/12 backdrop-blur-[1px] font-sans">
      <div className="design-container relative" ref={elementRef}>
        <Link
          href={ROUTES.TOURS}
          className={cn(
            "absolute right-4 top-0 text-[14px] text-[#8b6a55] font-semibold hover:underline transition-all",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          {t("common.tour.see_all")}
        </Link>

        <div
          className={`text-center mb-[48px] transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-12 h-[2px] bg-[#8b6a55]/30" />
            <span className="text-[#8b6a55] font-black text-[12px] tracking-[0.4em] uppercase">
              {t("home.featured_tours.badge")}
            </span>
            <span className="w-12 h-[2px] bg-[#8b6a55]/30" />
          </div>
          <h2 className="text-[36px] md:text-[48px] font-black leading-[1.1] text-white mb-6">
            {t("home.tour_categories.title")}
          </h2>
          <p className="text-[#a3a3a3] text-[18px] max-w-2xl mx-auto font-medium leading-relaxed">
            {t("common.tour.list_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[16px]">
          {categories.slice(0, 6).map((category, index) => {
            const resolvedIcon = resolveTourCategoryIcon(category.icon, category.slug, category.name);
            const iconBackground = resolveTourCategoryBackground(category.icon_background, resolvedIcon);

            return (
              <Link
                key={category.id}
                href={ROUTES.CATEGORY_TOURS(category.slug)}
                className={cn(
                  "group flex flex-col items-center p-[20px] rounded-xl bg-[#080808] hover:bg-[#111111]",
                  "hover:shadow-[0_12px_24px_rgba(0,0,0,0.35)] transition-all duration-500",
                  "border border-[#262626] hover:border-[#8b6a55]/30",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
                )}
                style={{ transitionDelay: isVisible ? `${index * 70}ms` : "0ms" }}
              >
                <div
                  className="w-[64px] h-[64px] flex items-center justify-center mb-[12px] p-[16px] rounded-lg border border-[#262626] transition-all relative group-hover:border-[#8b6a55]/40"
                  style={{ backgroundColor: iconBackground }}
                  title={`API icon: ${category.icon ?? "fallback"}${category.icon_background ? ` | API color: ${category.icon_background}` : ""}`}
                >
                  <IconMapper icon={resolvedIcon} />
                </div>
                <span className="text-[14px] font-bold text-white group-hover:text-[#8b6a55] transition-colors text-center">
                  {category.name}
                </span>
                <span className="text-[11px] text-[#737373] mt-1">
                  {t("home.tour_categories.cta")}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(TourCategories);
