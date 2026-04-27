import { Tour } from "@/types";

export interface TourFilterParams {
  search?: string;
  tour_category_id?: number;
  price_min?: number;
  price_max?: number;
  duration?: string;
  available_from?: string;
  available_to?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface TourViewModel extends Tour {
  // Add any UI-specific properties if needed
  formatted_price: string;
  has_discount: boolean;
  discounted_price?: number;
}
