import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { pointService } from "@/services/point.service";
import { getApiErrorMessage } from "@/utils/api-error";

export function usePointOverview() {
  return useQuery({
    queryKey: ["points", "overview"],
    queryFn: () => pointService.overview().then((res) => res.data),
    staleTime: 30 * 1000,
  });
}

export function usePointTransactions(page = 1, perPage = 10) {
  return useQuery({
    queryKey: ["points", "transactions", page, perPage],
    queryFn: () => pointService.transactions({ page, per_page: perPage }).then((res) => res.data),
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000,
  });
}

export function useUserVouchers() {
  return useQuery({
    queryKey: ["points", "vouchers"],
    queryFn: () => pointService.vouchers().then((res) => res.data ?? []),
    staleTime: 30 * 1000,
  });
}

export function useRedeemPointReward() {
  const queryClient = useQueryClient();
  const t = useTranslations("settings");

  return useMutation({
    mutationFn: (rewardId: number | string) => pointService.redeem(rewardId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["points"] });
      toast.success(t("points.redeem_success"));
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, t("points.redeem_error")));
    },
  });
}
