"use client";

import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/services/blog.service";
import type { BlogPost } from "@/types";
import { shouldRetryQuery } from "@/lib/react-query";

/**
 * Enhanced useBlog hook using TanStack Query for deduplication and caching.
 */
export const useBlog = () => {
  const query = useQuery({
    queryKey: ["home", "blog", "latest"],
    queryFn: async () => {
      const response = await blogService.getLatest(1, 3);
      if (response.success && response.data) {
        return response.data.data || [];
      }
      throw response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: shouldRetryQuery,
  });

  const latestBlogs: BlogPost[] = query.data || [];

  return {
    latestBlogs,
    isLoading: query.isLoading,
    refresh: () => query.refetch(),
  };
};
