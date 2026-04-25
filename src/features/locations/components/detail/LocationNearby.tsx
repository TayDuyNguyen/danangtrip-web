"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/config/routes";
import type { Location } from "@/types";
import { useTranslations } from "next-intl";
import RatingStars from "@/components/ui/RatingStars";

type Props = {
  items: Location[];
  isLoading?: boolean;
};

export default function LocationNearby({ items, isLoading }: Props) {
  const t = useTranslations("locations");

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground">{t("detail.nearby_title")}</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-surface-container-low" />
          ))}
        </div>
      </div>
    );
  }

  if (!items.length) {
    return null;
  }

  return (
    <div className="reveal-up reveal-delay-300 space-y-4">
      <h3 className="text-lg font-bold text-foreground">{t("detail.nearby_title")}</h3>
      <ul className="space-y-3">
        {items.map((loc) => {
          const img = loc.thumbnail || loc.images?.[0] || "/images/placeholder.jpg";
          const rating = Math.min(5, Math.max(0, parseFloat(loc.avg_rating) || 0));
          return (
            <li key={loc.id}>
              <Link
                href={PUBLIC_ROUTES.LOCATION_DETAIL(loc.slug)}
                className="group flex gap-3 rounded-2xl border border-border bg-surface-container-lowest p-3 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-container-low">
                  <Image
                    src={img}
                    alt={loc.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-bold text-foreground group-hover:text-primary">
                    {loc.name}
                  </p>
                  <div className="mt-1">
                    <RatingStars rating={rating} size="sm" showText />
                  </div>
                  <p className="mt-0.5 truncate text-xs text-on-surface-subtle">{loc.district}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
