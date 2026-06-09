import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import { ApiResponse, PaginatedResponse } from "@/types";
import type { Location, Tour, RecommendedLocation, RecommendedTour } from "@/types";
import type { SearchInteractionPayload, SearchRequestParams, SearchSuggestionRequestParams, SearchSuggestionResponse, SearchPopularResponse, SearchTrendingResponse, SearchTrendInsightsResponse } from "@/types/search.types";

export const searchService = {
  /**
   * Main search API
   */
  search: (params: SearchRequestParams): Promise<ApiResponse<PaginatedResponse<Tour | Location>>> =>
    axiosInstance.get(API_ENDPOINTS.SEARCH.LIST, { params }),

  /**
   * Autocomplete suggestions
   */
  getSuggestions: (
    q: string,
    limit: number = 5,
    params: SearchSuggestionRequestParams = {}
  ): Promise<ApiResponse<SearchSuggestionResponse>> =>
    axiosInstance.get(API_ENDPOINTS.SEARCH.SUGGESTIONS, {
      params: { ...params, q, limit: Math.min(Math.max(limit, 1), 20) },
    }),

  /**
   * Popular searches (30 days by default)
   */
  getPopular: (limit: number = 10, days: number = 30): Promise<ApiResponse<SearchPopularResponse>> =>
    axiosInstance.get(API_ENDPOINTS.SEARCH.POPULAR, {
      params: {
        limit: Math.min(Math.max(limit, 1), 50),
        days: Math.min(Math.max(days, 1), 365),
      },
    }),

  /**
   * Trending searches (1 day by default)
   */
  getTrending: (limit: number = 10): Promise<ApiResponse<SearchTrendingResponse>> =>
    axiosInstance.get(API_ENDPOINTS.SEARCH.TRENDING, { params: { limit: Math.min(Math.max(limit, 1), 50) } }),

  /**
   * Blended trending insights: query logs + top viewed locations
   */
  getTrendInsights: (limit: number = 10): Promise<ApiResponse<SearchTrendInsightsResponse>> =>
    axiosInstance.get(API_ENDPOINTS.SEARCH.TRENDING_INSIGHTS, {
      params: { limit: Math.min(Math.max(limit, 1), 20) },
    }),

  /**
   * Track search interactions such as suggestion/result/trending clicks
   */
  trackInteraction: (payload: SearchInteractionPayload): Promise<ApiResponse<{ logged: boolean }>> =>
    axiosInstance.post(API_ENDPOINTS.SEARCH.INTERACTIONS, payload),

  /**
   * Get personalized recommendations
   */
  getRecommendations: (params?: { limit?: number }): Promise<ApiResponse<{ locations: RecommendedLocation[]; tours: RecommendedTour[] }>> =>
    axiosInstance.get(API_ENDPOINTS.RECOMMENDATIONS, { params }),
};
