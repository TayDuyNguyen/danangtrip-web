"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { IoStar, IoLocationOutline, IoHeart, IoHeartOutline } from "@/components/icons/solar";
import type { Location } from "@/types";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/config/routes";
import { useFavoriteToggle } from "@/hooks/useFavorite";
import { useAuthStore } from "@/store/auth.store";
import { localFavoriteLocations } from "@/utils/local-favorites";
import { formatLocationPriceRange } from "@/utils/format";
import { cn } from "@/utils/string";

interface LocationCardProps {
  location: Location;
  isFavorite?: boolean;
}

export default function LocationCard({ location, isFavorite = false }: LocationCardProps) {
  const t = useTranslations("locations");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const detailHref = PUBLIC_ROUTES.LOCATION_DETAIL(location.slug);
  const { isAuthenticated } = useAuthStore();
  const toggleMutation = useFavoriteToggle({ location_id: location.id });
  const [optimisticIsFavorite, setOptimisticIsFavorite] = useState(isFavorite);

  useEffect(() => {
    setOptimisticIsFavorite(isAuthenticated ? isFavorite : localFavoriteLocations.has(location.id));
  }, [isAuthenticated, isFavorite, location.id]);

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      const nextValue = !optimisticIsFavorite;
      if (nextValue) {
        localFavoriteLocations.add(location.id);
        toast.success(tCommon("favorite.add_success"));
      } else {
        localFavoriteLocations.remove(location.id);
        toast.success(tCommon("favorite.remove_success"));
      }
      setOptimisticIsFavorite(nextValue);
      return;
    }

    const nextValue = !optimisticIsFavorite;
    setOptimisticIsFavorite(nextValue);
    toggleMutation.mutate(optimisticIsFavorite, {
      onError: () => {
        setOptimisticIsFavorite(!nextValue);
        toast.error(tCommon("favorite.error"));
      },
    });
  };

  const { displayPrice, isFreeOrUnspecified } = formatLocationPriceRange(
    location.price_min,
    location.price_max,
    t,
    locale === "vi" ? "vi-VN" : "en-US"
  );

  const rating = parseFloat(location.avg_rating) || 0;
  const isPlaceholder = (url?: string | null) => {
    if (!url) return true;
    const lower = url.toLowerCase();
    return lower.includes("placeholder") || lower.includes("destination") || lower.includes("no-image") || lower.includes("temp");
  };

  const getValidImage = () => {
    if (location.thumbnail && !isPlaceholder(location.thumbnail)) {
      return location.thumbnail;
    }
    if (location.images && location.images[0] && !isPlaceholder(location.images[0])) {
      return location.images[0];
    }
    const fallbacks = [
      "/images/discovery/bana-hills.png",
      "/images/discovery/dragon-bridge.png",
      "/images/discovery/hoi-an.png",
      "/images/discovery/my-khe.png",
      "/images/discovery/son-tra.png",
    ];
    const imageIndex = typeof location.id === "number" ? Math.abs(location.id) % fallbacks.length : 0;
    return fallbacks[imageIndex];
  };

  const image = getValidImage();

  return (
    <div className="group relative pt-2">
      <div className="relative overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)] transition-all duration-500 group-hover:-translate-y-1 group-hover:border-primary/25 group-hover:shadow-[0_24px_64px_rgba(15,23,42,0.12)]">
        <Link
          href={detailHref}
          className="block rounded-[28px] text-inherit no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={image}
              alt={location.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {location.is_featured && (
                <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-normal text-white shadow-sm">
                  {t("badges.featured")}
                </span>
              )}
              <span className="rounded-full bg-white/92 px-4 py-1.5 text-xs font-semibold uppercase tracking-normal text-on-surface shadow-sm backdrop-blur-sm">
                {location.district}
              </span>
            </div>
          </div>

          <div className="space-y-4 p-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-on-surface-subtle">
                <IoLocationOutline className="text-primary" />
                <span>{location.district}</span>
              </div>

              <h3 className="line-clamp-1 text-xl font-semibold leading-tight text-on-surface transition-colors group-hover:text-primary">
                {location.name}
              </h3>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-[#fff7e8] px-2 py-1 text-xs text-amber-500">
                  <IoStar className="text-xs" />
                  <span className="font-semibold text-on-surface">{rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-on-surface-subtle">
                  ({location.review_count} {t("reviews")})
                </span>
              </div>
            </div>

            <p className="line-clamp-2 border-t border-border pt-4 text-sm leading-relaxed text-on-surface-subtle">
              {location.short_description || location.description}
            </p>

            <div className="flex items-end justify-between gap-3">
              <div className="flex flex-col">
                {!isFreeOrUnspecified && (
                  <span className="text-xs font-semibold uppercase tracking-normal text-on-surface-subtle">
                    {t("price.from")}
                  </span>
                )}
                <span className="text-lg font-semibold text-primary">{displayPrice}</span>
              </div>

              <span className="rounded-full border border-border bg-[#fafafa] px-4 py-2 text-xs font-semibold uppercase tracking-normal text-on-surface transition-all group-hover:border-primary/25 group-hover:bg-[#fff1f3] group-hover:text-primary">
                {t("buttons.view_details")}
              </span>
            </div>
          </div>
        </Link>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFavoriteClick();
          }}
          disabled={toggleMutation.isPending}
          className={cn(
            "absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition-all duration-300 group/heart",
            optimisticIsFavorite
              ? "border-red-200 bg-red-500 text-white hover:bg-red-600"
              : "border-border bg-white/92 text-on-surface hover:border-primary/20 hover:text-red-500",
            toggleMutation.isPending && "cursor-not-allowed opacity-60",
          )}
          aria-label={t("buttons.favorite_aria")}
          aria-pressed={optimisticIsFavorite}
        >
          {toggleMutation.isPending ? (
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : optimisticIsFavorite ? (
            <IoHeart className="text-2xl transition-transform group-hover/heart:scale-110" />
          ) : (
            <IoHeartOutline className="text-2xl text-on-surface transition-transform group-hover/heart:scale-110 group-hover:text-red-500" />
          )}
        </button>
      </div>
    </div>
  );
}
