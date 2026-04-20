"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { IoStar, IoLocationOutline, IoTimeOutline, IoChevronForward } from "react-icons/io5";
import { cn } from "@/utils/string";
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
  const url = isTour ? `/tours/${item?.slug}` : `/locations/${item?.slug}`;

  // Use variables for heights to avoid tailwind-intellisense conflicts in ternary
  const skeletonHeightClass = featured ? "h-[240px] md:h-auto" : "h-[200px]";
  const imageHeightClass = featured ? "h-[240px] md:h-auto" : "h-[220px]";

  if (isLoading || !item) {
    return (
      <div className={cn(
        "bg-surface-container-lowest rounded-[32px] overflow-hidden shadow-sm animate-pulse flex flex-col",
        featured && "md:col-span-2 md:row-span-1 md:flex-row"
      )}>
        <div className={cn(
          "bg-surface-container-high",
          featured ? "md:w-1/2" : "w-full",
          skeletonHeightClass
        )} />
        <div className="p-6 flex-1 space-y-4">
          <div className="h-4 bg-surface-container-high rounded-full w-1/4" />
          <div className="h-6 bg-surface-container-high rounded-full w-3/4" />
          <div className="h-4 bg-surface-container-high rounded-full w-1/2" />
          <div className="pt-4 border-t border-border flex justify-between items-center">
            <div className="h-6 bg-surface-container-high rounded-full w-1/3" />
            <div className="h-8 bg-surface-container-high rounded-lg w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link 
      href={url as string & {}}
      className={cn(
        "group bg-surface-container-lowest rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 reveal-up flex flex-col",
        featured && "md:col-span-2 md:row-span-1 md:flex-row"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image Section */}
      <div className={cn(
        "relative overflow-hidden",
        featured ? "md:w-2/5" : "w-full",
        imageHeightClass
      )}>
        <Image
          src={item.thumbnail || "/images/placeholder.png"}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes={featured ? "40vw" : "25vw"}
        />
        
        {/* Badge */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <span className={cn(
            "px-4 py-1.5 rounded-full text-[12px] font-bold text-white shadow-lg backdrop-blur-md",
            isTour ? "bg-azure/80" : "bg-success/80"
          )}>
            {isTour ? t("search.badges.tour") : t("search.badges.location")}
          </span>
          {item.featured && (
            <span className="bg-amber-400/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[12px] font-bold text-white shadow-lg">
              ✨ {t("search.badges.hot")}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 mb-3">
            {item.rating > 0 && item.reviewCount > 0 && (
              <>
                <div className="flex items-center text-amber-500">
                  <IoStar />
                  <span className="ml-1 text-[13px] font-black text-foreground">{item.rating}</span>
                </div>
                <span className="text-on-surface-variant text-[13px]">({item.reviewCount})</span>
                <span className="mx-2 text-on-surface-subtle">•</span>
              </>
            )}
            <span className="text-on-surface-variant text-[13px] font-bold uppercase tracking-wide">
              {item.categoryName}
            </span>
          </div>

          <h3 className={cn(
            "font-bold text-foreground group-hover:text-azure transition-colors line-clamp-2",
            featured ? "text-xl md:text-2xl mb-3" : "text-lg mb-2"
          )}>
            {item.title}
          </h3>

          <div className="flex items-center gap-1.5 text-on-surface text-sm mb-4 font-medium">
            <IoLocationOutline className="text-azure shrink-0" />
            <span className="line-clamp-1">
              {isTour ? t("search.card.default_location") : (item as LocationSearchResult).address}
            </span>
          </div>

          {isTour && (item as TourSearchResult).duration && (
            <div className="flex items-center gap-1.5 text-on-surface text-sm mb-4 font-medium">
              <IoTimeOutline className="text-azure shrink-0" />
              <span>{(item as TourSearchResult).duration}</span>
            </div>
          )}
        </div>

        <div className="pt-5 border-t border-border flex items-center justify-between">
          <div>
            {isTour ? (
              <div className="flex flex-col">
                <span className="text-[12px] text-on-surface-variant font-bold uppercase tracking-tight">{t("search.card.starting_from")}</span>
                <span className="text-2xl font-black text-azure">
                  {new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', { 
                    style: 'currency', 
                    currency: locale === 'vi' ? 'VND' : 'USD' 
                  }).format((item as TourSearchResult).price)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <span 
                    key={level}
                    className={cn(
                      "text-lg font-bold",
                      level <= ((item as LocationSearchResult).priceLevel || 1) ? "text-success" : "text-surface-container-high"
                    )}
                  >
                    $
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-foreground group-hover:bg-azure group-hover:text-white transition-all transform group-hover:translate-x-1 shadow-sm">
            <IoChevronForward className="text-xl" />
          </div>
        </div>
      </div>
    </Link>
  );
};
