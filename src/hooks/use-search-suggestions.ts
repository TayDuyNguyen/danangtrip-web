import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { locationService } from "@/services/location.service";
import { tourService } from "@/services/tour.service";
import { 
  SearchSuggestionItem, 
  SearchSuggestionsData, 
  SearchSuggestionType 
} from "@/types/search-suggestion.types";
import { useLocale } from "next-intl";
import type { Location, Tour } from "@/types";

export function extractItems<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: T[] }).data;
  }

  return [];
}

export const useSearchSuggestions = (query: string, type: string) => {
  const locale = useLocale();
  const debouncedQuery = useDebounce(query, 300);
  const isEnabled = debouncedQuery.trim().length >= 2;

  const { data, isLoading, isError, error } = useQuery<SearchSuggestionsData>({
    queryKey: ["search", "suggestions", debouncedQuery.trim(), type],
    queryFn: async () => {
      const q = debouncedQuery.trim();
      
      // Determine what to fetch based on type
      const fetchLocations = type === "all" || type === "location";
      const fetchTours = type === "all" || type === "tour";
      const limit = type === "all" ? 5 : 8;

      const [locationsRes, toursRes] = await Promise.all([
        fetchLocations 
          ? locationService.getAll({ 
              q, 
              per_page: limit,
              sort: "view_count",
              order: "desc"
            }) 
          : Promise.resolve({ data: [] }),
        fetchTours 
          ? tourService.getAll({ 
              q, 
              per_page: limit,
              sort: "booking_count",
              order: "desc"
            }) 
          : Promise.resolve({ data: [] })
      ]);

      const locationItems = extractItems<Location>(locationsRes.data);
      const tourItems = extractItems<Tour>(toursRes.data);

      const locations: SearchSuggestionItem[] = locationItems
        .map(loc => ({
          id: loc.id,
          type: "location" as SearchSuggestionType,
          title: loc.name,
          slug: loc.slug,
          subtitle: loc.address,
          thumbnail: loc.thumbnail,
          rating: parseFloat(loc.avg_rating || "0"),
          reviewCount: loc.review_count,
          viewCount: loc.view_count
        }))
        .sort((a, b) => b.viewCount - a.viewCount); // Stable sort fallback

      const tours: SearchSuggestionItem[] = tourItems
        .map(tour => ({
          id: tour.id,
          type: "tour" as SearchSuggestionType,
          title: tour.name,
          slug: tour.slug,
          subtitle: `${new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', { 
            style: 'currency', 
            currency: locale === 'vi' ? 'VND' : 'USD',
            maximumFractionDigits: 0
          }).format(parseFloat(tour.price_adult || "0"))}`,
          thumbnail: tour.thumbnail,
          rating: parseFloat(tour.avg_rating || "0"),
          reviewCount: tour.review_count,
          viewCount: tour.view_count,
          bookingCount: tour.booking_count
        }))
        .sort((a, b) => (b.bookingCount || 0) - (a.bookingCount || 0)); // Stable sort fallback

      return {
        locations,
        tours,
        total: locations.length + tours.length
      };
    },
    enabled: isEnabled,
    staleTime: 60 * 1000, // 1 minute
  });

  return {
    suggestions: data,
    isLoading: isEnabled && isLoading,
    isError,
    error,
    isEnabled
  };
};
