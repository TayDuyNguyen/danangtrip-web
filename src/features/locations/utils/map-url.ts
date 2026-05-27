import type { Location } from "@/types";

export function getLocationMapsUrl(location: Location) {
  const lat = Number(location.latitude);
  const lng = Number(location.longitude);

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address || "")}`;
}
