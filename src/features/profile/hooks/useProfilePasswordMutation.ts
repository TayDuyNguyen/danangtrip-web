import { useMutation } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import type { ChangePasswordFormInput } from "../validators/profile.validator";

/**
 * Hook exposing the change-password mutation.
 * Callers are responsible for success/error toast feedback
 * (to allow locale-aware messages from the calling component).
 */
export function useProfilePasswordMutation() {
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordFormInput) =>
      profileService.changePassword({
        current_password: data.current_password,
        password: data.password,
        password_confirmation: data.password_confirmation,
      }),
  });

  return { changePassword: changePasswordMutation };
}
