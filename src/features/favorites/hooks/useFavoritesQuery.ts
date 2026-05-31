import { useQuery } from "@tanstack/react-query";
import { favoriteService } from "@/services/favorite.service";
import type { FavoriteIdsResponse, FavoritesListParams } from "@/types";

export function useFavoritesQuery(params?: FavoritesListParams, enabled: boolean = true) {
  return useQuery({
    queryKey: ["favorites", "list", params],
    queryFn: () => favoriteService.getFavorites(params).then((res) => res.data),
    enabled,
    staleTime: 30 * 1000,
  });
}

export function useFavoriteIdsQuery(enabled: boolean = true) {
  return useQuery<FavoriteIdsResponse>({
    queryKey: ["favorites", "ids"],
    queryFn: () =>
      favoriteService.getFavoriteIds().then((res) => res.data ?? { location_ids: [], tour_ids: [] }),
    enabled,
    staleTime: 30 * 1000,
  });
}
