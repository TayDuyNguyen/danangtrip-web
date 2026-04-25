"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { Location } from "@/types";
import { locationService } from "@/services/location.service";
import { favoriteService } from "@/services/favorite.service";
import { useAuthStore } from "@/store/auth.store";
import { shouldRetryQuery } from "@/lib/react-query";
import { useLocationRecordView } from "@/features/locations/hooks/use-location-record-view";
import LocationHero from "@/features/locations/components/detail/LocationHero";
import LocationGallery from "@/features/locations/components/detail/LocationGallery";
import LocationInfo from "@/features/locations/components/detail/LocationInfo";
import LocationSidebar from "@/features/locations/components/detail/LocationSidebar";
import LocationReviews from "@/features/locations/components/detail/LocationReviews";

type Props = {
  location: Location;
  locale: string;
};

export default function LocationDetailClient({ location, locale }: Props) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  useLocationRecordView(location.id);

  const imagesQuery = useQuery({
    queryKey: ["locations", location.id, "images"],
    queryFn: async () => {
      const res = await locationService.getImages(location.id);
      if (!res.success) {
        throw res;
      }
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: shouldRetryQuery,
  });

  const nearbyQuery = useQuery({
    queryKey: ["locations", location.id, "nearby"],
    queryFn: async () => {
      const res = await locationService.getNearbyByLocationId(location.id, 6);
      if (!res.success) {
        throw res;
      }
      return res.data ?? [];
    },
    staleTime: 10 * 60 * 1000,
    retry: shouldRetryQuery,
  });

  const favoriteQuery = useQuery({
    queryKey: ["locations", location.id, "favorite-check"],
    queryFn: async () => {
      const res = await favoriteService.checkFavorite(location.id);
      if (!res.success || res.data === undefined) {
        throw res;
      }
      return res.data.is_favorite;
    },
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  const addFavorite = useMutation({
    mutationFn: () => favoriteService.addFavorite(location.id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(t("common.favorite.add_success"));
        void queryClient.invalidateQueries({ queryKey: ["locations", location.id, "favorite-check"] });
      } else {
        toast.error(res.message || t("common.favorite.error"));
      }
    },
    onError: () => toast.error(t("common.favorite.error")),
  });

  const removeFavorite = useMutation({
    mutationFn: () => favoriteService.removeFavorite(location.id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(t("common.favorite.remove_success"));
        void queryClient.invalidateQueries({ queryKey: ["locations", location.id, "favorite-check"] });
      } else {
        toast.error(res.message || t("common.favorite.error"));
      }
    },
    onError: () => toast.error(t("common.favorite.error")),
  });

  const isFavorite = Boolean(favoriteQuery.data);
  const favoritePending = addFavorite.isPending || removeFavorite.isPending;

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error(t("common.favorite.login_required"));
      return;
    }
    if (isFavorite) {
      removeFavorite.mutate();
    } else {
      addFavorite.mutate();
    }
  };

  const apiImages = imagesQuery.data?.images?.filter(Boolean) ?? [];
  const galleryImages = apiImages.length > 0 ? apiImages : (location.images?.filter(Boolean) ?? []);
  const galleryLoading = imagesQuery.isLoading && galleryImages.length === 0;

  const avgRating = Math.min(5, Math.max(0, parseFloat(location.avg_rating) || 0));

  return (
    <main className="min-h-screen bg-background pb-20">
      <LocationHero
        locationName={location.name}
        isFavorite={isFavorite}
        favoriteBusy={favoritePending}
        onFavoriteToggle={toggleFavorite}
      />

      <div className="container mx-auto px-4 md:pt-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-8">
            <section className="reveal-up">
              <LocationGallery
                images={galleryImages}
                locationName={location.name}
                isLoading={galleryLoading}
              />
            </section>

            <section className="reveal-up reveal-delay-100">
              <LocationInfo location={location} />
            </section>

            <hr className="border-border" />

            <section className="reveal-up reveal-delay-200">
              <LocationReviews
                locationId={location.id}
                initialAverageRating={avgRating}
                initialReviewCount={location.review_count}
              />
            </section>
          </div>

          <div className="lg:col-span-4">
            <LocationSidebar
              location={location}
              locale={locale}
              nearby={nearbyQuery.data}
              nearbyLoading={nearbyQuery.isLoading}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
