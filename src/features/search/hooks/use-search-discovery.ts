import { useQuery } from "@tanstack/react-query";
import { searchService } from "@/services/search.service";
import type { SearchTrendInsightItem } from "@/types/search.types";

export interface SearchDiscoveryKeyword {
  query: string;
  count: number;
}

/**
 * Hook for discovery data (popular and trending searches)
 */
export const useSearchDiscovery = () => {
  const { data: discoveryData, isLoading } = useQuery({
    queryKey: ["search", "trend-insights"],
    queryFn: async () => {
      try {
        const res = await searchService.getTrendInsights(10);
        return res.data ?? {
          items: [] as SearchTrendInsightItem[],
          trending_keywords: [] as SearchDiscoveryKeyword[],
          popular_keywords: [] as SearchDiscoveryKeyword[],
          top_locations: [] as SearchTrendInsightItem[],
        };
      } catch {
        return {
          items: [] as SearchTrendInsightItem[],
          trending_keywords: [] as SearchDiscoveryKeyword[],
          popular_keywords: [] as SearchDiscoveryKeyword[],
          top_locations: [] as SearchTrendInsightItem[],
        };
      }
    },
    staleTime: 1000 * 60 * 30, // 30 mins
  });

  return {
    insights: discoveryData?.items ?? [],
    trending: discoveryData?.trending_keywords ?? [],
    popular: discoveryData?.popular_keywords ?? [],
    topLocations: discoveryData?.top_locations ?? [],
    isLoading,
  };
};
