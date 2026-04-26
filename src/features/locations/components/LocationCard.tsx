"use client";

import Image from "next/image";
import { IoStar, IoLocationOutline, IoHeartOutline } from "react-icons/io5";
import type { Location } from "@/types";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/config/routes";

interface LocationCardProps {
  location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
  const t = useTranslations("locations");
  const detailHref = PUBLIC_ROUTES.LOCATION_DETAIL(location.slug);

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
    <div className="group relative bg-surface-container-low rounded-xl overflow-hidden border border-[#262626] hover:border-[#8b6a55]/30 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-2">
      <Link href={detailHref} className="block text-inherit no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b6a55] focus-visible:ring-offset-2 rounded-xl">
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
          <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
            {location.is_featured && (
              <span className="px-4 py-1.5 bg-[#8b6a55] text-white text-xs font-black rounded-full uppercase tracking-widest shadow-lg">
                {t("badges.featured")}
              </span>
            )}
            <span className="px-4 py-1.5 bg-[#111111]/70 backdrop-blur-md text-white text-xs font-bold rounded-full border border-[#262626] uppercase tracking-widest">
              {location.district}
            </span>
          </div>

          {/* Interaction Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end bg-linear-to-t from-black/95 via-black/80 to-transparent transition-all duration-500 group-hover:from-black group-hover:via-black/90">
            {/* Header Info (Always Visible) */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <IoLocationOutline className="text-[#8b6a55] text-base" />
                <span className="text-xs font-medium opacity-90 text-white/80">{location.district}</span>
              </div>
              <h3 className="text-xl font-black leading-tight text-white group-hover:text-[#8b6a55] transition-colors line-clamp-1">
                {location.name}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
                  <IoStar className="text-yellow-400 text-xs" />
                  <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
                </div>
                <span className="text-[10px] text-white/60">
                  ({location.review_count} {t("reviews")})
                </span>
              </div>
            </div>

            {/* Hidden Content (Reveal on Hover) */}
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out overflow-hidden">
              <div className="min-h-0 space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <p className="text-white/70 text-xs line-clamp-2 leading-relaxed border-t border-white/10 pt-4">
                  {location.short_description || location.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">
                      {t("price.from")}
                    </span>
                    <span className="text-lg font-black text-[#8b6a55]">{formatPrice(location.price_min)}</span>
                  </div>
                  <span className="px-4 py-2 bg-white text-black font-black rounded-lg group-hover:bg-[#8b6a55] group-hover:text-white transition-all duration-300 uppercase tracking-widest text-[10px] shadow-md">
                    {t("buttons.view_details")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <button
        type="button"
        className="absolute top-6 right-6 z-20 w-12 h-12 bg-[#111111]/70 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-[#262626] hover:bg-[#171717] hover:text-[#8b6a55] transition-all duration-300 group/heart"
        aria-label={t("buttons.favorite_aria")}
      >
        <IoHeartOutline className="text-2xl group-hover/heart:scale-110 transition-transform" />
      </button>
    </div>
  );
}
