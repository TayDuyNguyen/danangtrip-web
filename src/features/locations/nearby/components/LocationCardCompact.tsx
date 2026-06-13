"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { IoHeartOutline, IoLocationOutline, IoStar } from "@/components/icons/solar";
import { PUBLIC_ROUTES } from "@/config/routes";
import { useFavoriteToggle } from "@/hooks/useFavorite";
import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/store/auth.store";
import type { Location } from "@/types";
import { formatLocationPriceRange } from "@/utils/format";

interface LocationCardCompactProps {
  location: Location & { distance?: number };
  isHighlighted?: boolean;
  isSelected?: boolean;
  isFavorite?: boolean;
  onHover?: (hovered: boolean) => void;
  onClick?: () => void;
}

export default function LocationCardCompact({
  location,
  isHighlighted = false,
  isSelected = false,
  isFavorite = false,
  onHover,
  onClick,
}: LocationCardCompactProps) {
  const t = useTranslations("locations");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const detailHref = PUBLIC_ROUTES.LOCATION_DETAIL(location.slug);
  const { isAuthenticated } = useAuthStore();
  const toggleMutation = useFavoriteToggle({ location_id: location.id });
  const [optimisticIsSaved, setOptimisticIsSaved] = useState(isFavorite);

  useEffect(() => {
    setOptimisticIsSaved(isFavorite);
  }, [isFavorite]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.warning(tCommon("favorite.login_required") || "Please sign in to save favorites");
      return;
    }

    const nextValue = !optimisticIsSaved;
    setOptimisticIsSaved(nextValue);

    try {
      await toggleMutation.mutateAsync(optimisticIsSaved);
      toast.success(
        nextValue
          ? (tCommon("favorite.add_success") || "Saved to favorites")
          : (tCommon("favorite.remove_success") || "Removed from favorites")
      );
    } catch {
      setOptimisticIsSaved(!nextValue);
      toast.error(tCommon("favorite.error") || "Unable to update favorites right now");
    }
  };

  const { displayPrice } = formatLocationPriceRange(
    location.price_min,
    location.price_max,
    t,
    locale === "vi" ? "vi-VN" : "en-US"
  );

  const formatDistance = (dist?: number | string) => {
    if (dist === undefined || dist === null) return "";
    const parsedDist = typeof dist === "number" ? dist : parseFloat(dist);
    if (Number.isNaN(parsedDist)) return "";
    if (parsedDist < 1) {
      return `${Math.round(parsedDist * 1000)}m`;
    }
    return `${parsedDist.toFixed(1)} km`;
  };

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
    const index = typeof location.id === "number" ? Math.abs(location.id) % fallbacks.length : 0;
    return fallbacks[index];
  };

  const image = getValidImage();
  const categoryName = typeof location.category === "object" && location.category !== null
    ? (location.category as { name: string }).name
    : location.category || t("filters.all");

  return (
    <div
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      onClick={onClick}
      className={`group relative flex cursor-pointer gap-4 rounded-2xl border p-3 pr-12 transition-all duration-300 ${
        isSelected
          ? "border-primary bg-primary/10 shadow-lg"
          : isHighlighted
            ? "border-primary/60 bg-primary/10 shadow-md"
            : "border-border bg-[#fafafa] hover:border-primary/40 hover:bg-white"
      }`}
    >
      <div className="flex min-w-0 flex-1 gap-4 text-inherit no-underline">
        <div className="relative h-18 w-18 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-white">
          <Image
            src={image}
            alt={location.name}
            fill
            sizes="72px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            <p className="line-clamp-1 text-sm font-semibold leading-snug text-on-surface transition-colors group-hover:text-primary">
              {location.name}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              {location.distance !== undefined && (
                <span className="flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] font-bold text-primary">
                  <IoLocationOutline className="text-xs" />
                  {formatDistance(location.distance)}
                </span>
              )}
              <span className="max-w-[120px] truncate text-[11px] font-semibold text-on-surface-subtle">
                {categoryName}
              </span>
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3 text-[11px] text-on-surface-subtle">
              <div className="flex items-center gap-1">
                <IoStar className="text-xs text-yellow-500 flex-shrink-0" />
                <span className="font-bold text-on-surface">{rating.toFixed(1)}</span>
                <span>({location.review_count})</span>
              </div>
              <span>.</span>
              <span className="max-w-[140px] truncate" title={displayPrice}>{displayPrice}</span>
            </div>

            <Link
              href={detailHref}
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 rounded-full border border-primary/30 bg-white px-2.5 py-1 text-[11px] font-bold text-primary no-underline transition-colors hover:border-primary hover:bg-primary hover:text-white"
            >
              {t("explore.popup_detail")}
            </Link>
          </div>
        </div>
      </div>

      <button
        onClick={handleFavoriteClick}
        disabled={toggleMutation.isPending}
        className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
          optimisticIsSaved
            ? "border-primary bg-primary text-white"
            : "border-border bg-white text-on-surface-subtle backdrop-blur-sm hover:border-primary hover:text-primary"
        }`}
        aria-label="Add to favorites"
      >
        <IoHeartOutline className={`text-base ${optimisticIsSaved ? "fill-white" : ""} ${toggleMutation.isPending ? "animate-pulse" : ""}`} />
      </button>
    </div>
  );
}
