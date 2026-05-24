import { useQuery } from "@tanstack/react-query";
import { searchService } from "@/services/search.service";
import type { RecommendationParams } from "@/types";

export function useRecommendationsQuery(params?: RecommendationParams) {
  return useQuery({
    queryKey: ["recommendations", params],
    queryFn: () => searchService.getRecommendations(params).then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}
