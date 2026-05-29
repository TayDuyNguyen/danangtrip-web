import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { searchService } from "@/services/search.service";
import { 
  SearchSuggestionItem, 
  SearchSuggestionsData, 
  SearchSuggestionType 
} from "@/types/search-suggestion.types";
import { useLocale } from "next-intl";
import { extractItems } from "@/utils";

export const useSearchSuggestions = (query: string, type: string) => {
  const locale = useLocale();
  const debouncedQuery = useDebounce(query, 300);
  const isEnabled = debouncedQuery.trim().length >= 2;

  const { data, isLoading, isError, error } = useQuery<SearchSuggestionsData>({
    queryKey: ["search", "suggestions", debouncedQuery.trim(), type],
    queryFn: async () => {
      const q = debouncedQuery.trim();
      
      const res = await searchService.getSuggestions(q, 5);
      const rawData = res.data;
      const suggestionsPayload = (rawData && typeof rawData === "object" && "suggestions" in rawData)
        ? (rawData as { suggestions: unknown }).suggestions
        : rawData;
      const items = extractItems<Record<string, unknown> | string>(suggestionsPayload);

      const mappedStrings: SearchSuggestionItem[] = items
        .filter((item): item is string => typeof item === "string")
        .map((title, i) => {
          const normalized = title.toLowerCase();
          const isTour = normalized.startsWith("tour");
          return {
            id: -(i + 1),
            type: (isTour ? "tour" : "location") as SearchSuggestionType,
            title,
            slug: "",
            subtitle: "",
            thumbnail: null as string | null,
            rating: 0,
            reviewCount: 0,
            viewCount: 0,
          };
        });

      const objectItems = items.filter(
        (item): item is Record<string, unknown> => typeof item === "object" && item !== null
      );

      const keywords: SearchSuggestionItem[] = objectItems
        .filter((item) => (item as { type?: string }).type === "keyword")
        .map((keyword, i) => ({
          id: Number(keyword.id ?? -(100 + i)),
          type: "keyword" as SearchSuggestionType,
          title: String(keyword.title ?? keyword.name ?? ""),
          slug: String(keyword.slug ?? ""),
          subtitle: String(keyword.subtitle ?? ""),
          thumbnail: (keyword.thumbnail as string | null) ?? null,
          rating: 0,
          reviewCount: 0,
          viewCount: 0,
          score: Number(keyword.score ?? 0),
        }));

      const locations: SearchSuggestionItem[] = objectItems
        .filter((item): item is Record<string, unknown> => (item as { type?: string }).type === "location")
        .map((loc) => ({
          id: Number(loc.id),
          type: "location" as SearchSuggestionType,
          title: String(loc.name ?? ""),
          slug: String(loc.slug ?? ""),
          subtitle: String(loc.address ?? ""),
          thumbnail: (loc.thumbnail as string | null) ?? null,
          rating: parseFloat(String(loc.avg_rating ?? "0")),
          reviewCount: Number(loc.review_count ?? 0),
          viewCount: Number(loc.view_count ?? 0),
        }));

      const tours: SearchSuggestionItem[] = objectItems
        .filter((item): item is Record<string, unknown> => (item as { type?: string }).type === "tour")
        .map((tour) => ({
          id: Number(tour.id),
          type: "tour" as SearchSuggestionType,
          title: String(tour.name ?? ""),
          slug: String(tour.slug ?? ""),
          subtitle: `${new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
            style: "currency",
            currency: locale === "vi" ? "VND" : "USD",
            maximumFractionDigits: 0,
          }).format(parseFloat(String(tour.price_adult ?? "0")))}`,
          thumbnail: (tour.thumbnail as string | null) ?? null,
          rating: parseFloat(String(tour.avg_rating ?? "0")),
          reviewCount: Number(tour.review_count ?? 0),
          viewCount: Number(tour.view_count ?? 0),
          bookingCount: Number(tour.booking_count ?? 0),
        }))
        .sort((a: SearchSuggestionItem, b: SearchSuggestionItem) => (b.bookingCount || 0) - (a.bookingCount || 0));

      const stringLocations = type === "tour" ? [] : mappedStrings.filter((m) => m.type === "location");
      const stringTours = type === "location" ? [] : mappedStrings.filter((m) => m.type === "tour");

      const finalLocations = [...locations, ...stringLocations];
      const finalTours = [...tours, ...stringTours];

      return {
        keywords,
        locations: finalLocations,
        tours: finalTours,
        total: keywords.length + finalLocations.length + finalTours.length,
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
