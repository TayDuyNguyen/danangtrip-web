"use client";

import { memo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import { useTranslations, useLocale } from "next-intl";
import { IoStar } from "@/components/icons/solar";
import { useRecommendations } from "../hooks/use-recommendations";
import { useAuthStore } from "@/store/auth.store";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { getHomeLocationImage, getHomeTourImage } from "../utils/home-image-fallbacks";
import { formatPriceVND } from "@/utils/format";

const Recommendations = () => {
  const { isAuthenticated } = useAuthStore();
  const { locations, tours, isLoading, isError } = useRecommendations(6);
  const t = useTranslations("recommendations");
  const tHome = useTranslations("home");
  const locale = useLocale();
  const { elementRef, isVisible } = useScrollReveal();

  // 1. Return null early if user is not authenticated (strictly public guest rule)
  if (!isAuthenticated) return null;

  // 2. Prepare items (mixed list of locations and tours up to 6 total)
  const combinedItems = [
    ...locations.map((loc) => ({ ...loc, itemType: "location" as const })),
    ...tours.map((tour) => ({ ...tour, itemType: "tour" as const })),
  ].slice(0, 6);

  // 3. Hide completely if not loading, no error, but empty results
  if (!isLoading && !isError && combinedItems.length === 0) return null;

  return (
    <section className="py-[80px] bg-[#080808]/12 backdrop-blur-[1px] font-sans overflow-hidden" ref={elementRef}>
      <div className="design-container relative">
        <Link
          href={ROUTES.RECOMMENDATIONS}
          className={`absolute right-4 top-0 text-[14px] text-[#8b6a55] font-semibold hover:underline transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {tHome("hot_tours.explore_more")} <span className="ml-1">→</span>
        </Link>

        {/* Section Header */}
        <div className={`text-center mb-[48px] transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-12 h-[2px] bg-[#8b6a55]/30" />
            <span className="text-[#8b6a55] font-black text-[12px] tracking-[0.4em] uppercase">
              {t("tabs.all")}
            </span>
            <span className="w-12 h-[2px] bg-[#8b6a55]/30" />
          </div>
          <h2 className="text-[36px] md:text-[48px] font-black leading-[1.1] text-white mb-6">
            {t("title")}
          </h2>
          <p className="text-[#a3a3a3] text-[18px] max-w-2xl mx-auto font-medium leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {isLoading ? (
            // Loading Skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#111111]/70 border border-[#262626] rounded-2xl h-[280px] w-full animate-pulse flex flex-col p-3"
              >
                <div className="w-full h-[120px] rounded-xl bg-[#1c1c1c] mb-3" />
                <div className="h-4 w-2/3 bg-[#1c1c1c] rounded mb-2" />
                <div className="h-3 w-1/2 bg-[#1c1c1c] rounded mb-auto" />
                <div className="flex justify-between mt-auto">
                  <div className="h-3 w-8 bg-[#1c1c1c] rounded" />
                  <div className="h-3 w-12 bg-[#1c1c1c] rounded" />
                </div>
              </div>
            ))
          ) : isError ? (
            // Elegant Failure State Placeholder
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-on-surface-subtle bg-surface-container/10 rounded-xl border border-dashed border-[#262626]">
              <p className="text-[15px] font-medium text-[#a3a3a3] mb-4">{t("error.message")}</p>
            </div>
          ) : (
            // Recommendation Cards
            combinedItems.map((item, index) => {
              const isLocation = item.itemType === "location";
              const detailUrl = isLocation
                ? ROUTES.LOCATION_DETAIL(item.slug)
                : ROUTES.TOUR_DETAIL(item.slug);

              const cardImg = isLocation
                ? getHomeLocationImage(item.thumbnail, item.images, item.id)
                : getHomeTourImage(item.thumbnail, item.id);

              const priceText = isLocation
                ? item.price_min && item.price_min > 0
                  ? formatPriceVND(item.price_min, locale === "vi" ? "vi-VN" : "en-US")
                  : tHome("featured_locations.default_address") === "Đà Nẵng" ? "Miễn phí" : "Free"
                : formatPriceVND(item.price_adult, locale === "vi" ? "vi-VN" : "en-US");

              // Reason translation helper fallback
              const reasonKey = item.recommendation_reason || "popular";
              const reasonText = t(`reasons.${reasonKey}`);

              return (
                <Link
                  key={`${item.itemType}-${item.id}`}
                  href={detailUrl}
                  className={`group bg-[#111111]/70 hover:bg-[#171717]/90 border border-[#262626] hover:border-[#8b6a55]/40 rounded-2xl overflow-hidden cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col`}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
                  }}
                >
                  {/* Thumbnail area */}
                  <div className="relative w-full h-[120px] overflow-hidden shrink-0">
                    <Image
                      src={cardImg}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 150px, 200px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Type Badge */}
                    <span className="absolute top-3 left-3 bg-[#111111]/80 backdrop-blur-md text-white text-[11px] font-bold rounded-full w-7 h-7 flex items-center justify-center border border-[#262626]">
                      {isLocation ? "📍" : "🎫"}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-3 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Reason badge */}
                      <span className="inline-block text-[10px] font-black text-[#8b6a55] tracking-wider uppercase mb-1">
                        {reasonText}
                      </span>
                      {/* Title */}
                      <h3 className="text-[13px] font-semibold text-white group-hover:text-[#8b6a55] transition-colors leading-snug line-clamp-2 min-h-[36px] mb-2">
                        {item.name}
                      </h3>
                    </div>

                    {/* Rating & Price */}
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#262626]">
                      <div className="flex items-center gap-0.5 text-[#929852] text-[11px] font-bold">
                        <IoStar className="text-[12px]" />
                        <span>{parseFloat(item.avg_rating || "0").toFixed(1)}</span>
                      </div>
                      <div className="text-[12px] font-black text-[#8b6a55]">
                        {priceText}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(Recommendations);
