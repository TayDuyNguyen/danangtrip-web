import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["vi", "en"],

  // Used when no locale matches
  defaultLocale: "vi",

  // Disable automatic locale detection to force defaultLocale
  localeDetection: false,

  // Hide the default locale prefix in the URL
  localePrefix: "as-needed",
});

