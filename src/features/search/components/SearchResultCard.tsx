"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { IoStar, IoLocationOutline, IoTimeOutline, IoChevronForward } from "@/components/icons/solar";
import { cn } from "@/utils/string";
import { ROUTES } from "@/config";
import { SearchResult, TourSearchResult, LocationSearchResult } from "../types/search.types";

interface SearchResultCardProps {
  item?: SearchResult;
  isLoading?: boolean;
  featured?: boolean;
  index: number;
}

export const SearchResultCard = ({ item, isLoading, featured, index }: SearchResultCardProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const isTour = item?.type === "tour";
  const url = isTour 
    ? ROUTES.TOUR_DETAIL(item?.slug || "") 
    : ROUTES.LOCATION_DETAIL(item?.slug || "");

  // Use variables for heights to avoid tailwind-intellisense conflicts in ternary
  const skeletonHeightClass = featured ? "h-[240px] md:h-auto" : "h-[200px]";
  const imageHeightClass = featured ? "h-[240px] md:h-auto" : "h-[220px]";

  if (isLoading || !item) {
    return (
      <div className={cn(
        "glass-retro rounded-xl overflow-hidden animate-pulse flex flex-col",
        featured ? "col-span-1 md:col-span-12 lg:col-span-8 md:flex-row" : "col-span-1 md:col-span-6 lg:col-span-4"
      )}>
        <div className={cn(
          "bg-surface-container-high/40 relative",
          featured ? "w-full md:w-1/2 h-64 md:h-auto" : "w-full h-48"
        )} />
        <div className={cn(
          "flex-1 flex flex-col justify-between",
          featured ? "p-8" : "p-6"
        )}>
          <div className="space-y-4">
            <div className="h-4 bg-surface-container-high/40 rounded w-1/4" />
            <div className="h-6 bg-surface-container-high/40 rounded w-3/4" />
            <div className="h-4 bg-surface-container-high/40 rounded w-1/2" />
          </div>
          <div className="pt-6 flex items-center justify-between border-t border-[#262626]/40 mt-6">
            <div className="space-y-2">
              <div className="h-3 bg-surface-container-high/40 rounded w-16" />
              <div className="h-6 bg-surface-container-high/40 rounded w-24" />
            </div>
            <div className="h-10 w-10 bg-surface-container-high/40 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link 
      href={url as string & {}}
      className={cn(
        "group glass-retro glass-retro-interactive rounded-xl overflow-hidden reveal-up flex flex-col scale-100 active:scale-[0.98]",
        featured ? "col-span-1 md:col-span-12 lg:col-span-8 flex flex-col md:flex-row" : "col-span-1 md:col-span-6 lg:col-span-4 flex flex-col"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image Section */}
      <div className={cn(
        "relative overflow-hidden bg-surface-container-low",
        featured ? "w-full md:w-1/2 h-64 md:h-auto" : "w-full h-48"
      )}>
        <Image
          src={item.thumbnail || "/images/placeholder.png"}
          alt={item.title}
          fill
          className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
          sizes={featured ? "40vw" : "25vw"}
        />
        
        {/* Badge */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          {isTour ? (
            <span className="bg-[#8b6a55] text-[#fff4f0] px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-wider">
              {t("search.badges.tour")}
            </span>
          ) : (
            <span className="bg-surface-variant/50 text-[#e5e2e1] border border-border-low px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-wider">
              {t("search.badges.location")}
            </span>
          )}
          {item.featured && (
            <span className="bg-[#f1bb9d] text-[#301403] px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 uppercase tracking-wider">
              🔥 {t("search.badges.hot")}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className={cn(
        "flex-grow flex flex-col justify-between",
        featured ? "p-8 w-full md:w-1/2" : "p-6"
      )}>
        <div>
          <div className="flex items-center gap-1 mb-2">
            {item.rating > 0 && item.reviewCount > 0 && (
              <>
                <div className="flex items-center text-amber-500">
                  <IoStar className="text-[13px] mr-1" />
                  <span className="text-[12px] font-bold text-white">{item.rating}</span>
                </div>
                <span className="text-on-surface-variant text-[12px]">({item.reviewCount})</span>
                <span className="mx-2 text-on-surface-subtle opacity-30">•</span>
              </>
            )}
            <span className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
              {item.categoryName}
            </span>
          </div>

          <h3 className={cn(
            "font-light text-white group-hover:text-[#e7bea6] transition-colors line-clamp-2 leading-tight",
            featured ? "text-2xl md:text-3xl mb-4" : "text-xl mb-4"
          )}>
            {item.title}
          </h3>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-on-surface-subtle text-[13px] font-normal">
              <IoLocationOutline className="text-on-surface-variant shrink-0 text-sm" />
              <span className="line-clamp-1">
                {isTour ? t("search.card.default_location") : (item as LocationSearchResult).address}
              </span>
            </div>

            {isTour && (item as TourSearchResult).duration && (
              <div className="flex items-center gap-2 text-on-surface-subtle text-[13px] font-normal">
                <IoTimeOutline className="text-on-surface-variant shrink-0 text-sm" />
                <span>{(item as TourSearchResult).duration}</span>
              </div>
            )}
          </div>
        </div>

        <div className={cn(
          "flex justify-between items-end border-t border-border-low/40 pt-4 mt-6",
          featured && "md:border-t-0 md:pt-0 md:mt-8"
        )}>
          <div>
            {isTour ? (
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest mb-0.5">{t("search.card.starting_from")}</span>
                <span className="text-xl font-bold text-[#f1bb9d]">
                  {new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', { 
                    style: 'currency', 
                    currency: locale === 'vi' ? 'VND' : 'USD',
                    maximumFractionDigits: 0
                  }).format((item as TourSearchResult).price)}
                </span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest mb-1">{t("search.card.price_level")}</span>
                <div className="text-[#f1bb9d] font-semibold tracking-widest text-sm flex gap-0.5">
                  {Array.from({ length: 4 }).map((_, level) => (
                    <span 
                      key={level}
                      className={level < ((item as LocationSearchResult).priceLevel || 1) ? "text-[#f1bb9d]" : "text-on-surface-variant/30"}
                    >
                      $
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={cn(
            "rounded-full border border-border-low flex items-center justify-center bg-transparent group-hover:bg-[#8b6a55] group-hover:border-[#8b6a55] text-white transition-all duration-300",
            featured ? "w-10 h-10" : "w-8 h-8"
          )}>
            <IoChevronForward className={featured ? "text-lg" : "text-sm"} />
          </div>
        </div>
      </div>
    </Link>
  );
};
