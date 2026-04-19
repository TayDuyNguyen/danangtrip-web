import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// Define the namespaces we have
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
];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale;
  }

  // Optimized: Load all namespaces in parallel without fs.readdirSync
  const messages: Record<string, Record<string, unknown>> = {};

  await Promise.all(
    namespaces.map(async (ns) => {
      try {
        const message = (await import(`../messages/${locale}/${ns}.json`)).default as Record<string, unknown>;
        messages[ns] = message;
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
