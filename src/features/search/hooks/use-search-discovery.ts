import { useQuery } from "@tanstack/react-query";
import { searchService } from "@/services/search.service";

/**
 * Hook for discovery data (popular and trending searches)
 */
export const useSearchDiscovery = () => {
  const { data: popular = [], isLoading: isLoadingPopular } = useQuery({
    queryKey: ["search", "popular"],
    queryFn: async () => {
      try {
        const res = await searchService.getPopular(10, 30);
        const popularData = res.data?.popular || [];
        return popularData.map((item) => item.query);
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 30, // 30 mins
  });

  const { data: trending = [], isLoading: isLoadingTrending } = useQuery({
    queryKey: ["search", "trending"],
    queryFn: async () => {
      try {
        const res = await searchService.getTrending(10);
        const trendingData = res.data?.trending || [];
        return trendingData.map((item) => item.query);
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 15, // 15 mins
  });

  return {
    popular,
    trending,
    isLoading: isLoadingPopular || isLoadingTrending,
  };
};
