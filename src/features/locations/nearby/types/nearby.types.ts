import type { Location } from "@/types";

export interface NearbyQueryParams {
  lat: number;
  lng: number;
  radius?: number;
  limit?: number;
  sort_by?: "avg_rating" | "review_count" | "view_count" | "created_at" | "price_min";
  sort_order?: "asc" | "desc";
}

export interface NearbyLocation extends Location {
  distance: number; // calculated distance in km (Haversine formula from backend)
}
