"use client";

import { useLocale } from "next-intl";
import { useLayoutEffect } from "react";

/**
 * Syncs <html lang> with the active next-intl locale (root layout defaults to defaultLocale).
 */
export function LocaleHtmlLang() {
  const locale = useLocale();

  useLayoutEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
