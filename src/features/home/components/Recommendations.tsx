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
  const t = useTranslations("recommendations");
  const tHome = useTranslations("home");
  const tLocations = useTranslations("locations");
  const locale = useLocale();
  const { elementRef, isVisible } = useScrollReveal();
  const { locations, tours, isLoading, isError } = useRecommendations(6, isAuthenticated);

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
    <section className="py-8 bg-surface-container-low/12 backdrop-blur-[1px] font-sans overflow-hidden" ref={elementRef}>
      <div className="design-container">
        {/* Header */}
        <div className={`flex justify-between items-end mb-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className={`transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-primary/40" />
              <span className="text-xs font-semibold uppercase tracking-normal text-primary">
                {t("tabs.all")}
              </span>
            </div>
            <h2 className="text-[32px] font-semibold leading-[1.1] text-on-surface md:text-[44px]">
              {t("title")}
            </h2>
            <p className="mt-2 max-w-xl text-[15px] font-medium text-on-surface-subtle">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href={ROUTES.RECOMMENDATIONS}
            className={`mb-2 flex items-center rounded-full border border-border bg-white px-6 py-3 text-[14px] font-semibold text-on-surface shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-[#f7f7f7] hover:text-primary ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {tHome("hot_tours.explore_more")} <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {isLoading ? (
            // Loading Skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex h-[280px] w-full flex-col rounded-[28px] border border-border bg-[#f7f7f7] p-3 animate-pulse"
              >
                <div className="mb-3 h-[120px] w-full rounded-xl bg-[#ebebeb]" />
                <div className="mb-2 h-4 w-2/3 rounded bg-[#e5e5e5]" />
                <div className="mb-auto h-3 w-1/2 rounded bg-[#ebebeb]" />
                <div className="flex justify-between mt-auto">
                  <div className="h-3 w-8 rounded bg-[#e5e5e5]" />
                  <div className="h-3 w-12 rounded bg-[#e5e5e5]" />
                </div>
              </div>
            ))
          ) : isError ? (
            // Elegant Failure State Placeholder
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-on-surface-subtle bg-surface-container/10 rounded-xl border border-dashed border-border">
              <p className="mb-4 text-[15px] font-medium text-on-surface-subtle">{t("error.message")}</p>
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
                  : tLocations("price.free")
                : formatPriceVND(item.price_adult, locale === "vi" ? "vi-VN" : "en-US");

              // Reason translation helper fallback
              const reasonKey = item.recommendation_reason || "popular";
              const reasonText = t(`reasons.${reasonKey}`);

              return (
                <Link
                  key={`${item.itemType}-${item.id}`}
                  href={detailUrl}
                  className={`group flex cursor-pointer flex-col overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_16px_48px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]`}
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
                    <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white/92 text-[11px] font-bold text-on-surface backdrop-blur-md">
                      {isLocation ? "📍" : "🎫"}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-3 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Reason badge */}
                      <span className="mb-1 inline-block text-xs font-semibold uppercase tracking-normal text-primary">
                        {reasonText}
                      </span>
                      {/* Title */}
                      <h3 className="text-[13px] font-semibold text-on-surface group-hover:text-primary transition-colors leading-snug line-clamp-2 min-h-[36px] mb-2">
                        {item.name}
                      </h3>
                    </div>

                    {/* Rating & Price */}
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
                      <div className="flex items-center gap-0.5 text-[#929852] text-[11px] font-bold">
                        <IoStar className="text-[12px]" />
                        <span>{parseFloat(item.avg_rating || "0").toFixed(1)}</span>
                      </div>
                      <div className="text-[12px] font-black text-primary">
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
