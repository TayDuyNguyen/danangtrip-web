import type { User } from "@/types";
import { resolveMediaUrl } from "@/utils/media-url";

type ApiUser = User & {
  full_name?: string | null;
  avatar_url?: string | null;
  username?: string | null;
};

/**
 * Maps API user payload (full_name, avatar path/url) to the frontend User shape.
 */
export function normalizeAuthUser(raw: ApiUser | Record<string, unknown>): User {
  const user = raw as ApiUser;
  const avatarSource = user.avatar_url ?? user.avatar;

  return {
    ...user,
    id: String(user.id),
    name: user.name || user.full_name || user.username || "",
    avatar: resolveMediaUrl(avatarSource) ?? undefined,
  };
}
