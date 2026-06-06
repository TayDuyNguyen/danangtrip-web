"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/config/routes";
import { IoStar, IoHeart } from "@/components/icons/solar";
import type { FavoriteItem } from "@/types";
import { useTranslations } from "next-intl";

interface FavoriteListItemProps {
  item: FavoriteItem;
  onRemove: (locationId: number) => void;
  isRemoving?: boolean;
}

export function FavoriteListItem({ item, onRemove, isRemoving = false }: FavoriteListItemProps) {
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
      className={`group relative flex flex-col gap-6 overflow-hidden rounded-[20px] border border-border bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] md:flex-row ${
        isRemoving ? "opacity-0 scale-75 pointer-events-none duration-300" : ""
      }`}
    >
      {/* Thumbnail Section */}
      <Link
        href={detailHref}
        className="block relative w-full md:w-56 h-40 rounded-xl overflow-hidden shrink-0 focus-visible:outline-none"
      >
        <Image
          src={image}
          alt={location.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 224px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Feature Badge */}
        {location.is_featured && (
          <div className="absolute top-3 left-3 pointer-events-none z-10">
            <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold uppercase tracking-normal text-white shadow-lg">
              {tLoc("badges.featured")}
            </span>
          </div>
        )}
      </Link>

      {/* Info Details Section */}
      <div className="flex-1 flex flex-col justify-between py-0.5">
        <div className="space-y-2">
          {/* Header row */}
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-border bg-[#f7f7f7] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-normal text-on-surface">
              {location.district}
            </span>
          </div>

          {/* Location Title */}
          <Link href={detailHref} className="block group-hover:text-primary transition-colors focus-visible:outline-none">
            <h3 className="text-xl font-semibold leading-snug tracking-tight text-on-surface">
              {location.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded border border-border bg-[#f7f7f7] px-1.5 py-0.5">
              <IoStar className="text-yellow-400 text-[10px]" />
              <span className="text-xs font-semibold text-on-surface">{rating.toFixed(1)}</span>
            </div>
            <span className="text-xs font-medium text-on-surface-subtle">
              ({location.review_count} {tLoc("reviews")})
            </span>
          </div>

          {/* Short Description */}
          <p className="max-w-2xl pt-1 text-xs leading-relaxed text-on-surface-subtle line-clamp-2">
            {location.short_description || location.description}
          </p>
        </div>

        {/* Footer info (price and action button) */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4 md:mt-0">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-normal text-on-surface-subtle">
              {tLoc("price.from")}
            </span>
            <span className="text-base font-black text-primary">{formatPrice(location.price_min)}</span>
          </div>
          <Link
            href={detailHref}
            className="rounded-lg bg-[#f7f7f7] px-4 py-2 text-xs font-semibold uppercase tracking-normal text-on-surface shadow-sm transition-all duration-300 hover:bg-primary hover:text-white"
          >
            {t("detail")}
          </Link>
        </div>
      </div>

      {/* Heart Button Overlay */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(location.id);
        }}
        className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-[#ef4444] transition-all duration-300 hover:scale-105 hover:border-primary/30 hover:bg-[#f7f7f7] active:scale-95 group/heart"
        aria-label={tLoc("buttons.favorite_aria")}
      >
        <IoHeart className="text-lg group-hover/heart:scale-110 transition-transform" />
      </button>
    </div>
  );
}
