import { useQuery } from "@tanstack/react-query";
import { searchService } from "@/services/search.service";
import { extractItems } from "./use-search";

/**
 * Hook for discovery data (popular and trending searches)
 */
export const useSearchDiscovery = () => {
  const { data: popular = [], isLoading: isLoadingPopular } = useQuery({
    queryKey: ["search", "popular"],
    queryFn: async () => {
      try {
        const res = await searchService.getPopular(10, 30);
        return extractItems<string>(res.data);
      } catch (err) {
        console.error("Failed to fetch popular searches", err);
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
        return extractItems<string>(res.data);
      } catch (err) {
        console.error("Failed to fetch trending searches", err);
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
