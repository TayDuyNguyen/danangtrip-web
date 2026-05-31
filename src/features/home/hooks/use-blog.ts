"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { homeService } from "@/services/home.service";
import { mapApiConfig } from "@/services/config.service";
import type { BlogPost } from "@/types";
import { shouldRetryQuery } from "@/lib/react-query";

/**
 * Enhanced useBlog hook using TanStack Query for deduplication and caching.
 * Consolidates into single /home API and pre-warms global app config cache.
 */
export const useBlog = (enabled: boolean = true) => {
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
    select: (data) => data.latest_blogs?.data || [],
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: shouldRetryQuery,
  });

  const latestBlogs: BlogPost[] = query.data || [];

  return {
    latestBlogs,
    isLoading: query.isLoading,
    refresh: () => query.refetch(),
  };
};
