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
    <div className="group relative bg-surface-container-low rounded-[32px] overflow-hidden border border-outline-variant/10 hover:border-azure/30 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2">
      <Link href={detailHref} className="block text-inherit no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 rounded-[32px]">
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
              <span className="px-4 py-1.5 bg-azure text-white text-xs font-black rounded-full uppercase tracking-widest shadow-lg">
                {t("badges.featured")}
              </span>
            )}
            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20 uppercase tracking-widest">
              {location.district}
            </span>
          </div>

          {/* Info Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 pointer-events-none">
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
              <span className="text-xs opacity-70">
                ({location.review_count} {t("reviews")})
              </span>
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
              <span className="text-xs text-on-surface-subtle font-bold uppercase tracking-wider">
                {t("price.from")}
              </span>
              <span className="text-xl font-black text-azure">{formatPrice(location.price_min)}</span>
            </div>
            <span className="px-6 py-3 bg-foreground text-background font-black rounded-2xl group-hover:bg-azure group-hover:text-white transition-all duration-300 uppercase tracking-widest text-xs shadow-md">
              {t("buttons.view_details")}
            </span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white hover:text-azure transition-all duration-300 group/heart"
        aria-label={t("buttons.favorite_aria")}
      >
        <IoHeartOutline className="text-2xl group-hover/heart:scale-110 transition-transform" />
      </button>
    </div>
  );
}
