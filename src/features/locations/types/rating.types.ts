/**
 * Shape of an approved rating row returned by GET /locations/{id}/ratings.
 */
export interface LocationRatingListItem {
  id: number;
  user_id: number;
  score: number;
  comment: string | null;
  helpful_count: number;
  created_at: string;
  user?: {
    id: number;
    username: string;
    full_name: string | null;
    avatar: string | null;
  };
  images?: Array<{ image_url: string }>;
}

export interface LocationRatingCheckData {
  has_rated: boolean;
  rating: LocationRatingListItem | Record<string, unknown> | null;
}
