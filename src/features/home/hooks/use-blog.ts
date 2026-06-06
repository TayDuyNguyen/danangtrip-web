"use client";

import { useQuery } from "@tanstack/react-query";
import { homeService } from "@/services/home.service";
import type { BlogPost } from "@/types";
import { shouldRetryQuery } from "@/lib/react-query";

/**
 * Enhanced useBlog hook using TanStack Query for deduplication and caching.
 * Consolidates into single /home API and pre-warms global app config cache.
 */
export const useBlog = (enabled: boolean = true) => {
  const query = useQuery({
    queryKey: ["home", "blogs-data"],
    queryFn: async () => {
      const res = await homeService.getHomeBlogs();
      if (res.success && res.data) {
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
