import { useQuery } from "@tanstack/react-query";
import { favoriteService } from "@/services/favorite.service";
import type { FavoritesListParams } from "@/types";

export function useFavoritesQuery(params?: FavoritesListParams) {
  return useQuery({
    queryKey: ["favorites", "list", params],
    queryFn: () => favoriteService.getFavorites(params).then((res) => res.data),
    staleTime: 30 * 1000,
  });
}
