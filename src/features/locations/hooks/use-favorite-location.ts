'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { favoriteService } from '@/services/favorite.service';
import { localFavoriteLocations } from '@/utils/local-favorites';
import { getApiErrorMessage } from '@/utils';

/**
 * Hook that manages the favorite state for a single location.
 * - Guest: persists in localStorage, updates UI immediately.
 * - Authenticated: calls the API, invalidates the cache on success.
 */
export function useFavoriteLocation(locationId: number) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  // Local state for guests (also used as optimistic fallback)
  const [localIsFavorite, setLocalIsFavorite] = useState(false);

  // Read localStorage on mount / auth change
  useEffect(() => {
    if (!isAuthenticated) {
      setLocalIsFavorite(localFavoriteLocations.has(locationId));
    }
  }, [isAuthenticated, locationId]);

  // API check for authenticated users
  const favoriteQuery = useQuery({
    queryKey: ['locations', locationId, 'favorite-check'],
    queryFn: async () => {
      const res = await favoriteService.checkFavorite({ location_id: locationId });
      if (!res.success || res.data === undefined) throw res;
      return res.data.is_favorite;
    },
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  const addFavorite = useMutation({
    mutationFn: () => favoriteService.addFavorite({ location_id: locationId }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(t('common.favorite.add_success'));
        void queryClient.invalidateQueries({
          queryKey: ['locations', locationId, 'favorite-check'],
        });
      } else {
        toast.error(getApiErrorMessage(res, t('common.favorite.error')));
      }
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, t('common.favorite.error'))),
  });

  const removeFavorite = useMutation({
    mutationFn: () => favoriteService.removeFavorite({ location_id: locationId }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(t('common.favorite.remove_success'));
        void queryClient.invalidateQueries({
          queryKey: ['locations', locationId, 'favorite-check'],
        });
      } else {
        toast.error(getApiErrorMessage(res, t('common.favorite.error')));
      }
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, t('common.favorite.error'))),
  });

  const isFavorite = isAuthenticated
    ? Boolean(favoriteQuery.data)
    : localIsFavorite;

  const isPending = addFavorite.isPending || removeFavorite.isPending;

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      if (localIsFavorite) {
        localFavoriteLocations.remove(locationId);
        setLocalIsFavorite(false);
        toast.success(t('common.favorite.remove_success'));
      } else {
        localFavoriteLocations.add(locationId);
        setLocalIsFavorite(true);
        toast.success(t('common.favorite.add_success'));
      }
      return;
    }

    if (isFavorite) {
      removeFavorite.mutate();
    } else {
      addFavorite.mutate();
    }
  };

  return { isFavorite, isPending, toggleFavorite };
}
