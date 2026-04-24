import type { LocationRatingListItem } from "@/features/locations/types/rating.types";
import type { LocationReview } from "@/types";

export function mapLocationRatingToReview(row: LocationRatingListItem): LocationReview {
  const name = row.user?.full_name?.trim() || row.user?.username || "—";
  const images = row.images?.map((i) => i.image_url).filter(Boolean) as string[] | undefined;

  return {
    id: String(row.id),
    userId: String(row.user_id),
    userName: name,
    userAvatar: row.user?.avatar || undefined,
    rating: row.score,
    comment: row.comment ?? "",
    images: images && images.length > 0 ? images : undefined,
    createdAt: row.created_at,
    helpfulCount: row.helpful_count,
  };
}
