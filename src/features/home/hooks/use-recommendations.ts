"use client";

import { useQuery } from "@tanstack/react-query";
import { searchService } from "@/services/search.service";
import { useAuthStore } from "@/store/auth.store";
import { shouldRetryQuery } from "@/lib/react-query";
import type { RecommendedLocation, RecommendedTour } from "@/types";

/**
 * Hook to retrieve personalized location and tour recommendations.
 * Enabled only for authenticated users.
 */
export const useRecommendations = (limit = 6) => {
  const { isAuthenticated } = useAuthStore();

  const query = useQuery({
    queryKey: ["home", "recommendations", limit],
    queryFn: async () => {
      const res = await searchService.getRecommendations({ limit });
      if (res.success && res.data) {
        return res.data;
      }
      throw res;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: shouldRetryQuery,
  });

  const locations: RecommendedLocation[] = query.data?.locations ?? [];
  const tours: RecommendedTour[] = query.data?.tours ?? [];

  return {
    locations,
    tours,
    isLoading: query.isLoading,
    isError: query.isError,
    refresh: () => query.refetch(),
  };
};
