import type { Location } from "@/types";

export interface LocationCategoryMeta {
  iconKey: string | null;
  iconBackground: string;
  name: string;
  slug: string;
}

export function getLocationCategoryMeta(location: Location): LocationCategoryMeta {
  const category =
    typeof location.category === "object" && location.category !== null
      ? location.category
      : null;

  return {
    iconKey: category?.icon ?? null,
    iconBackground: category?.icon_background ?? "#FFF4E8",
    name:
      category?.name ??
      (typeof location.category === "string" ? location.category : "Địa điểm"),
    slug: category?.slug ?? "",
  };
}

export function getLocationCoords(location: Location) {
  const lat = Number(location.latitude);
  const lng = Number(location.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}
