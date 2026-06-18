import type { LocationRatingListItem } from "@/types/location-rating.types";
import type { LocationReview } from "@/types";

export function mergeUserReviewIntoList(
  reviews: LocationReview[],
  myRating: LocationRatingListItem | Record<string, unknown> | null | undefined,
  mapFn: (row: LocationRatingListItem) => LocationReview
): LocationReview[] {
  if (!myRating || typeof myRating !== "object" || !("id" in myRating)) {
    return reviews;
  }

  const mine = mapFn(myRating as LocationRatingListItem);
  if (reviews.some((review) => review.id === mine.id)) {
    return reviews;
  }

  return [mine, ...reviews];
}
