import { useMutation } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import { useAuthStore } from "@/store/auth.store";
import { normalizeAuthUser } from "@/utils/normalize-user";
import type { UpdateProfileFormInput } from "../validators/profile.validator";

/**
 * Hook to update user profile information.
 * On success, automatically updates the local auth store state.
 */
export function useProfileUpdateMutation() {
  const updateUserStore = useAuthStore((state) => state.updateUser);

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileFormInput) =>
      profileService.update({
        full_name: data.full_name,
        phone: data.phone,
        birthdate: data.birthdate || null,
        gender: (data.gender === "" || data.gender === "prefer_not_to_say" ? null : data.gender) as "male" | "female" | "other" | null,
        city: data.city || null,
      }),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const normalized = normalizeAuthUser(response.data);
        updateUserStore({
          name: normalized.name,
          phone: normalized.phone,
          birthdate: normalized.birthdate,
          gender: normalized.gender,
          city: normalized.city,
          avatar: normalized.avatar,
        });
      }
    },
  });

  return { updateProfile: updateProfileMutation };
}
