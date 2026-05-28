export interface SearchRequestParams {
  q?: string;
  type?: "tour" | "location";
  category_id?: number;
  tour_category_id?: number;
  district?: string;
  price_min?: number;
  price_max?: number;
  min_rating?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
  session_id?: string;
}

import type { Location, Tour } from "./entities.types";

export interface SearchSuggestionResponse {
  query: string;
  suggestions: string[];
}

export interface RecommendationParams {
  limit?: number;
}

export interface RecommendedLocation extends Location {
  recommendation_reason?: "viewed" | "similar_favorite" | "popular" | "booked" | string;
}

export interface RecommendedTour extends Tour {
  recommendation_reason?: "viewed" | "similar_favorite" | "popular" | "booked" | string;
}

export interface RecommendationResponse {
  locations: RecommendedLocation[];
  tours: RecommendedTour[];
}

export interface SearchPopularResponse {
  popular: {
    query: string;
    count: number;
  }[];
}

export interface SearchTrendingResponse {
  trending: {
    query: string;
    count: number;
  }[];
}
