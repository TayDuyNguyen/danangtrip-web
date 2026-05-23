"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Clock, Users, MapPin } from "@/components/icons/solar";
import { Tour } from "@/types";
import { Badge } from "@/components/ui";
import { ROUTES } from "@/config";
import RatingStars from "@/components/ui/RatingStars";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/format";

interface TourCardProps {
  tour: Tour;
  className?: string;
  index?: number;
}

const TourCard = ({ tour, className, index = 0 }: TourCardProps) => {
  const t = useTranslations("tour.card");

  const discountPercent = tour.discount_percent;
  const originalPrice = parseFloat(tour.price_adult);
  const discountedPrice = originalPrice * (1 - discountPercent / 100);

  const isPlaceholder = (url?: string | null) => {
    if (!url) return true;
    const lower = url.toLowerCase();
    return lower.includes("placeholder") || lower.includes("destination") || lower.includes("no-image") || lower.includes("temp");
  };

  const getValidImage = () => {
    if (tour.thumbnail && !isPlaceholder(tour.thumbnail)) {
      return tour.thumbnail;
    }
    const fallbacks = [
      "/images/tours/bana-hills.png",
      "/images/tours/hoian.png",
      "/images/tours/sontra.png"
    ];
    const index = typeof tour.id === "number" ? Math.abs(tour.id) % fallbacks.length : 0;
    return fallbacks[index];
  };

  const image = getValidImage();

  return (
    <div
      className={cn(
        "p-px rounded-xl bg-linear-to-br from-[rgba(92,56,34,0.4)] to-[rgba(46,58,47,0.1)] reveal-up",
        className
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-lg bg-surface border border-border",
          "transition-all duration-300 hover:border-(--glass-border-accent)"
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={image}
            alt={tour.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {tour.is_hot && (
              <Badge variant="error" className="uppercase text-[10px] font-bold">
                {t("hot_badge")}
              </Badge>
            )}
            {tour.is_featured && (
              <Badge variant="warning" className="uppercase text-[10px] font-bold">
                {t("featured_badge")}
              </Badge>
            )}
          </div>

          {discountPercent > 0 && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning" className="text-[10px] font-bold px-2 py-0.5">
                {t("discount_percent", { percent: discountPercent })}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 md:p-6">
          {/* Category & Location */}
          <div className="flex items-center gap-2 font-mono text-[12px] leading-4 text-on-surface-subtle mb-2">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{t("location_short")}</span>
          </div>

          {/* Title */}
          <Link
            href={ROUTES.TOUR_DETAIL(tour.slug)}
            className="text-base font-bold text-on-surface hover:text-primary transition-colors line-clamp-2 mb-3 h-12"
          >
            {tour.name}
          </Link>

          {/* Stats */}
          <div className="flex items-center gap-4 font-mono text-[12px] leading-4 text-on-surface-variant mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 shrink-0" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 shrink-0" />
              <span>{t("participants", { count: tour.max_people })}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="mt-auto flex items-center justify-between">
            <RatingStars
              rating={parseFloat(tour.avg_rating)}
              count={tour.review_count}
              size="sm"
              showText
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-border my-4" />

          {/* Price & CTA */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-on-surface-subtle">{t("starting_from")}</span>
              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="text-lg font-bold text-primary">
                  {formatNumber(discountedPrice)}đ
                </span>
                {discountPercent > 0 && (
                  <span className="text-xs text-on-surface-subtle line-through">
                    {formatNumber(originalPrice)}đ
                  </span>
                )}
              </div>
            </div>
            <Link
              href={`${ROUTES.TOUR_DETAIL(tour.slug)}#booking-cta`}
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-full border border-[#262626] bg-[#171717]",
                "px-3 py-2 text-xs font-semibold text-white transition-all duration-300",
                "hover:border-[#8b6a55] hover:text-[#8b6a55] active:scale-95"
              )}
            >
              {t("book_now")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
