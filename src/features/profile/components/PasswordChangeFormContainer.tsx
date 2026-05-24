"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PasswordChangeForm } from "./PasswordChangeForm";
import { useProfilePasswordMutation } from "../hooks/useProfilePasswordMutation";
import type { ChangePasswordFormInput } from "../validators/profile.validator";
import { getApiErrorMessage } from "@/utils/api-error";

/**
 * Client-side container for the Change Password form.
 * Owns the mutation lifecycle, toast feedback, and API error state.
 */
export function PasswordChangeFormContainer() {
  const t = useTranslations("settings");
  const { changePassword } = useProfilePasswordMutation();

  /**
   * Field-level API error (e.g. wrong current password).
   * Passed to PasswordChangeForm to display under the current_password input.
   */
  const [apiError, setApiError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0); // bumped to reset form after success

  const handleSubmit = (data: ChangePasswordFormInput) => {
    setApiError(null);

    changePassword.mutate(data, {
      onSuccess: () => {
        toast.success(t("change_password.success_toast"), {
          id: "password-change-success",
        });
        // Reset the form by remounting it
        setFormKey((k) => k + 1);
      },
      onError: (error) => {
        const message = getApiErrorMessage(error);
        // Map "wrong current password" API error to the field-level error
        if (
          message.toLowerCase().includes("current") ||
          message.toLowerCase().includes("incorrect") ||
          message.toLowerCase().includes("wrong") ||
          message.toLowerCase().includes("invalid")
        ) {
          setApiError(t("change_password.error_wrong_current"));
        } else {
          toast.error(t("change_password.error_generic"), {
            id: "password-change-error",
          });
        }
      },
    });
  };

  return (
    <PasswordChangeForm
      key={formKey}
      onSubmit={handleSubmit}
      isLoading={changePassword.isPending}
      apiError={apiError}
    />
  );
}
