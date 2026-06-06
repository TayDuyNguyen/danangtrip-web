"use client";

import { useQuery } from "@tanstack/react-query";
import { homeService } from "@/services/home.service";
import type { Tour, TourCategory } from "@/types";
import { shouldRetryQuery } from "@/lib/react-query";
import { extractItems } from "@/utils";
import { tourMapper } from "@/features/tour/utils/tour-mapper";

export const useFeaturedTours = (enabled: boolean = true) => {
  const query = useQuery({
    queryKey: ["home", "tours-data"],
    queryFn: async () => {
      const res = await homeService.getHomeTours();
      if (res.success && res.data) {
        return res.data;
      }
      throw res;
    },
    select: (data) => tourMapper.mapTours(extractItems<Tour>(data.featured_tours)),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: shouldRetryQuery,
  });

  return {
    tours: query.data ?? [],
    isLoading: query.isLoading,
    refresh: () => query.refetch(),
  };
};

export const useHotTours = (enabled: boolean = true) => {
  const query = useQuery({
    queryKey: ["home", "tours-data"],
    queryFn: async () => {
      const res = await homeService.getHomeTours();
      if (res.success && res.data) {
        return res.data;
      }
      throw res;
    },
    select: (data) => tourMapper.mapTours(extractItems<Tour>(data.hot_tours)),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: shouldRetryQuery,
  });

  return {
    tours: query.data ?? [],
    isLoading: query.isLoading,
    refresh: () => query.refetch(),
  };
};

export const useHomeTourCategories = (enabled: boolean = true) => {
  const query = useQuery({
    queryKey: ["home", "tours-data"],
    queryFn: async () => {
      const res = await homeService.getHomeTours();
      if (res.success && res.data) {
        return res.data;
      }
      throw res;
    },
    select: (data) => extractItems<TourCategory>(data.tour_categories),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: shouldRetryQuery,
  });

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    refresh: () => query.refetch(),
  };
};
