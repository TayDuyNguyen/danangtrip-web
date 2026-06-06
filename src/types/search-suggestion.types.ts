import { Location, Tour } from "./entities.types";

export type SearchSuggestionType = "location" | "tour" | "keyword";

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
  score?: number;
}

export interface SearchSuggestionsData {
  keywords: SearchSuggestionItem[];
  locations: SearchSuggestionItem[];
  tours: SearchSuggestionItem[];
  total: number;
}

export interface RawSearchSuggestions {
  locations: Location[];
  tours: Tour[];
}
