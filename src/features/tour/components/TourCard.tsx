"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Clock, Users, MapPin } from "lucide-react";
import { Tour } from "@/types";
import { Badge, Button } from "@/components/ui";
import RatingStars from "@/components/ui/RatingStars";
import { cn } from "@/lib/utils";

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

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-surface border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 reveal-up",
        className
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={tour.thumbnail || "/images/placeholder.jpg"}
          alt={tour.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {tour.is_hot && (
            <Badge variant="error" className="uppercase text-[10px] font-bold">
              HOT
            </Badge>
          )}
          {tour.is_featured && (
            <Badge className="bg-blue-600 hover:bg-blue-700 uppercase text-[10px] font-bold">
              Nổi bật
            </Badge>
          )}
        </div>

        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
            -{discountPercent}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category & Location */}
        <div className="flex items-center gap-2 text-xs text-on-surface-subtle mb-2">
          <MapPin className="w-3 h-3" />
          <span>Đà Nẵng, Việt Nam</span>
        </div>

        {/* Title */}
        <Link
          href={`/tours/${tour.slug}`}
          className="text-base font-bold text-on-surface hover:text-primary transition-colors line-clamp-2 mb-3 h-12"
        >
          {tour.name}
        </Link>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
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
          <div className="flex flex-col">
            <span className="text-[10px] text-on-surface-subtle">{t("starting_from")}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-primary">
                {discountedPrice.toLocaleString()}đ
              </span>
              {discountPercent > 0 && (
                <span className="text-xs text-on-surface-subtle line-through">
                  {originalPrice.toLocaleString()}đ
                </span>
              )}
            </div>
          </div>
          <Button size="sm" className="rounded-lg font-bold px-4">
            {t("book_now")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
