import { useQuery, useMutation } from "@tanstack/react-query";
import { tourService } from "@/services/tour.service";
import { ratingService } from "@/services/rating.service";

export function useTourDetail(slug: string) {
  return useQuery({
    queryKey: ["tours", "detail", slug],
    queryFn: async () => {
      const response = await tourService.getDetail(slug);
      return response.data;
    },
    enabled: !!slug,
  });
}

export function useRelatedTours(categoryId?: number, currentTourId?: number) {
  return useQuery({
    queryKey: ["tours", "related", categoryId],
    queryFn: async () => {
      // For now, just get some tours in the same category or general list
      const response = await tourService.getAll({ 
        tour_category_id: categoryId,
        per_page: 4 
      });
      const tours = response.data?.data ?? [];
      // Filter out current tour if possible
      return tours.filter((tour) => tour.id !== currentTourId);
    },
    enabled: !!categoryId,
  });
}

export function useTourSchedules(tourId: string | number, params?: { from_date?: string; to_date?: string }) {
  return useQuery({
    queryKey: ["tours", "schedules", tourId, params],
    queryFn: async () => {
      const response = await tourService.getSchedules(tourId, params);
      return response.data ?? [];
    },
    enabled: !!tourId,
  });
}

export function useCheckTourAvailability(tourId: string | number) {
  return useMutation({
    mutationFn: async (payload: { schedule_id: number; quantity_adult: number; quantity_child?: number; quantity_infant?: number }) => {
      const response = await tourService.checkAvailability(tourId, payload);
      return response.data;
    },
  });
}

export function useTourRatings(tourId: string | number, params?: { page?: number; per_page?: number }) {
  return useQuery({
    queryKey: ["tours", "ratings", tourId, params],
    queryFn: async () => {
      const response = await tourService.getRatings(tourId, params);
      return response.data?.data ?? [];
    },
    enabled: !!tourId,
  });
}

export function useTourRatingStats(tourId: string | number) {
  return useQuery({
    queryKey: ["tours", "ratingStats", tourId],
    queryFn: async () => {
      const response = await tourService.getRatingStats(tourId);
      return response.data;
    },
    enabled: !!tourId,
  });
}

export function useCheckTourRating(tourId: string | number, isAuthenticated: boolean) {
  return useQuery({
    queryKey: ["tours", "checkRating", tourId],
    queryFn: async () => {
      const response = await ratingService.checkTour(Number(tourId));
      return response.data;
    },
    enabled: !!tourId && isAuthenticated,
  });
}

export function useSubmitTourRating() {
  return useMutation({
    mutationFn: async (payload: { tourId: number; score: number; comment?: string; files: File[] }) => {
      const response = await ratingService.createForTour(payload);
      return response.data;
    },
  });
}
