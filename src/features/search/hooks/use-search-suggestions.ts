"use client";

import { useQuery } from "@tanstack/react-query";
import { searchService } from "@/services/search.service";

/**
 * Hook to fetch autocomplete suggestions from the search service.
 * Only queries when query has at least 2 characters.
 */
export function useSearchSuggestions(query: string, limit: number = 5) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: ["search", "suggestions", trimmed, limit],
    queryFn: async () => {
      if (trimmed.length < 2) return [];
      try {
        const res = await searchService.getSuggestions(trimmed, limit);
        return res.data?.suggestions || [];
      } catch {
        return [];
      }
    },
    enabled: trimmed.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
}
