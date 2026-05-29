"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { IoStar, IoLocationOutline, IoTimeOutline } from "@/components/icons/solar";
import { cn } from "@/utils/string";
import { ROUTES } from "@/config";
import { SearchResult, TourSearchResult, LocationSearchResult } from "../types/search.types";

interface SearchResultCardProps {
  item?: SearchResult;
  isLoading?: boolean;
  featured?: boolean;
  index: number;
  onClick?: (item: SearchResult) => void;
}

export const SearchResultCard = ({ item, isLoading, featured, index, onClick }: SearchResultCardProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const isTour = item?.type === "tour";
  const url = isTour
    ? ROUTES.TOUR_DETAIL(item?.slug || "")
    : ROUTES.LOCATION_DETAIL(item?.slug || "");

  if (isLoading || !item) {
    return (
      <div
        className={cn(
          "gradient-shell rounded-[7px] overflow-hidden animate-pulse flex flex-col",
          "relative",
          featured
            ? "col-span-1 md:col-span-12 lg:col-span-8 md:flex-row"
            : "col-span-1 md:col-span-6 lg:col-span-4"
        )}
        style={{ backgroundColor: "rgba(8, 8, 8, 0.7)" }}
      >
        <div
          className={cn(
            "bg-surface-container-high/40 relative",
            featured ? "w-full md:w-1/2 h-64 md:h-auto" : "w-full h-48"
          )}
        />
        <div className={cn("flex-1 flex flex-col justify-between", featured ? "p-8" : "p-6")}>
          <div className="space-y-3">
            <div className="h-3 bg-surface-container-high/40 rounded-full w-16" />
            <div className="h-5 bg-surface-container-high/40 rounded w-3/4" />
            <div className="h-3 bg-surface-container-high/40 rounded w-1/2" />
          </div>
          <div className="pt-6 flex items-center justify-between border-t border-[#262626]/40 mt-6">
            <div className="space-y-2">
              <div className="h-2 bg-surface-container-high/40 rounded w-12" />
              <div className="h-5 bg-surface-container-high/40 rounded w-20" />
            </div>
            <div className="h-8 w-8 bg-surface-container-high/40 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={url as string & {}}
      onClick={() => {
        if (item) {
          onClick?.(item);
        }
      }}
      className={cn(
        "group gradient-shell rounded-[7px] overflow-hidden reveal-up flex flex-col scale-100 active:scale-[0.98]",
        "relative",
        featured
          ? "col-span-1 md:col-span-12 lg:col-span-8 flex flex-col md:flex-row"
          : "col-span-1 md:col-span-6 lg:col-span-4 flex flex-col"
      )}
      style={{ backgroundColor: "rgba(8, 8, 8, 0.7)", animationDelay: `${index * 80}ms` }}
    >
      {/* Image Section */}
      <div
        className={cn(
          "relative overflow-hidden bg-surface-container-low",
          featured ? "w-full md:w-1/2 aspect-video md:aspect-auto" : "w-full h-[200px]"
        )}
      >
        <Image
          src={item.thumbnail || "/images/placeholder.png"}
          alt={item.title}
          fill
          className={cn(
            "object-cover transition-transform duration-700 group-hover:scale-105",
            featured ? "grayscale-[0.2]" : "grayscale-[0.3]"
          )}
          sizes={featured ? "40vw" : "25vw"}
        />

        {/* Badge — top-left corner */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          {isTour ? (
            <span className="bg-[#8b6a55]/90 backdrop-blur-sm text-[#fff4f0] px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest">
              {t("search.badges.tour")}
            </span>
          ) : (
            <span className="bg-surface/90 backdrop-blur-sm text-on-surface px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest">
              {t("search.badges.location")}
            </span>
          )}
          {item.featured && (
            <span className="bg-[#f1bb9d]/90 backdrop-blur-sm text-[#301403] px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest">
              🔥 {t("search.badges.hot")}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div
        className={cn(
          "flex-grow flex flex-col justify-between",
          featured ? "p-6 w-full md:w-1/2" : "p-5"
        )}
      >
        <div>
          {/* Type label */}
          <span className="text-[#737373] text-[10px] font-bold tracking-widest uppercase block mb-2">
            {isTour ? t("search.badges.tour") : t("search.badges.location")}
          </span>

          {/* Rating row */}
          {item.rating > 0 && item.reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center text-amber-500">
                <IoStar className="text-[11px] mr-0.5" />
                <span className="text-[12px] font-bold text-white">{item.rating}</span>
              </div>
              <span className="text-[#737373] text-[11px]">({item.reviewCount})</span>
              {item.categoryName && (
                <>
                  <span className="mx-1.5 text-[#737373] opacity-40">•</span>
                  <span className="text-[#737373] text-[10px] font-semibold uppercase tracking-wide">
                    {item.categoryName}
                  </span>
                </>
              )}
            </div>
          )}

          {/* Title */}
          <h3
            className={cn(
              "font-light text-[#e5e2e1] group-hover:text-[#e7bea6] transition-colors line-clamp-2 leading-tight mb-3",
              featured ? "text-2xl md:text-[28px]" : "text-[20px]"
            )}
          >
            {item.title}
          </h3>

          {/* Meta info */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[#737373] text-[13px]">
              <IoLocationOutline className="shrink-0 text-sm" />
              <span className="line-clamp-1">
                {isTour
                  ? t("search.card.default_location")
                  : (item as LocationSearchResult).address}
              </span>
            </div>
            {isTour && (item as TourSearchResult).duration && (
              <div className="flex items-center gap-2 text-[#737373] text-[13px]">
                <IoTimeOutline className="shrink-0 text-sm" />
                <span>{(item as TourSearchResult).duration}</span>
              </div>
            )}
          </div>
        </div>

        {/* Price + Arrow */}
        <div
          className={cn(
            "flex justify-between items-end border-t border-[#262626]/60 pt-4 mt-5",
            featured && "md:mt-8"
          )}
        >
          <div>
            {isTour ? (
              <div className="flex flex-col">
                <span className="text-[#737373] text-[10px] font-bold tracking-widest uppercase block mb-1">
                  {t("search.card.starting_from")}
                </span>
                <span className={cn("font-light text-[#e7bea6]", featured ? "text-2xl" : "text-[18px]")}>
                  {new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
                    style: "currency",
                    currency: locale === "vi" ? "VND" : "USD",
                    maximumFractionDigits: 0,
                  }).format((item as TourSearchResult).price)}
                </span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-[#737373] text-[10px] font-bold tracking-widest uppercase block mb-1">
                  {t("search.card.price_level")}
                </span>
                <div className="text-[#e7bea6] font-light tracking-widest text-[18px] flex gap-0.5">
                  {Array.from({ length: 4 }).map((_, level) => (
                    <span
                      key={level}
                      className={
                        level < ((item as LocationSearchResult).priceLevel || 1)
                          ? "text-[#e7bea6]"
                          : "text-[#737373]/30"
                      }
                    >
                      $
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Arrow button */}
          <div
            className={cn(
              "rounded-full border border-[#404040] flex items-center justify-center bg-transparent group-hover:bg-[#e7bea6] group-hover:border-[#e7bea6] group-hover:text-[#442b19] text-white transition-all duration-300",
              featured ? "w-10 h-10" : "w-8 h-8"
            )}
          >
            <svg
              className={featured ? "w-4 h-4" : "w-3 h-3"}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};
