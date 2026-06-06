"use client";

import { useTranslations } from "next-intl";
import { Location } from "@/types";
import { useFavoriteIdsQuery } from "@/features/favorites/hooks/useFavoritesQuery";
import { useAuthStore } from "@/store/auth.store";
import LocationCard from "./LocationCard";

interface LocationGridProps {
  locations: Location[];
  isLoading?: boolean;
}

export default function LocationGrid({ locations, isLoading }: LocationGridProps) {
  const t = useTranslations("locations");
  const { isAuthenticated } = useAuthStore();
  const { data: favoriteIds } = useFavoriteIdsQuery(isAuthenticated);
  const favoriteLocationIds = new Set(favoriteIds?.location_ids ?? []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 py-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] animate-pulse rounded-[28px] border border-border bg-[#f3f4f6]" />
        ))}
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-32">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#fff1f3]">
          <span className="text-3xl text-primary">?</span>
        </div>
        <p className="text-xl font-semibold text-on-surface-subtle">{t("grid.empty_title")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 py-8 md:grid-cols-2 lg:grid-cols-3">
      {locations.map((location) => (
        <LocationCard key={location.id} location={location} isFavorite={favoriteLocationIds.has(location.id)} />
      ))}
    </div>
  );
}
