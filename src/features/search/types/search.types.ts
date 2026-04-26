import { Tour, Location } from "@/types";
import type { SearchRequestParams, SearchSuggestionResponse } from "@/types/search.types";

export type SearchResultType = "tour" | "location";

export interface SearchResultBase {
  id: number | string;
  type: SearchResultType;
  title: string;
  slug: string;
  thumbnail: string | null;
  rating: number;
  reviewCount: number;
  featured?: boolean;
}

export interface TourSearchResult extends SearchResultBase {
  type: "tour";
  price: number;
  duration: string;
  categoryName: string;
  bookingCount: number; // For featured sort
  originalData: Tour;
}

export interface LocationSearchResult extends SearchResultBase {
  type: "location";
  priceLevel?: number;
  categoryName: string;
  address: string;
  viewCount: number; // For featured sort
  originalData: Location;
}

export type SearchResult = TourSearchResult | LocationSearchResult;

export type SearchSortOption = "popular" | "price_asc" | "price_desc" | "rating_desc" | "newest";

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  category?: number;
  district?: string;
}

export interface SearchState {
  q: string;
  type: "all" | SearchResultType;
  sort: SearchSortOption;
  filters: SearchFilters;
  page?: number;
}

export type { SearchRequestParams, SearchSuggestionResponse };

