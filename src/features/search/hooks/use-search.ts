import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { searchService } from "@/services/search.service";
import { 
  SearchResult, 
  TourSearchResult, 
  LocationSearchResult, 
  SearchState 
} from "../types/search.types";
import { mapSearchStateToParams } from "../utils/search-mapper";
import type { Tour, Location } from "@/types";
import { extractItems } from "@/utils";

export const useSearch = (params: SearchState) => {
  const { q, type } = params;
  const t = useTranslations("home");
  
  const { data: searchData, isLoading } = useQuery({
    queryKey: ["search", params],
    queryFn: async () => {
      // ... same logic
      const fetches = [];
      
      if (type === "all" || type === "tour") {
        fetches.push(searchService.search(mapSearchStateToParams(params, "tour")));
      }
      
      if (type === "all" || type === "location") {
        fetches.push(searchService.search(mapSearchStateToParams(params, "location")));
      }

      const results = await Promise.all(fetches);
      
      let allItems: SearchResult[] = [];
      let tourCount = 0;
      let locationCount = 0;

      results.forEach((res, index) => {
        const fetchType = type === "all" ? (index === 0 ? "tour" : "location") : type;
        const payload = res.data;
        const tourItems =
          fetchType === "tour" ? (extractItems<Tour>(payload) as Tour[]) : [];
        const locationItems =
          fetchType === "location" ? (extractItems<Location>(payload) as Location[]) : [];

        if (fetchType === "tour") {
          tourCount = payload?.total ?? tourItems.length;
          const transformedTours: TourSearchResult[] = tourItems.map((tour) => ({
            id: tour.id,
            type: "tour" as const,
            title: tour.name,
            slug: tour.slug,
            thumbnail: tour.thumbnail,
            rating: parseFloat(String(tour.avg_rating ?? 0)),
            reviewCount: tour.review_count,
            price: parseFloat(String(tour.price_adult ?? 0)),
            duration: tour.duration,
            categoryName: t("search_type_tour"),
            bookingCount: tour.booking_count,
            featured: tour.is_featured || tour.is_hot,
            originalData: tour,
          }));
          allItems = [...allItems, ...transformedTours];
        } else {
          locationCount = payload?.total ?? locationItems.length;
          const transformedLocations: LocationSearchResult[] = locationItems.map((loc) => ({
            id: loc.id,
            type: "location" as const,
            title: loc.name,
            slug: loc.slug,
            thumbnail: loc.thumbnail,
            rating: parseFloat(String(loc.avg_rating ?? 0)),
            reviewCount: loc.review_count,
            categoryName: t("search_type_location"),
            priceLevel: loc.price_level || 1,
            address: loc.address,
            viewCount: loc.view_count,
            featured: loc.is_featured,
            originalData: loc,
          }));
          allItems = [...allItems, ...transformedLocations];
        }
      });

      if (type === "all") {
        allItems.sort((a, b) => {
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
      }

      return {
        items: allItems,
        counts: {
          all: tourCount + locationCount,
          tour: tourCount,
          location: locationCount
        },
        meta: type === "all" ? undefined : results[0]?.data,
      };
    },
    enabled: !!q.trim(),
    staleTime: 1000 * 60 * 5,
  });

  return useMemo(() => ({
    results: searchData?.items || [],
    isLoading,
    counts: searchData?.counts || { all: 0, tour: 0, location: 0 },
    meta: searchData?.meta,
  }), [searchData, isLoading]);
};

