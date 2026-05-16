"use client";

import { useQuery } from "@tanstack/react-query";
import { statisticsService } from "@/services/statistics.service";
import type { Statistics } from "@/types";
import { shouldRetryQuery } from "@/lib/react-query";
import { getApiErrorMessage } from "@/utils";

/**
 * Enhanced useStatistics hook using TanStack Query.
 * Strict Mode: No mock fallback data allowed.
 */
export const useStatistics = () => {
  const query = useQuery({
    queryKey: ["home", "statistics"],
    queryFn: async () => {
      const res = await statisticsService.getStatistics();
      if (res.success && res.data) return res.data;
      throw res;
    },
    staleTime: 30 * 60 * 1000,
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
