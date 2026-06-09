"use client";

import NearbyRadiusFilter from "./NearbyRadiusFilter";
import NearbySortSelect from "./NearbySortSelect";

interface NearbyFiltersProps {
  radius: number;
  sortBy: string;
  onRadiusChange: (radius: number) => void;
  onSortChange: (sortBy: string) => void;
}

/** Bộ lọc bán kính + sắp xếp cho chế độ Gần bạn (tái sử dụng từ màn nearby cũ). */
export default function NearbyFilters({
  radius,
  sortBy,
  onRadiusChange,
  onSortChange,
}: NearbyFiltersProps) {
  return (
    <div className="space-y-3">
      <NearbyRadiusFilter radius={radius} onRadiusChange={onRadiusChange} />
      <NearbySortSelect sortBy={sortBy} onSortChange={onSortChange} />
    </div>
  );
}
