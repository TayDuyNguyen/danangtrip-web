import type { LocationRatingListItem } from "@/types/location-rating.types";
import type { LocationReview } from "@/types";
import { resolveMediaUrl } from "@/utils/media-url";

export function mapLocationRatingToReview(
  row: LocationRatingListItem,
  options?: { isOwn?: boolean }
): LocationReview {
  const name = row.user?.full_name?.trim() || row.user?.username || "—";
  const images = row.images?.map((i) => resolveMediaUrl(i.image_url)).filter(Boolean) as string[] | undefined;

  return {
    id: String(row.id),
    userId: String(row.user_id),
    userName: name,
    userAvatar: resolveMediaUrl(row.user?.avatar_url ?? row.user?.avatar) ?? undefined,
    rating: row.score,
    comment: row.comment ?? "",
    images: images && images.length > 0 ? images : undefined,
    createdAt: row.created_at,
    helpfulCount: row.helpful_count,
    status: row.status,
    isOwn: options?.isOwn,
  };
}
