import { SearchState, SearchRequestParams, SearchSortOption, SearchResultType } from "../types/search.types";
import { getOrCreateSessionId } from "@/utils/session";

/**
 * Maps frontend sort options to backend sort_by and sort_order
 */
const mapSortParams = (sort: SearchSortOption, type: SearchResultType) => {
  // Backend Location sort_by: created_at, avg_rating, review_count, view_count, price_min
  // Backend Tour: traditionally sort_by/sort_order (mapping fix pending in repository)
  
  switch (sort) {
    case "price_asc":
      return { sort_by: type === "tour" ? "price_adult" : "price_min", sort_order: "asc" as const };
    case "price_desc":
      return { sort_by: type === "tour" ? "price_adult" : "price_min", sort_order: "desc" as const };
    case "rating_desc":
      return { sort_by: "avg_rating", sort_order: "desc" as const };
    case "newest":
      return { sort_by: "created_at", sort_order: "desc" as const };
    case "popular":
    default:
      return { sort_by: type === "tour" ? "booking_count" : "view_count", sort_order: "desc" as const };
  }
};

/**
 * Maps UI SearchState to SearchRequestParams for the /search API
 */
export const mapSearchStateToParams = (state: SearchState, targetType?: SearchResultType): SearchRequestParams => {
  const { q, type, sort, filters, page } = state;
  const activeType = targetType || (type === "all" ? "location" : type); // Default to location if all
  
  const sortParams = mapSortParams(sort, activeType);
  
  const params: SearchRequestParams = {
    type: activeType,
    district: filters.district,
    price_min: filters.minPrice,
    price_max: filters.maxPrice,
    category_id: activeType === "location" ? filters.category : undefined,
    tour_category_id: activeType === "tour" ? filters.category : undefined,
    ...sortParams,
    page: page || 1,
    per_page: 12,
    session_id: getOrCreateSessionId(),
  };

  if (q && q.trim()) {
    params.q = q.trim();
  }

  return params;
};
