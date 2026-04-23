"use client";

import Image from "next/image";
import { IoStar, IoLocationOutline, IoHeartOutline } from "react-icons/io5";
import type { Location } from "@/types";
import { useTranslations } from "next-intl";

interface LocationCardProps {
  location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
  const t = useTranslations("locations");

  const formatPrice = (price: number | null) => {
    if (!price || price === 0) return t("price.free");
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const rating = parseFloat(location.avg_rating) || 0;
  const image = location.thumbnail || (location.images && location.images[0]) || "/images/placeholder.jpg";

  return (
    <div className="group relative bg-surface-container-low rounded-[32px] overflow-hidden border border-outline-variant/10 hover:border-azure/30 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2">
      {/* Image Section */}
      <div className="relative aspect-4/5 overflow-hidden">
        <Image
          src={image}
          alt={location.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
        
        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          {location.is_featured && (
            <span className="px-4 py-1.5 bg-azure text-white text-xs font-black rounded-full uppercase tracking-widest shadow-lg">
              {t("badges.featured")}
            </span>
          )}
          {/* Map category_id to name if available, or just show category for now */}
          <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20 uppercase tracking-widest">
            {location.district}
          </span>
        </div>

        <button className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white hover:text-azure transition-all duration-300 group/heart">
          <IoHeartOutline className="text-2xl group-hover/heart:scale-110 transition-transform" />
        </button>

        {/* Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <div className="flex items-center gap-2">
            <IoLocationOutline className="text-azure text-lg" />
            <span className="text-sm font-medium opacity-90">{location.district}</span>
          </div>
          <h3 className="text-2xl font-black leading-tight group-hover:text-azure transition-colors">
            {location.name}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg">
              <IoStar className="text-yellow-400" />
              <span className="text-sm font-bold">{rating.toFixed(1)}</span>
            </div>
            <span className="text-xs opacity-70">({location.review_count} {t("reviews")})</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 space-y-6 bg-surface-container-low">
        <p className="text-on-surface-subtle line-clamp-2 text-sm leading-relaxed">
          {location.short_description || location.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
          <div className="flex flex-col">
            <span className="text-xs text-on-surface-subtle font-bold uppercase tracking-wider">{t("price.from")}</span>
            <span className="text-xl font-black text-azure">{formatPrice(location.price_min)}</span>
          </div>
          <button className="px-6 py-3 bg-foreground text-background font-black rounded-2xl hover:bg-azure hover:text-white transition-all duration-300 scale-100 active:scale-95 shadow-md uppercase tracking-widest text-xs">
            {t("buttons.view_details")}
          </button>
        </div>
      </div>
    </div>
  );
}
