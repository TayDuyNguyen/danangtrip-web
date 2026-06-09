"use client";

import { useQuery } from "@tanstack/react-query";
import { reverseGeocode } from "../utils/reverse-geocode";

export function useGpsAddress(
  coords: { lat: number; lng: number } | null,
  locale: string,
  enabled = true
) {
  return useQuery({
    queryKey: ["gps-address", coords?.lat, coords?.lng, locale],
    queryFn: () => reverseGeocode(coords!.lat, coords!.lng, locale),
    enabled: enabled && !!coords,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
