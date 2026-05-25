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

      // Backend có thể trả mảng chuỗi (từ khóa) thay vì entity
      if (items.length > 0 && typeof items[0] === "string") {
        const strings = items as string[];
        const mapped = strings.map((title, i) => {
          // Xác định loại (tour hoặc location) dựa trên từ đầu tiên của tiêu đề
          const isTour = title.toLowerCase().startsWith("tour");
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

        const locations = type === "tour" ? [] : mapped.filter((m) => m.type === "location");
        const tours = type === "location" ? [] : mapped.filter((m) => m.type === "tour");

        return {
          locations,
          tours,
          total: locations.length + tours.length,
        };
      }

      const locations: SearchSuggestionItem[] = items
        .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null && (item as { type?: string }).type === "location")
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

      const tours: SearchSuggestionItem[] = items
        .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null && (item as { type?: string }).type === "tour")
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

      return {
        locations,
        tours,
        total: locations.length + tours.length,
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
