"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { useCopilotStore } from "@/features/copilot/store/copilot.store";

type Props = {
  location: Location;
  locale: string;
};

export default function LocationDetailClient({ location, locale }: Props) {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    enabled: mounted,
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
    enabled: mounted,
  });

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      toggleFavorite();
      return;
    }
    toggleFavorite();
  };

  const hasPhone = !!(location.phone && location.phone.trim() !== "");

  const handleBookNow = () => {
    if (location.website) {
      window.open(location.website, "_blank");
    } else if (location.phone) {
      window.location.href = `tel:${location.phone}`;
    }
  };

  const apiImages = imagesQuery.data?.images?.filter(Boolean) ?? [];
  const galleryImages = apiImages.length > 0 ? apiImages : (location.images?.filter(Boolean) ?? []);
  const galleryLoading = mounted && imagesQuery.isLoading && galleryImages.length === 0;
  const avgRating = Math.min(5, Math.max(0, parseFloat(location.avg_rating) || 0));

  return (
    <main className="relative min-h-screen pb-24">
      <LocationHero
        location={location}
        isFavorite={isFavorite}
        favoriteBusy={favoritePending}
        onFavoriteToggle={handleFavoriteToggle}
      />

      <div className="design-container">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            {(galleryImages.length > 0 || galleryLoading) && (
              <section className="reveal-up">
                <LocationGallery images={galleryImages} locationName={location.name} isLoading={galleryLoading} />
              </section>
            )}

            <div className="space-y-8 rounded-[32px] border border-border bg-white p-4 shadow-[0_20px_56px_rgba(15,23,42,0.08)] md:p-6">
              <section className="reveal-up reveal-delay-100">
                <LocationInfo location={location} />
              </section>

              <section className="reveal-up reveal-delay-200 border-t border-border pt-8">
                <LocationReviews
                  locationId={location.id}
                  initialAverageRating={avgRating}
                  initialReviewCount={location.review_count}
                />
              </section>
            </div>
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
