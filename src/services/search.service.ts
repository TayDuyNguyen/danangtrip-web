import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import { ApiResponse, PaginatedResponse } from "@/types";
import type { Location, Tour } from "@/types";
import { SearchRequestParams, SearchSuggestionResponse } from "@/features/search/types/search.types";

export const searchService = {
  /**
   * Main search API
   */
  search: (params: SearchRequestParams): Promise<ApiResponse<PaginatedResponse<Tour | Location>>> =>
    axiosInstance.get(API_ENDPOINTS.SEARCH.LIST, { params }),

  /**
   * Autocomplete suggestions
   */
  getSuggestions: (q: string, limit: number = 5): Promise<ApiResponse<SearchSuggestionResponse>> =>
    axiosInstance.get(API_ENDPOINTS.SEARCH.SUGGESTIONS, { params: { q, limit } }),

  /**
   * Popular searches (30 days by default)
   */
  getPopular: (limit: number = 10, days: number = 30): Promise<ApiResponse<string[]>> =>
    axiosInstance.get(API_ENDPOINTS.SEARCH.POPULAR, { params: { limit, days } }),

  /**
   * Trending searches (1 day by default)
   */
  getTrending: (limit: number = 10): Promise<ApiResponse<string[]>> =>
    axiosInstance.get(API_ENDPOINTS.SEARCH.TRENDING, { params: { limit } }),
};
