"use client";

import { useQuery } from "@tanstack/react-query";
import { tourService } from "@/services/tour.service";
import { locationService } from "@/services/location.service";
import { SearchResult, TourSearchResult, LocationSearchResult } from "../types/search.types";
import { useTranslations } from "next-intl";
import { extractItems } from "@/hooks/use-search-suggestions";
import type { Tour, Location } from "@/types";

export const useSearch = (keyword: string) => {
  const t = useTranslations("home");
  
  const { data: searchData, isLoading } = useQuery({
    queryKey: ["search", keyword],
    queryFn: async () => {
      // Parallel fetch for tours and locations
      const [toursRes, locationsRes] = await Promise.all([
        tourService.getAll({ q: keyword }),
        locationService.getAll({ q: keyword }),
      ]);

      const tours = extractItems<Tour>(toursRes.data);
      const locations = extractItems<Location>(locationsRes.data);

      // Transform Tours
      const transformedTours: SearchResult[] = tours.map((tour) => ({
        id: tour.id,
        type: "tour",
        title: tour.name,
        slug: tour.slug,
        thumbnail: tour.thumbnail,
        rating: parseFloat(tour.avg_rating),
        reviewCount: tour.review_count,
        price: parseFloat(tour.price_adult),
        duration: tour.duration,
        categoryName: t("search_type_tour"),
        bookingCount: tour.booking_count,
        featured: tour.is_featured || tour.is_hot,
        originalData: tour,
      }));

      // Transform Locations
      const transformedLocations: SearchResult[] = locations.map((loc) => ({
        id: loc.id,
        type: "location",
        title: loc.name,
        slug: loc.slug,
        thumbnail: loc.thumbnail,
        rating: parseFloat(loc.avg_rating),
        reviewCount: loc.review_count,
        categoryName: t("search_type_location"),
        priceLevel: loc.price_level || 1,
        address: loc.address,
        viewCount: loc.view_count,
        featured: loc.is_featured,
        originalData: loc,
      }));

      // Merge and Sort
      // Logic: Mix them, but sort by a combined "heat" metric for 'Featured' status if not explicit
      const allResults = [...transformedTours, ...transformedLocations];

      // Sort by popularity/bookings for the "Featured" logic in Grid
      // Primary: Explicit featured flag
      // Secondary: Booking count (tours) or View count (locations)
      return allResults.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        const scoreA = a.type === "tour" 
          ? (a as TourSearchResult).bookingCount 
          : (a as LocationSearchResult).viewCount;
        const scoreB = b.type === "tour" 
          ? (b as TourSearchResult).bookingCount 
          : (b as LocationSearchResult).viewCount;
        return scoreB - scoreA;
      });
    },
    enabled: true, // Always search, even if keyword is empty (shows all)
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const results = searchData || [];
  
  const counts = {
    all: results.length,
    tour: results.filter(r => r.type === "tour").length,
    location: results.filter(r => r.type === "location").length,
  };

  return {
    results,
    isLoading,
    counts,
  };
};
