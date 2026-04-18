"use client";

import { useQuery } from "@tanstack/react-query";
import { statisticsService } from "@/services/statistics.service";
import type { Statistics } from "@/types";

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
      throw new Error(res.message || "Failed to fetch statistics");
    },
    staleTime: 30 * 60 * 1000, 
    retry: 1,
  });

  const stats: Statistics | null = query.data || null;

  return {
    stats,
    isLoading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refresh: () => query.refetch(),
  };
};
