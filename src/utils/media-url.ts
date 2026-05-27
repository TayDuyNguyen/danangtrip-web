import { config } from "@/config";

/**
 * Resolves avatar/media paths from API into a browser-loadable URL.
 */
export function resolveMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;

  const apiOrigin = config.api.url.replace(/\/api\/v\d+\/?$/, "");
  const apiBasePathMatch = config.api.url.match(/\/api\/v\d+\/?$/);
  const apiBasePath = apiBasePathMatch?.[0].replace(/\/$/, "") ?? "/api/v1";
  const mediaUrl = (mediaPath: string) =>
    `${apiOrigin}${apiBasePath}/media/${mediaPath.replace(/^\/+/, "")}`;

  if (
    path.startsWith("http://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    try {
      const url = new URL(path);
      if (url.pathname.startsWith("/storage/")) {
        return mediaUrl(url.pathname.replace(/^\/storage\//, ""));
      }
      if (url.origin === "http://localhost:8000") {
        return path.replace("http://localhost:8000", apiOrigin);
      }
    } catch {
      // Keep original URL when it cannot be parsed.
    }
    return path;
  }

  if (path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/storage/")) {
    return mediaUrl(path.replace(/^\/storage\//, ""));
  }

  if (path.startsWith("storage/")) {
    return mediaUrl(path.replace(/^storage\//, ""));
  }

  if (path.startsWith("/avatars/") || path.startsWith("avatars/")) {
    return mediaUrl(path);
  }

  if (path.startsWith("/")) {
    return `${apiOrigin}${path}`;
  }

  const normalized = path.replace(/^storage\//, "");
  return mediaUrl(normalized);
}
