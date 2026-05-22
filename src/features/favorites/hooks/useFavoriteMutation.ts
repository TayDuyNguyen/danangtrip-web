import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteService } from "@/services/favorite.service";

export function useFavoriteMutation() {
  const queryClient = useQueryClient();

  const addFavoriteMutation = useMutation({
    mutationFn: (params: { location_id?: number; tour_id?: number }) =>
      favoriteService.addFavorite(params).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (params: { location_id?: number; tour_id?: number }) =>
      favoriteService.removeFavorite(params).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return {
    addFavorite: addFavoriteMutation,
    removeFavorite: removeFavoriteMutation,
  };
}
