import { useMutation } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";

/**
 * Hook exposing the delete-account mutation.
 */
export function useProfileDeleteMutation() {
  const deleteAccountMutation = useMutation({
    mutationFn: (password: string) => profileService.deleteAccount(password),
  });

  return { deleteAccount: deleteAccountMutation };
}
