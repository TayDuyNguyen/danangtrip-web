import type { Location, Tour } from "./entities.types";

export interface FavoriteItem {
  id: number;
  location_id: number | null;
  tour_id: number | null;
  created_at: string;
  location?: Location;
  tour?: Tour;
}

export interface FavoritesListParams {
  page?: number;
  per_page?: number;
  sort?: "newest" | "oldest" | "name_asc" | "rating_desc";
}
