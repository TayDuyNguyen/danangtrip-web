"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { tourService } from "@/services/tour.service";
import { locationService } from "@/services/location.service";
import type { Tour, Location } from "@/types";
import type { TourSearchResult, LocationSearchResult } from "../types/search.types";

export function useSearchDiscoveryGrid(enabled: boolean, locale: string) {
  const tHome = useTranslations("home");

  return useQuery({
    queryKey: ["search", "discovery-grid", locale],
    queryFn: async () => {
      const [toursRes, locsRes] = await Promise.all([
        tourService.getFeatured(6),
        locationService.getFeatured(6),
      ]);
      const tours = Array.isArray(toursRes.data) ? toursRes.data : [];
      const locs = Array.isArray(locsRes.data) ? locsRes.data : [];

      const mappedTours: TourSearchResult[] = (tours as Tour[]).map((tour) => ({
        id: tour.id,
        type: "tour" as const,
        title: tour.name,
        slug: tour.slug,
        thumbnail: tour.thumbnail,
        rating: parseFloat(String(tour.avg_rating ?? 0)),
        reviewCount: tour.review_count,
        price: parseFloat(String(tour.price_adult ?? 0)),
        duration: tour.duration,
        categoryName: tHome("search_type_tour"),
        bookingCount: tour.booking_count,
        featured: tour.is_featured || tour.is_hot,
        originalData: tour,
      }));

      const mappedLocs: LocationSearchResult[] = (locs as Location[]).map((loc) => ({
        id: loc.id,
        type: "location" as const,
        title: loc.name,
        slug: loc.slug,
        thumbnail: loc.thumbnail,
        rating: parseFloat(String(loc.avg_rating ?? 0)),
        reviewCount: loc.review_count,
        categoryName: tHome("search_type_location"),
        priceLevel: loc.price_level || 1,
        address: loc.address,
        viewCount: loc.view_count,
        featured: loc.is_featured,
        originalData: loc,
      }));

      const merged = [...mappedTours, ...mappedLocs];
      merged.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        const scoreA =
          a.type === "tour" ? (a as TourSearchResult).bookingCount : (a as LocationSearchResult).viewCount;
        const scoreB =
          b.type === "tour" ? (b as TourSearchResult).bookingCount : (b as LocationSearchResult).viewCount;
        return scoreB - scoreA;
      });
      return merged;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
