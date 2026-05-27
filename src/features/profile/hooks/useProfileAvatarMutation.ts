import { useMutation } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import { useAuthStore } from "@/store/auth.store";
import { resolveMediaUrl } from "@/utils/media-url";
import { normalizeAuthUser } from "@/utils/normalize-user";
import type { User } from "@/types";

type AvatarUploadPayload = {
  avatar?: string | null;
  avatar_url?: string | null;
  user?: User & { full_name?: string; avatar_url?: string };
};

function withCacheBust(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}t=${Date.now()}`;
}

/**
 * Hook to upload and update user avatar.
 * On success, syncs auth store from API user payload or avatar_url.
 */
export function useProfileAvatarMutation() {
  const setUser = useAuthStore((state) => state.setUser);
  const updateUser = useAuthStore((state) => state.updateUser);

  const avatarMutation = useMutation({
    mutationFn: (file: File) => profileService.updateAvatar(file),
    onSuccess: async (response) => {
      if (!response.success || !response.data) return;

      const payload = response.data as AvatarUploadPayload;

      if (payload.user) {
        const normalized = normalizeAuthUser(payload.user);
        setUser({
          ...normalized,
          avatar: normalized.avatar
            ? withCacheBust(normalized.avatar)
            : undefined,
        });
        return;
      }

      const uploadedAvatar = resolveMediaUrl(payload.avatar_url ?? payload.avatar);

      if (uploadedAvatar) {
        updateUser({ avatar: withCacheBust(uploadedAvatar) });
        return;
      }

      // Fallback: refetch profile when response shape is unexpected
      try {
        const profileResponse = await profileService.show();
        if (profileResponse.success && profileResponse.data) {
          const normalized = normalizeAuthUser(profileResponse.data);
          setUser({
            ...normalized,
            avatar: normalized.avatar
              ? withCacheBust(normalized.avatar)
              : undefined,
          });
        }
      } catch {
        // Store update failed silently; UI keeps local preview until retry
      }
    },
  });

  return { updateAvatar: avatarMutation };
}
