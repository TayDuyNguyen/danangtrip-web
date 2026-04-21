import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const namespaces = [
  "common",
  "home",
  "login",
  "register",
  "translation",
  "search",
  "locations",
  "contact",
  "blog",
  "settings",
] as const;

type Namespace = (typeof namespaces)[number];

type JsonModule = { default?: Record<string, unknown> } | Record<string, unknown>;

/** Cloudflare / OpenNext: dynamic `import(\`...\${var}...\`)` often omits `default`; use static paths only. */
function toMessageRecord(mod: JsonModule | undefined): Record<string, unknown> {
  if (!mod || typeof mod !== "object") return {};
  if ("default" in mod && mod.default && typeof mod.default === "object") {
    return mod.default as Record<string, unknown>;
  }
  return mod as Record<string, unknown>;
}

/** Literal import paths so the Worker bundle includes every JSON file. */
const messageLoaders: Record<"vi" | "en", Record<Namespace, () => Promise<JsonModule>>> = {
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
  },
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale;
  }

  const localeKey: "vi" | "en" = locale === "en" ? "en" : "vi";
  const loaders = messageLoaders[localeKey];

  const messages: Record<string, Record<string, unknown>> = {};

  await Promise.all(
    namespaces.map(async (ns) => {
      try {
        const mod = await loaders[ns]();
        messages[ns] = toMessageRecord(mod);
      } catch {
        console.warn(`Could not load i18n namespace "${ns}" for locale "${locale}"`);
      }
    })
  );

  return {
    locale,
    messages,
  };
});
