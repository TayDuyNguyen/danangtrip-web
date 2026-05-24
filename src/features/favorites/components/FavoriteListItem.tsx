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
      className={`group relative bg-[#080808]/40 border border-[#262626] hover:border-[#8b6a55]/30 rounded-2xl overflow-hidden p-5 flex flex-col md:flex-row gap-6 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:-translate-y-1 ${
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
            <span className="px-2.5 py-1 bg-[#8b6a55] text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-lg">
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
            <span className="px-2.5 py-0.5 bg-[#111111] text-white text-[9px] font-bold rounded-full border border-[#262626] uppercase tracking-widest">
              {location.district}
            </span>
          </div>

          {/* Location Title */}
          <Link href={detailHref} className="block group-hover:text-[#8b6a55] transition-colors focus-visible:outline-none">
            <h3 className="text-xl font-extrabold leading-snug text-white tracking-tight">
              {location.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
              <IoStar className="text-yellow-400 text-[10px]" />
              <span className="text-[10px] font-bold text-white">{rating.toFixed(1)}</span>
            </div>
            <span className="text-[10px] text-white/50 font-medium">
              ({location.review_count} {tLoc("reviews")})
            </span>
          </div>

          {/* Short Description */}
          <p className="text-white/60 text-xs line-clamp-2 leading-relaxed pt-1 max-w-2xl">
            {location.short_description || location.description}
          </p>
        </div>

        {/* Footer info (price and action button) */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4 md:mt-0">
          <div className="flex flex-col">
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider">
              {tLoc("price.from")}
            </span>
            <span className="text-base font-black text-[#8b6a55]">{formatPrice(location.price_min)}</span>
          </div>
          <Link
            href={detailHref}
            className="px-4 py-2 bg-white hover:bg-[#8b6a55] text-black hover:text-white font-extrabold rounded-lg transition-all duration-300 uppercase tracking-widest text-[9px] shadow-md"
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
        className="absolute top-5 right-5 z-20 w-10 h-10 bg-[#111111]/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#ef4444] border border-[#262626] hover:bg-[#171717] hover:scale-105 hover:border-[#8b6a55]/30 active:scale-95 transition-all duration-300 group/heart"
        aria-label={tLoc("buttons.favorite_aria")}
      >
        <IoHeart className="text-lg group-hover/heart:scale-110 transition-transform" />
      </button>
    </div>
  );
}
