"use client";

import { useQuery } from "@tanstack/react-query";
import { locationService } from "@/services/location.service";
import { categoryService } from "@/services/category.service";
import type { Location, Category } from "@/types";
import { shouldRetryQuery } from "@/lib/react-query";
import { extractItems } from "@/utils";

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
      return extractItems<Category>(res.data);
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
          category_ids: [categoryId],
          sort_by: "avg_rating",
          sort_order: "desc",
          per_page: 8,
        });
      }

      return extractItems<Location>(res.data);
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
