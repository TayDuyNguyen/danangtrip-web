import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/** Top-level JSON imports only — no import(); Cloudflare Workers bundling can yield undefined .default on async chunks. */
import viCommon from "../messages/vi/common.json";
import viHome from "../messages/vi/home.json";
import viLogin from "../messages/vi/login.json";
import viRegister from "../messages/vi/register.json";
import viTranslation from "../messages/vi/translation.json";
import viSearch from "../messages/vi/search.json";
import viLocations from "../messages/vi/locations.json";
import viContact from "../messages/vi/contact.json";
import viBlog from "../messages/vi/blog.json";
import viSettings from "../messages/vi/settings.json";
import viDashboardAdmin from "../messages/vi/dashboard-admin.json";

import enCommon from "../messages/en/common.json";
import enHome from "../messages/en/home.json";
import enLogin from "../messages/en/login.json";
import enRegister from "../messages/en/register.json";
import enTranslation from "../messages/en/translation.json";
import enSearch from "../messages/en/search.json";
import enLocations from "../messages/en/locations.json";
import enContact from "../messages/en/contact.json";
import enBlog from "../messages/en/blog.json";
import enSettings from "../messages/en/settings.json";
import enDashboardAdmin from "../messages/en/dashboard-admin.json";

const messagesByLocale = {
  vi: {
    common: viCommon,
    home: viHome,
    login: viLogin,
    register: viRegister,
    translation: viTranslation,
    search: viSearch,
    locations: viLocations,
    contact: viContact,
    blog: viBlog,
    settings: viSettings,
    dashboardAdmin: viDashboardAdmin,
  },
  en: {
    common: enCommon,
    home: enHome,
    login: enLogin,
    register: enRegister,
    translation: enTranslation,
    search: enSearch,
    locations: enLocations,
    contact: enContact,
    blog: enBlog,
    settings: enSettings,
    dashboardAdmin: enDashboardAdmin,
  },
} as const satisfies Record<
  "vi" | "en",
  Record<
    | "common"
    | "home"
    | "login"
    | "register"
    | "translation"
    | "search"
    | "locations"
    | "contact"
    | "blog"
    | "settings"
    | "dashboardAdmin",
    Record<string, unknown>
  >
>;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale;
  }

  const localeKey: "vi" | "en" = locale === "en" ? "en" : "vi";
  const messages: Record<string, Record<string, unknown>> = {
    ...messagesByLocale[localeKey],
  };

  return {
    locale,
    messages,
  };
});
