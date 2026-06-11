import { useQuery, useMutation } from "@tanstack/react-query";
import { promotionService } from "@/services/promotion.service";

export function useActivePromotions() {
  return useQuery({
    queryKey: ["promotions", "active-list"],
    queryFn: () => promotionService.list().then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
  });
}

export function useValidatePromotion() {
  return useMutation({
    mutationFn: ({ code, orderTotal }: { code: string; orderTotal: number }) =>
      promotionService.validate(code, orderTotal).then((res) => res.data),
  });
}
