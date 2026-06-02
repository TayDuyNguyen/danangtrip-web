"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/config/routes";
import { IoStar, IoLocationOutline, IoHeart } from "@/components/icons/solar";
import type { FavoriteItem } from "@/types";
import { useTranslations } from "next-intl";

interface FavoriteCardItemProps {
  item: FavoriteItem;
  onRemove: (locationId: number) => void;
  isRemoving?: boolean;
}

export function FavoriteCardItem({ item, onRemove, isRemoving = false }: FavoriteCardItemProps) {
  const t = useTranslations("favorites");
  const tLoc = useTranslations("locations");

  const location = item.location;
  if (!location) return null;

  const detailHref = PUBLIC_ROUTES.LOCATION_DETAIL(location.slug);

  const formatPrice = (price: number | null) => {
    if (!price || price === 0) return tLoc("price.free");
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const rating = parseFloat(location.avg_rating) || 0;
  const image = location.thumbnail || (location.images && location.images[0]) || "/images/placeholder.jpg";

  return (
    <div
      className={`group relative overflow-hidden rounded-[20px] border border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] ${
        isRemoving ? "opacity-0 scale-75 pointer-events-none duration-300" : ""
      }`}
    >
      <Link
        href={detailHref}
        className="block text-inherit no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
      >
        {/* Image Section */}
        <div className="relative aspect-4/5 overflow-hidden">
          <Image
            src={image}
            alt={location.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-75 group-hover:opacity-85 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-5 left-5 flex flex-col gap-2 pointer-events-none z-10">
            {location.is_featured && (
              <span className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold uppercase tracking-normal text-white shadow-lg">
                {tLoc("badges.featured")}
              </span>
            )}
            <span className="rounded-full border border-border bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-normal text-on-surface">
              {location.district}
            </span>
          </div>

          {/* Location Details Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/85 to-transparent transition-all duration-500 z-10">
            {/* Header Info */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-1.5">
                <IoLocationOutline className="text-primary text-sm shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-normal text-white/78">{location.district}</span>
              </div>
              <h3 className="line-clamp-1 text-lg font-semibold leading-snug text-white transition-colors group-hover:text-primary">
                {location.name}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded border border-white/10 bg-white/10 px-1.5 py-0.5 backdrop-blur-md">
                  <IoStar className="text-yellow-400 text-[10px]" />
                  <span className="text-xs font-semibold text-white">{rating.toFixed(1)}</span>
                </div>
                <span className="text-xs font-medium text-white/70">
                  ({location.review_count} {tLoc("reviews")})
                </span>
              </div>
            </div>

            {/* Expandable Section */}
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out overflow-hidden">
              <div className="min-h-0 space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                <p className="line-clamp-2 border-t border-white/10 pt-3 text-xs leading-relaxed text-white/78">
                  {location.short_description || location.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-normal text-white/70">
                      {tLoc("price.from")}
                    </span>
                    <span className="text-sm font-black text-primary">{formatPrice(location.price_min)}</span>
                  </div>
                  <span className="rounded-lg bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-normal text-black shadow-md transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                    {t("detail")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Heart Button Overlay */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(location.id);
        }}
        className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/90 text-[#ef4444] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-primary/30 hover:bg-white active:scale-95 group/heart"
        aria-label={tLoc("buttons.favorite_aria")}
      >
        <IoHeart className="text-lg group-hover/heart:scale-110 transition-transform" />
      </button>
    </div>
  );
}
