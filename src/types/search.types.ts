export interface SearchRequestParams {
  q?: string;
  type?: "tour" | "location";
  category_id?: number;
  tour_category_id?: number;
  district?: string;
  price_min?: number;
  price_max?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
  session_id?: string;
}

export interface SearchSuggestionResponse {
  q: string;
  items: string[];
}
