"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { homeService } from "@/services/home.service";
import { mapApiConfig } from "@/services/config.service";
import type { Tour, TourCategory } from "@/types";
import { shouldRetryQuery } from "@/lib/react-query";
import { extractItems } from "@/utils";
import { tourMapper } from "@/features/tour/utils/tour-mapper";

export const useFeaturedTours = (enabled: boolean = true) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["home", "unified-data"],
    queryFn: async () => {
      const res = await homeService.getHomeData();
      if (res.success && res.data) {
        if (res.data.config) {
          queryClient.setQueryData(["app", "config"], mapApiConfig(res.data.config));
        }
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
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["home", "unified-data"],
    queryFn: async () => {
      const res = await homeService.getHomeData();
      if (res.success && res.data) {
        if (res.data.config) {
          queryClient.setQueryData(["app", "config"], mapApiConfig(res.data.config));
        }
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
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["home", "unified-data"],
    queryFn: async () => {
      const res = await homeService.getHomeData();
      if (res.success && res.data) {
        if (res.data.config) {
          queryClient.setQueryData(["app", "config"], mapApiConfig(res.data.config));
        }
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
