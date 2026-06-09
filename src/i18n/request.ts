import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const namespaceLoaders = {
  vi: {
    common: () => import("../messages/vi/common.json"),
    home: () => import("../messages/vi/home.json"),
    login: () => import("../messages/vi/login.json"),
    register: () => import("../messages/vi/register.json"),
    translation: () => import("../messages/vi/translation.json"),
    search: () => import("../messages/vi/search.json"),
    locations: () => import("../messages/vi/locations.json"),
    contact: () => import("../messages/vi/contact.json"),
    blog: () => import("../messages/vi/blog.json"),
    settings: () => import("../messages/vi/settings.json"),
    dashboardAdmin: () => import("../messages/vi/dashboard-admin.json"),
    tour: () => import("../messages/vi/tour.json"),
    favorites: () => import("../messages/vi/favorites.json"),
    notifications: () => import("../messages/vi/notifications.json"),
    verifyEmail: () => import("../messages/vi/verify-email.json"),
    forgotPassword: () => import("../messages/vi/forgot-password.json"),
    resetPassword: () => import("../messages/vi/reset-password.json"),
    recommendations: () => import("../messages/vi/recommendations.json"),
    ratings: () => import("../messages/vi/ratings.json"),
    cart: () => import("../messages/vi/cart.json"),
    terms: () => import("../messages/vi/terms.json"),
    privacy: () => import("../messages/vi/privacy.json"),
    copilot: () => import("../messages/vi/copilot.json"),
  },
  en: {
    common: () => import("../messages/en/common.json"),
    home: () => import("../messages/en/home.json"),
    login: () => import("../messages/en/login.json"),
    register: () => import("../messages/en/register.json"),
    translation: () => import("../messages/en/translation.json"),
    search: () => import("../messages/en/search.json"),
    locations: () => import("../messages/en/locations.json"),
    contact: () => import("../messages/en/contact.json"),
    blog: () => import("../messages/en/blog.json"),
    settings: () => import("../messages/en/settings.json"),
    dashboardAdmin: () => import("../messages/en/dashboard-admin.json"),
    tour: () => import("../messages/en/tour.json"),
    favorites: () => import("../messages/en/favorites.json"),
    notifications: () => import("../messages/en/notifications.json"),
    verifyEmail: () => import("../messages/en/verify-email.json"),
    forgotPassword: () => import("../messages/en/forgot-password.json"),
    resetPassword: () => import("../messages/en/reset-password.json"),
    recommendations: () => import("../messages/en/recommendations.json"),
    ratings: () => import("../messages/en/ratings.json"),
    cart: () => import("../messages/en/cart.json"),
    terms: () => import("../messages/en/terms.json"),
    privacy: () => import("../messages/en/privacy.json"),
    copilot: () => import("../messages/en/copilot.json"),
  },
} as const;

import { headers } from "next/headers";

type AppLocale = keyof typeof namespaceLoaders;
type Namespace = keyof typeof namespaceLoaders.vi;
type JsonModule = { default?: Record<string, unknown> } | Record<string, unknown>;

const namespaces = Object.keys(namespaceLoaders.vi) as Namespace[];

// Determine which namespaces to load based on pathname
function getNamespacesForPath(pathname: string): Namespace[] {
  // Always load common, translation, settings, copilot and cart for global layout and shell support
  const core: Namespace[] = ["common", "translation", "settings", "copilot", "cart"];

  // Normalize pathname: strip locale prefix (e.g. /vi/tours -> /tours, /en -> /)
  const cleanPath = pathname.replace(/^\/(en|vi)(\/|$)/, "/") || "/";

  if (cleanPath === "/" || cleanPath === "") {
    return [...core, "home", "search", "locations", "tour", "blog"];
  }
  if (cleanPath.startsWith("/login")) {
    return [...core, "login"];
  }
  if (cleanPath.startsWith("/register")) {
    return [...core, "register"];
  }
  if (cleanPath.startsWith("/forgot-password")) {
    return [...core, "forgotPassword"];
  }
  if (cleanPath.startsWith("/reset-password")) {
    return [...core, "resetPassword"];
  }
  if (cleanPath.startsWith("/verify-email")) {
    return [...core, "verifyEmail"];
  }
  if (cleanPath.startsWith("/search")) {
    return [...core, "search", "locations", "tour"];
  }
  if (cleanPath.startsWith("/locations")) {
    return [...core, "locations", "ratings"];
  }
  if (cleanPath.startsWith("/tours")) {
    return [...core, "tour", "ratings"];
  }
  if (cleanPath.startsWith("/blog")) {
    return [...core, "blog"];
  }
  if (cleanPath.startsWith("/contact")) {
    return [...core, "contact"];
  }
  if (cleanPath.startsWith("/profile")) {
    return [...core, "favorites", "notifications", "tour", "ratings", "recommendations"];
  }
  if (cleanPath.startsWith("/cart")) {
    return [...core, "cart"];
  }
  if (cleanPath.startsWith("/payment")) {
    return [...core, "cart", "tour"];
  }
  if (cleanPath.startsWith("/terms")) {
    return [...core, "terms"];
  }
  if (cleanPath.startsWith("/privacy")) {
    return [...core, "privacy"];
  }

  // Fallback to all namespaces in case path is not matched
  return namespaces;
}

async function loadMessages(locale: AppLocale, pathname: string) {
  // If no pathname (e.g. static generation at build time), fallback to loading all namespaces
  const namespacesToLoad = pathname ? getNamespacesForPath(pathname) : namespaces;

  const loadedNamespaces = await Promise.all(
    namespacesToLoad.map(async (namespace) => {
      const importedModule = (await namespaceLoaders[locale][namespace]()) as JsonModule;
      const messages = "default" in importedModule && importedModule.default ? importedModule.default : importedModule;

      return [namespace, messages] as const;
    })
  );

  return Object.fromEntries(loadedNamespaces) as Record<Namespace, Record<string, unknown>>;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale;
  }

  const localeKey: AppLocale = locale === "en" ? "en" : "vi";

  let pathname = "";
  try {
    const headersList = await headers();
    pathname = headersList.get("x-pathname") || "";
  } catch {
    // Graceful fallback if headers() is called outside request context (e.g. static build)
  }

  return {
    locale,
    messages: await loadMessages(localeKey, pathname),
  };
});
