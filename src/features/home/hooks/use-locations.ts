"use client";

import { useQuery } from "@tanstack/react-query";
import { locationService } from "@/services/location.service";
import { categoryService } from "@/services/category.service";
import type { Location, Category } from "@/types";

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
      throw new Error(res.message || "Failed to fetch featured locations");
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // 2. Query for Categories
  const categoriesQuery = useQuery({
    queryKey: ["home", "locations", "categories"],
    queryFn: async () => {
      const res = await categoryService.getAll();
      if (res.success && res.data) return res.data;
      throw new Error(res.message || "Failed to fetch categories");
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
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
