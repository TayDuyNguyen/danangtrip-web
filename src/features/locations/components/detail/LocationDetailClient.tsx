"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { Location } from "@/types";
import { locationService } from "@/services/location.service";
import { useAuthStore } from "@/store/auth.store";
import { shouldRetryQuery } from "@/lib/react-query";
import { useLocationRecordView } from "@/features/locations/hooks/use-location-record-view";
import { useFavoriteLocation } from "@/features/locations/hooks/use-favorite-location";
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
  const { isAuthenticated } = useAuthStore();

  useLocationRecordView(location.id);

  const { isFavorite, isPending: favoritePending, toggleFavorite } = useFavoriteLocation(location.id);

  const imagesQuery = useQuery({
    queryKey: ["locations", location.id, "images"],
    queryFn: async () => {
      const res = await locationService.getImages(location.id);
      if (!res.success) throw res;
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: shouldRetryQuery,
  });

  const nearbyQuery = useQuery({
    queryKey: ["locations", location.id, "nearby"],
    queryFn: async () => {
      const res = await locationService.getNearbyByLocationId(location.id, 6);
      if (!res.success) throw res;
      return res.data ?? [];
    },
    staleTime: 10 * 60 * 1000,
    retry: shouldRetryQuery,
  });

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      // Guest: handled inside the hook (localStorage + toast)
      toggleFavorite();
      return;
    }
    toggleFavorite();
  };

  const apiImages = imagesQuery.data?.images?.filter(Boolean) ?? [];
  const galleryImages = apiImages.length > 0 ? apiImages : (location.images?.filter(Boolean) ?? []);
  const galleryLoading = imagesQuery.isLoading && galleryImages.length === 0;

  const avgRating = Math.min(5, Math.max(0, parseFloat(location.avg_rating) || 0));

  return (
    <main className="relative min-h-screen pb-24">
      <LocationHero
        locationName={location.name}
        isFavorite={isFavorite}
        favoriteBusy={favoritePending}
        onFavoriteToggle={handleFavoriteToggle}
      />

      <div className="design-container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left column: Gallery + Info + Reviews */}
          <div className="space-y-10 lg:col-span-8">
            {(galleryImages.length > 0 || galleryLoading) && (
              <section className="reveal-up">
                <LocationGallery
                  images={galleryImages}
                  locationName={location.name}
                  isLoading={galleryLoading}
                />
              </section>
            )}

            <div className="glass-retro rounded-3xl p-4 md:p-6 space-y-12">
              <section className="reveal-up reveal-delay-100">
                <LocationInfo location={location} />
              </section>

              {/* Reviews section */}
              <section className="reveal-up reveal-delay-200 pt-10 border-t border-white/10">
                <LocationReviews
                  locationId={location.id}
                  initialAverageRating={avgRating}
                  initialReviewCount={location.review_count}
                />
              </section>
            </div>
          </div>

          {/* Right column: Sticky Sidebar */}
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
