"use client";

import { useQuery } from "@tanstack/react-query";
import { locationService } from "@/services/location.service";
import { categoryService } from "@/services/category.service";
import type { Location, Category } from "@/types";
import { shouldRetryQuery } from "@/lib/react-query";

/**
 * Enhanced useLocations hook using TanStack Query for deduplication and caching.
 * Resolves the performance bottleneck for featured locations and destination categories.
 */
export const useLocations = (categoryId?: number) => {
  // 1. Query for Categories (to show in tabs)
  const categoriesQuery = useQuery({
    queryKey: ["home", "locations", "categories"],
    queryFn: async () => {
      const res = await categoryService.getAll();
      if (res.success && res.data) {
        // Handle both direct array and nested data (if any)
        return Array.isArray(res.data) ? res.data : (res.data as Record<string, unknown>).data || [];
      }
      throw res;
    },
    staleTime: 10 * 60 * 1000,
    retry: shouldRetryQuery,
  });

  // 2. Query for Locations (Featured or Filtered)
  const featuredQuery = useQuery({
    queryKey: ["home", "locations", categoryId || "featured"],
    queryFn: async () => {
      let res;
      if (!categoryId) {
        res = await locationService.getFeatured(8);
      } else {
        res = await locationService.getAll({
          category_id: categoryId,
          sort: "avg_rating",
          order: "desc",
          per_page: 8,
        });
      }

      if (res.success && res.data) {
        // Robust data extraction: 
        // 1. Check if res.data is the array directly (Featured API)
        // 2. Check if res.data.data is the array (Paginated API)
        const items = Array.isArray(res.data) 
          ? res.data 
          : (res.data as Record<string, unknown>).data;
        
        return Array.isArray(items) ? items : [];
      }
      throw res;
    },
    staleTime: 5 * 60 * 1000,
    retry: shouldRetryQuery,
  });

  const featuredLocations: Location[] = (featuredQuery.data as Location[]) || [];
  const categories: Category[] = (categoriesQuery.data as Category[]) || [];
  const isLoading = featuredQuery.isLoading || categoriesQuery.isLoading;
  const isFetching = featuredQuery.isFetching;

  return {
    featuredLocations,
    categories,
    isLoading,
    isFetching,
    refresh: () => {
      void featuredQuery.refetch();
      void categoriesQuery.refetch();
    },
  };
};
