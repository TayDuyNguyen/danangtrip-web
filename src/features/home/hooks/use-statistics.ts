"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { homeService } from "@/services/home.service";
import { mapApiConfig } from "@/services/config.service";
import type { Statistics } from "@/types";
import { shouldRetryQuery } from "@/lib/react-query";
import { getApiErrorMessage } from "@/utils";

/**
 * Enhanced useStatistics hook using TanStack Query.
 * Consolidates into single /home API and pre-warms global app config cache.
 */
export const useStatistics = (enabled: boolean = true) => {
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
    select: (data) => data.statistics,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: shouldRetryQuery,
  });

  const stats: Statistics | null = query.data || null;

  return {
    stats,
    isLoading: query.isLoading,
    error: query.error ? getApiErrorMessage(query.error, "Statistics load failed") : null,
    refresh: () => query.refetch(),
  };
};
