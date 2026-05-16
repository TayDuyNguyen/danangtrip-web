import type { Tour, TourCategory, TourSchedule } from "@/types";

/**
 * Normalizes a URL from the API.
 * Handles relative paths by prefixing them with the API host.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  
  // Get API host from NEXT_PUBLIC_API_URL (removes /api/v1 suffix if present)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiHost = apiUrl.replace(/\/api\/v1\/?$/, "");
  
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${apiHost}${cleanPath}`;
}

export const tourMapper = {
  /**
   * Normalizes a tour entity from the API
   */
  mapTour: (tour: Tour): Tour => {
    return {
      ...tour,
      thumbnail: normalizeImageUrl(tour.thumbnail),
      images: (tour.images || []).map(normalizeImageUrl),
      category: tour.category ? tourMapper.mapCategory(tour.category) : undefined,
    };
  },

  /**
   * Normalizes a tour category entity
   */
  mapCategory: (category: TourCategory): TourCategory => {
    return {
      ...category,
      // Add normalization for category images/icons if they exist
    };
  },

  /**
   * Normalizes a list of tours
   */
  mapTours: (tours: Tour[]): Tour[] => {
    return tours.map(tourMapper.mapTour);
  },
};
