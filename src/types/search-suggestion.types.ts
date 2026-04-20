import { Location, Tour } from "./entities.types";

export type SearchSuggestionType = "location" | "tour";

export interface SearchSuggestionItem {
  id: number;
  type: SearchSuggestionType;
  title: string;
  slug: string;
  subtitle: string;
  thumbnail: string | null;
  rating: number;
  reviewCount: number;
  // Metadata for sorting
  viewCount: number;
  bookingCount?: number;
}

export interface SearchSuggestionsData {
  locations: SearchSuggestionItem[];
  tours: SearchSuggestionItem[];
  total: number;
}

export interface RawSearchSuggestions {
  locations: Location[];
  tours: Tour[];
}
