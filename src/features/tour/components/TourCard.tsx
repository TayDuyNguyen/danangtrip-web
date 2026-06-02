"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Users, MapPin } from "@/components/icons/solar";
import { Tour } from "@/types";
import { Badge } from "@/components/ui";
import { ROUTES } from "@/config";
import RatingStars from "@/components/ui/RatingStars";
import { cn } from "@/lib/utils";
import { formatPriceVND } from "@/utils/format";

interface TourCardProps {
  tour: Tour;
  className?: string;
  index?: number;
}

const TourCard = ({ tour, className, index = 0 }: TourCardProps) => {
  const t = useTranslations("tour.card");
  const locale = useLocale();
  const priceLocale = locale === "vi" ? "vi-VN" : "en-US";

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
    const fallbacks = ["/images/tours/bana-hills.png", "/images/tours/hoian.png", "/images/tours/sontra.png"];
    const imageIndex = typeof tour.id === "number" ? Math.abs(tour.id) % fallbacks.length : 0;
    return fallbacks[imageIndex];
  };

  const image = getValidImage();

  return (
    <div className={cn("reveal-up", className)} style={{ animationDelay: `${index * 100}ms` }}>
      <div
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)]",
          "transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_24px_64px_rgba(15,23,42,0.12)]"
        )}
      >
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={image}
            alt={tour.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {tour.is_hot && (
              <Badge variant="error" className="rounded-full text-xs font-semibold uppercase tracking-normal">
                {t("hot_badge")}
              </Badge>
            )}
            {tour.is_featured && (
              <Badge variant="warning" className="rounded-full text-xs font-semibold uppercase tracking-normal">
                {t("featured_badge")}
              </Badge>
            )}
          </div>

          {discountPercent > 0 && (
            <div className="absolute right-3 top-3">
              <Badge variant="warning" className="rounded-full px-2 py-0.5 text-xs font-semibold">
                {t("discount_percent", { percent: discountPercent })}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="mb-2 flex items-center gap-2 text-[12px] leading-4 text-on-surface-subtle">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>{t("location_short")}</span>
          </div>

          <Link
            href={ROUTES.TOUR_DETAIL(tour.slug)}
            className="mb-3 line-clamp-2 h-12 text-base font-semibold text-on-surface transition-colors hover:text-primary"
          >
            {tour.name}
          </Link>

          <div className="mb-4 flex items-center gap-4 text-[12px] leading-4 text-on-surface-subtle">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 shrink-0" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 shrink-0" />
              <span>{t("participants", { count: tour.max_people })}</span>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <RatingStars rating={parseFloat(tour.avg_rating)} count={tour.review_count} size="sm" showText />
          </div>

          <div className="my-4 h-px bg-border" />

          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-col">
              <span className="text-xs text-on-surface-subtle">{t("starting_from")}</span>
              <div className="flex flex-wrap items-baseline gap-1">
                <span className="text-lg font-semibold text-primary">{formatPriceVND(discountedPrice, priceLocale)}</span>
                {discountPercent > 0 && (
                  <span className="text-xs text-on-surface-subtle line-through">{formatPriceVND(originalPrice, priceLocale)}</span>
                )}
              </div>
            </div>

            <Link
              href={`${ROUTES.TOUR_DETAIL(tour.slug)}#booking-cta`}
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-primary px-4 py-2",
                "cursor-pointer text-xs font-bold text-white shadow-sm transition-all duration-300 hover:bg-primary-hover active:scale-95"
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
