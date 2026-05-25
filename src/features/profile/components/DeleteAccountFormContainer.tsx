"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAuth } from "@/features/auth";
import { useUserBookings } from "@/features/tour/hooks/useBookingQueries";
import { useProfileDeleteMutation } from "../hooks/useProfileDeleteMutation";
import { DeleteAccountForm } from "./DeleteAccountForm";
import { getApiErrorMessage } from "@/utils/api-error";
import { useRouter } from "@/i18n/navigation";
import type { ApiResponse } from "@/types";

/**
 * Client-side container for the Delete Account form.
 * Handles active bookings validation, delete account mutation, auth clearing, and redirect.
 */
export function DeleteAccountFormContainer() {
  const t = useTranslations("settings");
  const router = useRouter();
  const { logout } = useAuth();
  const { deleteAccount } = useProfileDeleteMutation();

  // Fetch bookings to check active status (page 1, up to 100 items)
  const { data: bookingsData, isLoading: isLoadingBookings } = useUserBookings({
    page: 1,
    per_page: 100,
  });

  const [apiError, setApiError] = useState<string | null>(null);

  // Active bookings are those with "pending" or "confirmed" status
  const activeBookings = bookingsData?.data?.filter(
    (b) => b.booking_status === "pending" || b.booking_status === "confirmed"
  ) ?? [];
  const activeBookingsCount = activeBookings.length;

  const handleSubmit = (password: string) => {
    setApiError(null);

    deleteAccount.mutate(password, {
      onSuccess: () => {
        toast.success(t("delete_account.success_toast"), {
          id: "delete-account-success",
        });

        // Perform clean logout and redirect to homepage
        logout().then(() => {
          router.push("/");
        });
      },
      onError: (error) => {
        const apiResponse = error as ApiResponse;
        const apiMessage = apiResponse?.message;
        const message = apiMessage || getApiErrorMessage(error);
        
        if (
          message.toLowerCase().includes("password") ||
          message.toLowerCase().includes("mật khẩu") ||
          message.toLowerCase().includes("chính xác")
        ) {
          setApiError(message);
          toast.error(message, {
            id: "delete-account-error",
          });
        } else {
          toast.error(message || t("delete_account.error_generic"), {
            id: "delete-account-error",
          });
        }
      },
    });
  };

  return (
    <DeleteAccountForm
      onSubmit={handleSubmit}
      isLoading={deleteAccount.isPending || isLoadingBookings}
      apiError={apiError}
      activeBookingsCount={activeBookingsCount}
    />
  );
}
