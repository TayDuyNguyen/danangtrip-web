import type { PromotionItem } from "@/services/promotion.service";

type TourPricingInput = {
  adultPrice: number;
  childPrice: number;
  infantPrice: number;
  discountPercent: number;
  adults: number;
  children: number;
  infants: number;
};

type PromotionMatch = {
  promotion: PromotionItem;
  discountAmount: number;
};

export function calculateTourPricing({
  adultPrice,
  childPrice,
  infantPrice,
  discountPercent,
  adults,
  children,
  infants,
}: TourPricingInput) {
  const totalAmount =
    Math.max(0, adults) * Math.max(0, adultPrice) +
    Math.max(0, children) * Math.max(0, childPrice) +
    Math.max(0, infants) * Math.max(0, infantPrice);
  const tourDiscount = Math.max(0, (totalAmount * Math.max(0, discountPercent)) / 100);
  const subtotalAfterTourDiscount = Math.max(0, totalAmount - tourDiscount);

  return {
    totalAmount,
    tourDiscount,
    subtotalAfterTourDiscount,
  };
}

export function getPromotionDiscountAmount(promotion: PromotionItem, orderTotal: number): number {
  const discountValue = Number(promotion.discount_value || 0);
  const maxDiscountAmount = promotion.max_discount_amount ? Number(promotion.max_discount_amount) : null;

  if (promotion.discount_type === "percent") {
    return Math.min((orderTotal * discountValue) / 100, maxDiscountAmount ?? Number.POSITIVE_INFINITY);
  }

  return Math.min(discountValue, orderTotal);
}

export function getBestApplicablePromotion(
  promotions: PromotionItem[] | undefined,
  orderTotal: number
): PromotionMatch | null {
  return getApplicablePromotionMatches(promotions, orderTotal)[0] ?? null;
}

export function getApplicablePromotionMatches(
  promotions: PromotionItem[] | undefined,
  orderTotal: number
): PromotionMatch[] {
  return (promotions ?? [])
    .map((promotion) => ({
      promotion,
      discountAmount: getPromotionDiscountAmount(promotion, orderTotal),
    }))
    .filter(({ promotion, discountAmount }) => {
      const minOrder = Number(promotion.min_order_amount || 0);
      return promotion.status === "active" && orderTotal >= minOrder && discountAmount > 0;
    })
    .sort((a, b) => b.discountAmount - a.discountAmount);
}
