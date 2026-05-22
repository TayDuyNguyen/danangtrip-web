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
      className={`group relative bg-[#080808]/40 rounded-2xl overflow-hidden border border-[#262626] hover:border-[#8b6a55]/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:-translate-y-1.5 ${
        isRemoving ? "opacity-0 scale-75 pointer-events-none duration-300" : ""
      }`}
    >
      <Link
        href={detailHref}
        className="block text-inherit no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b6a55] focus-visible:ring-offset-2 rounded-2xl"
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
              <span className="px-3.5 py-1.5 bg-[#8b6a55] text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">
                {tLoc("badges.featured")}
              </span>
            )}
            <span className="px-3 py-1 bg-[#111111]/80 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-[#262626] uppercase tracking-widest">
              {location.district}
            </span>
          </div>

          {/* Location Details Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/85 to-transparent transition-all duration-500 z-10">
            {/* Header Info */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-1.5">
                <IoLocationOutline className="text-[#8b6a55] text-sm shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">{location.district}</span>
              </div>
              <h3 className="text-lg font-extrabold leading-snug text-white group-hover:text-[#8b6a55] transition-colors line-clamp-1">
                {location.name}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
                  <IoStar className="text-yellow-400 text-[10px]" />
                  <span className="text-[10px] font-bold text-white">{rating.toFixed(1)}</span>
                </div>
                <span className="text-[10px] text-white/50 font-medium">
                  ({location.review_count} {tLoc("reviews")})
                </span>
              </div>
            </div>

            {/* Expandable Section */}
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out overflow-hidden">
              <div className="min-h-0 space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                <p className="text-white/60 text-xs line-clamp-2 leading-relaxed border-t border-white/10 pt-3">
                  {location.short_description || location.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider">
                      {tLoc("price.from")}
                    </span>
                    <span className="text-sm font-black text-[#8b6a55]">{formatPrice(location.price_min)}</span>
                  </div>
                  <span className="px-3.5 py-2 bg-white text-black font-extrabold rounded-lg group-hover:bg-[#8b6a55] group-hover:text-white transition-all duration-300 uppercase tracking-widest text-[9px] shadow-md">
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
        className="absolute top-5 right-5 z-20 w-10 h-10 bg-[#111111]/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#ef4444] border border-[#262626] hover:bg-[#171717] hover:scale-105 hover:border-[#8b6a55]/30 active:scale-95 transition-all duration-300 group/heart"
        aria-label={tLoc("buttons.favorite_aria")}
      >
        <IoHeart className="text-lg group-hover/heart:scale-110 transition-transform" />
      </button>
    </div>
  );
}
