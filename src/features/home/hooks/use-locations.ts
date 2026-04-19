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
export const useLocations = () => {
  const featuredQuery = useQuery({
    queryKey: ["home", "locations", "featured"],
    queryFn: async () => {
      const res = await locationService.getFeatured(8);
      if (res.success && res.data) return res.data;
      throw res;
    },
    staleTime: 5 * 60 * 1000,
    retry: shouldRetryQuery,
  });

  // 2. Query for Categories
  const categoriesQuery = useQuery({
    queryKey: ["home", "locations", "categories"],
    queryFn: async () => {
      const res = await categoryService.getAll();
      if (res.success && res.data) return res.data;
      throw res;
    },
    staleTime: 10 * 60 * 1000,
    retry: shouldRetryQuery,
  });

  const featuredLocations: Location[] = featuredQuery.data || [];
  const categories: Category[] = categoriesQuery.data || [];
  const isLoading = featuredQuery.isLoading || categoriesQuery.isLoading;

  return {
    featuredLocations,
    categories,
    isLoading,
    refresh: () => {
      void featuredQuery.refetch();
      void categoriesQuery.refetch();
    },
  };
};
