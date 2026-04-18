"use client";

import { useQuery } from "@tanstack/react-query";
import { tourService } from "@/services/tour.service";
import type { Tour, TourCategory } from "@/types";
import { shouldRetryQuery } from "@/lib/react-query";

export const useTours = () => {
  // 1. Query for Featured Tours
  const featuredQuery = useQuery({
    queryKey: ["home", "tours", "featured"],
    queryFn: async () => {
      const res = await tourService.getFeatured(8);
      if (res.success && res.data) return res.data;
      throw res;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: shouldRetryQuery,
  });

  // 2. Query for Hot Tours
  const hotQuery = useQuery({
    queryKey: ["home", "tours", "hot"],
    queryFn: async () => {
      const res = await tourService.getHot(8);
      if (res.success && res.data) return res.data;
      throw res;
    },
    staleTime: 5 * 60 * 1000,
    retry: shouldRetryQuery,
  });

  // 3. Query for Tour Categories
  const categoriesQuery = useQuery({
    queryKey: ["home", "tours", "categories"],
    queryFn: async () => {
      const res = await tourService.getCategories();
      if (res.success && res.data) return res.data;
      throw res;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: shouldRetryQuery,
  });

  // Mock Fallbacks if API fails
  const featuredTours: Tour[] = featuredQuery.data || [];
  const hotTours: Tour[] = hotQuery.data || [];
  const tourCategories: TourCategory[] = categoriesQuery.data || [];

  const isLoading = featuredQuery.isLoading || hotQuery.isLoading || categoriesQuery.isLoading;

  return {
    featuredTours,
    hotTours,
    tourCategories,
    isLoading,
    refresh: () => {
      void featuredQuery.refetch();
      void hotQuery.refetch();
      void categoriesQuery.refetch();
    },
  };
};
