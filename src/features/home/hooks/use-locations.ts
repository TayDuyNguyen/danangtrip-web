"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { homeService } from "@/services/home.service";
import { locationService } from "@/services/location.service";
import type { Location, Category } from "@/types";
import type { HomeLocationsData } from "@/services/home.service";
import { shouldRetryQuery } from "@/lib/react-query";
import { extractItems } from "@/utils";

export const useLocationCategories = (enabled: boolean = true) => {
  const query = useQuery({
    queryKey: ["home", "locations-data"],
    queryFn: async () => {
      const res = await homeService.getHomeLocations();
      if (res.success && res.data) {
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
  const isUnified = !categoryId;

  const query = useQuery({
    queryKey: isUnified ? ["home", "locations-data"] : ["home", "locations", categoryId],
    queryFn: async () => {
      if (isUnified) {
        const res = await homeService.getHomeLocations();
        if (res.success && res.data) {
          return res.data;
        }
        throw res;
      } else {
        const res = await locationService.getAll({
          category_ids: [categoryId],
          sort_by: "avg_rating",
          sort_order: "desc",
          per_page: 20,
        });
        return extractItems<Location>(res.data);
      }
    },
    select: isUnified
      ? (data: unknown) => extractItems<Location>((data as HomeLocationsData).featured_locations)
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
