import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { favoriteService } from "@/services/favorite.service";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function useFavoriteCheck(params: { location_id?: number; tour_id?: number }) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["favorite-check", params],
    queryFn: async () => {
      const res = await favoriteService.checkFavorite(params);
      return res?.data?.is_favorite ?? false;
    },
    enabled: isAuthenticated && (!!params.location_id || !!params.tour_id),
  });
}

export function useFavoriteToggle(params: { location_id?: number; tour_id?: number }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isCurrentlyFavorite: boolean) => {
      if (isCurrentlyFavorite) {
        return favoriteService.removeFavorite(params);
      } else {
        return favoriteService.addFavorite(params);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-check", params] });
    },
  });
}
