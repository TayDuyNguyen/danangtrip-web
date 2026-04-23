"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { favoriteService } from "@/services/favorite.service";
import { useAuthStore } from "@/store/auth.store";

export function useAddFavoriteLocation() {
  const t = useTranslations();
  const { isAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: async (locId: number) => {
      if (!isAuthenticated) {
        toast.error(t("common.favorite.login_required"));
        const err = new Error("AUTH_REQUIRED");
        err.name = "AuthRequired";
        throw err;
      }
      return favoriteService.addFavorite(locId);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(t("common.favorite.add_success"));
      } else {
        toast.error(res.message || t("common.favorite.error"));
      }
    },
    onError: (err) => {
      if (err instanceof Error && err.name === "AuthRequired") return;
      toast.error(t("common.favorite.error"));
    },
  });
}
