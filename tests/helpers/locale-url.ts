/** next-intl localePrefix: "as-needed" — vi has no URL prefix. */
export const APP_BASE = "http://localhost:3000";
export const API_BASE = "http://127.0.0.1:8000/api/v1";
export function appUrl(path: string, locale: "vi" | "en" = "vi"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") {
    return normalized === "/" ? `${APP_BASE}/en` : `${APP_BASE}/en${normalized}`;
  }
  return `${APP_BASE}${normalized}`;
}
