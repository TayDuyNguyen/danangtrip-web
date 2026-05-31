"use client";

import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { homeService } from "@/services/home.service";
import { locationService } from "@/services/location.service";
import { mapApiConfig } from "@/services/config.service";
import type { Location, Category } from "@/types";
import type { HomeUnifiedData } from "@/services/home.service";
import { shouldRetryQuery } from "@/lib/react-query";
import { extractItems } from "@/utils";

export const useLocationCategories = (enabled: boolean = true) => {
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
    select: (data) => extractItems<Category>(data.categories),
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

export const useFeaturedLocations = (categoryId?: number, enabled: boolean = true) => {
  const queryClient = useQueryClient();
  const isUnified = !categoryId;

  const query = useQuery({
    queryKey: isUnified ? ["home", "unified-data"] : ["home", "locations", categoryId],
    queryFn: async () => {
      if (isUnified) {
        const res = await homeService.getHomeData();
        if (res.success && res.data) {
          if (res.data.config) {
            queryClient.setQueryData(["app", "config"], mapApiConfig(res.data.config));
          }
          return res.data;
        }
        throw res;
      } else {
        const res = await locationService.getAll({
          category_ids: [categoryId],
          sort_by: "avg_rating",
          sort_order: "desc",
          per_page: 8,
        });
        return extractItems<Location>(res.data);
      }
    },
    select: isUnified
      ? (data: unknown) => extractItems<Location>((data as HomeUnifiedData).featured_locations)
      : undefined,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: shouldRetryQuery,
    placeholderData: keepPreviousData,
  });

  return {
    locations: (query.data ?? []) as Location[],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isPlaceholderData: query.isPlaceholderData,
    refresh: () => query.refetch(),
  };
};
