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

export interface SearchTrendInsightItem {
  query: string;
  count: number;
  source: "keyword" | "location";
  slug?: string;
  district?: string;
}

export interface SearchTrendInsightsResponse {
  items: SearchTrendInsightItem[];
  trending_keywords: {
    query: string;
    count: number;
  }[];
  popular_keywords: {
    query: string;
    count: number;
  }[];
  top_locations: SearchTrendInsightItem[];
}

export interface SearchInteractionPayload {
  event: "suggestion_click" | "trending_click" | "result_click";
  query: string;
  type?: "location" | "tour" | "all";
  clicked_title?: string;
  clicked_slug?: string;
  clicked_type?: "location" | "tour" | "keyword";
  source?: string;
  session_id?: string;
  page?: number;
}
