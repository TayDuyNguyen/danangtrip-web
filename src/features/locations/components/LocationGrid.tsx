"use client";

import { Location } from "@/types";
import LocationCard from "./LocationCard";

interface LocationGridProps {
  locations: Location[];
  isLoading?: boolean;
}

export default function LocationGrid({ locations, isLoading }: LocationGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-4/5 rounded-xl bg-surface-container-high animate-pulse border border-[#262626]" />
        ))}
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center">
          <span className="text-4xl">🔍</span>
        </div>
        <p className="text-xl font-bold text-on-surface-subtle">Không tìm thấy địa điểm nào phù hợp</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-8">
      {locations.map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  );
}
