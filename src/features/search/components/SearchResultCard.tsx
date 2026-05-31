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
  const url = isTour ? ROUTES.TOUR_DETAIL(item?.slug || "") : ROUTES.LOCATION_DETAIL(item?.slug || "");

  if (isLoading || !item) {
    return (
      <div
        className={cn(
          "relative flex animate-pulse flex-col overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)]",
          featured ? "col-span-1 md:col-span-12 lg:col-span-8 md:flex-row" : "col-span-1 md:col-span-6 lg:col-span-4"
        )}
      >
        <div className={cn("relative bg-[#f2f4f7]", featured ? "h-64 w-full md:h-auto md:w-1/2" : "h-48 w-full")} />
        <div className={cn("flex flex-1 flex-col justify-between", featured ? "p-8" : "p-6")}>
          <div className="space-y-3">
            <div className="h-3 w-16 rounded-full bg-[#eceff3]" />
            <div className="h-5 w-3/4 rounded bg-[#eceff3]" />
            <div className="h-3 w-1/2 rounded bg-[#eceff3]" />
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
            <div className="space-y-2">
              <div className="h-2 w-12 rounded bg-[#eceff3]" />
              <div className="h-5 w-20 rounded bg-[#eceff3]" />
            </div>
            <div className="h-8 w-8 rounded-full bg-[#eceff3]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={url as string & {}}
      onClick={() => onClick?.(item)}
      className={cn(
        "group reveal-up relative flex scale-100 flex-col overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(15,23,42,0.12)] active:scale-[0.98]",
        featured ? "col-span-1 md:col-span-12 lg:col-span-8 md:flex-row" : "col-span-1 md:col-span-6 lg:col-span-4"
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-surface-container-low",
          featured ? "aspect-video w-full md:w-1/2 md:aspect-auto" : "h-[200px] w-full"
        )}
      >
        <Image
          src={item.thumbnail || "/images/placeholder.png"}
          alt={item.title}
          fill
          className={cn("object-cover transition-transform duration-700 group-hover:scale-105", featured ? "grayscale-[0.05]" : "grayscale-[0.08]")}
          sizes={featured ? "40vw" : "25vw"}
        />

        <div className="absolute left-4 top-4 z-10 flex gap-2">
          {isTour ? (
            <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
              {t("search.badges.tour")}
            </span>
          ) : (
            <span className="rounded-full bg-white/92 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface shadow-sm backdrop-blur-sm">
              {t("search.badges.location")}
            </span>
          )}
          {item.featured && (
            <span className="rounded-full bg-[#fff4d8] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#9a5b00] shadow-sm">
              {t("search.badges.hot")}
            </span>
          )}
        </div>
      </div>

      <div className={cn("flex flex-grow flex-col justify-between", featured ? "w-full p-6 md:w-1/2" : "p-5")}>
        <div>
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-subtle">
            {isTour ? t("search.badges.tour") : t("search.badges.location")}
          </span>

          {item.rating > 0 && item.reviewCount > 0 && (
            <div className="mb-2 flex items-center gap-1">
              <div className="flex items-center text-amber-500">
                <IoStar className="mr-0.5 text-[11px]" />
                <span className="text-[12px] font-bold text-on-surface">{item.rating}</span>
              </div>
              <span className="text-[11px] text-on-surface-subtle">({item.reviewCount})</span>
              {item.categoryName && (
                <>
                  <span className="mx-1.5 text-on-surface-subtle opacity-40">•</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-subtle">
                    {item.categoryName}
                  </span>
                </>
              )}
            </div>
          )}

          <h3
            className={cn(
              "mb-3 line-clamp-2 leading-tight text-on-surface transition-colors group-hover:text-primary",
              featured ? "text-2xl font-semibold md:text-[28px]" : "text-[20px] font-semibold"
            )}
          >
            {item.title}
          </h3>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[13px] text-on-surface-subtle">
              <IoLocationOutline className="shrink-0 text-sm" />
              <span className="line-clamp-1">
                {isTour ? t("search.card.default_location") : (item as LocationSearchResult).address}
              </span>
            </div>
            {isTour && (item as TourSearchResult).duration && (
              <div className="flex items-center gap-2 text-[13px] text-on-surface-subtle">
                <IoTimeOutline className="shrink-0 text-sm" />
                <span>{(item as TourSearchResult).duration}</span>
              </div>
            )}
          </div>
        </div>

        <div className={cn("mt-5 flex items-end justify-between border-t border-border pt-4", featured && "md:mt-8")}>
          <div>
            {isTour ? (
              <div className="flex flex-col">
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-subtle">
                  {t("search.card.starting_from")}
                </span>
                <span className={cn("font-semibold text-primary", featured ? "text-2xl" : "text-[18px]")}>
                  {new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
                    style: "currency",
                    currency: locale === "vi" ? "VND" : "USD",
                    maximumFractionDigits: 0,
                  }).format((item as TourSearchResult).price)}
                </span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-subtle">
                  {t("search.card.price_level")}
                </span>
                <div className="flex gap-0.5 text-[18px] font-semibold tracking-widest text-primary">
                  {Array.from({ length: 4 }).map((_, level) => (
                    <span
                      key={level}
                      className={level < ((item as LocationSearchResult).priceLevel || 1) ? "text-primary" : "text-on-surface-subtle/30"}
                    >
                      $
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className={cn(
              "flex items-center justify-center rounded-full border border-border bg-[#fafafa] text-on-surface transition-all duration-300 group-hover:border-primary/25 group-hover:bg-[#fff1f3] group-hover:text-primary",
              featured ? "h-10 w-10" : "h-8 w-8"
            )}
          >
            <svg
              className={featured ? "h-4 w-4" : "h-3 w-3"}
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
