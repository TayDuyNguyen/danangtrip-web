"use client";

import Image from "next/image";
import { IoStar, IoLocationOutline, IoHeart, IoHeartOutline } from "@/components/icons/solar";
import type { Location } from "@/types";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/config/routes";
import { useFavoriteLocation } from "@/features/locations/hooks/use-favorite-location";

interface LocationCardProps {
  location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
  const t = useTranslations("locations");
  const detailHref = PUBLIC_ROUTES.LOCATION_DETAIL(location.slug);
  const { isFavorite, isPending, toggleFavorite } = useFavoriteLocation(location.id);

  const formatPrice = (price: number | null) => {
    if (!price || price === 0) return t("price.free");
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
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
      "/images/discovery/son-tra.png"
    ];
    const index = typeof location.id === "number" ? Math.abs(location.id) % fallbacks.length : 0;
    return fallbacks[index];
  };

  const image = getValidImage();

  return (
    <div className="group relative pt-2 -mt-2">
      <div className="relative bg-surface-container-low rounded-xl overflow-hidden border border-[#262626] group-hover:border-[#8b6a55]/30 transition-all duration-700 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:-translate-y-2">
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

        {/* Favorite Button — placed outside <Link> to avoid triggering navigation */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite();
          }}
          disabled={isPending}
          className={[
            "absolute top-6 right-6 z-20 w-12 h-12 backdrop-blur-md rounded-full flex items-center justify-center border transition-all duration-300 group/heart",
            isFavorite
              ? "bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600 scale-110"
              : "bg-[#111111]/70 border-[#262626] text-white hover:bg-[#171717] hover:text-red-400",
            isPending ? "opacity-60 cursor-not-allowed" : "",
          ].join(" ")}
          aria-label={t("buttons.favorite_aria")}
          aria-pressed={isFavorite}
        >
          {isPending ? (
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : isFavorite ? (
            <IoHeart className="text-2xl text-white drop-shadow-sm group-hover/heart:scale-110 transition-transform" />
          ) : (
            <IoHeartOutline className="text-2xl group-hover/heart:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
}
