import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import { ratingService } from "@/services/rating.service";
import { getApiErrorMessage } from "@/utils/api-error";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface UseUserRatingsParams {
  page?: number;
  per_page?: number;
  status?: "pending" | "approved" | "rejected" | "";
  type?: "location" | "tour" | "";
}

export function useUserRatingsQuery(params: UseUserRatingsParams) {
  return useQuery({
    queryKey: ["profile", "ratings", params],
    queryFn: async () => {
      const response = await profileService.ratings(params);
      if (!response.success) {
        throw new Error(response.message || "Failed to load ratings");
      }
      return response.data;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 5000,
  });
}

export function useUpdateRatingMutation() {
  const queryClient = useQueryClient();
  const t = useTranslations("ratings.toasts");

  return useMutation({
    mutationFn: async ({
      ratingId,
      score,
      comment,
      files,
    }: {
      ratingId: number;
      score: number;
      comment: string;
      files?: File[];
    }) => {
      // In Laravel, PUT requests containing files (FormData) sometimes fail to parse.
      // ratingService.update handles FormData. Let's make sure it works.
      const response = await ratingService.update(ratingId, {
        score,
        comment,
        files,
      });
      if (!response.success) {
        throw new Error(response.message || "Failed to update rating");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success(t("update_success"));
      // Invalidate ratings lists
      queryClient.invalidateQueries({ queryKey: ["profile", "ratings"] });
      queryClient.invalidateQueries({ queryKey: ["locations", "ratings"] });
      queryClient.invalidateQueries({ queryKey: ["tours", "ratings"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("update_error")));
    },
  });
}

export function useDeleteRatingMutation() {
  const queryClient = useQueryClient();
  const t = useTranslations("ratings.toasts");

  return useMutation({
    mutationFn: async (ratingId: number) => {
      const response = await ratingService.delete(ratingId);
      if (!response.success) {
        throw new Error(response.message || "Failed to delete rating");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success(t("delete_success"));
      // Invalidate ratings lists
      queryClient.invalidateQueries({ queryKey: ["profile", "ratings"] });
      queryClient.invalidateQueries({ queryKey: ["locations", "ratings"] });
      queryClient.invalidateQueries({ queryKey: ["tours", "ratings"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("delete_error")));
    },
  });
}
