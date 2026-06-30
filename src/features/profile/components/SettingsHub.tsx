"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { PROFILE_NAV_ITEMS } from "@/features/profile/profileNavItems";

export function SettingsHub() {
  const t = useTranslations("settings");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">{t("title")}</h1>
        <p className="mt-2 text-sm text-[#a3a3a3] md:text-base">{t("subtitle")}</p>
      </div>

      <nav aria-label={t("title")} className="grid gap-3 sm:grid-cols-2">
        {PROFILE_NAV_ITEMS.map(({ key, labelKey, href, icon: Icon }) => (
          <Link
            key={key}
            href={href}
            className="group flex items-center gap-4 rounded-xl border border-border bg-white p-4 text-left shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition hover:border-primary hover:shadow-md"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fff1f3] text-primary">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1 font-medium text-[#1f2937]">{t(labelKey)}</span>
            <ChevronRight
              className="h-5 w-5 shrink-0 text-[#9ca3af] transition group-hover:translate-x-0.5 group-hover:text-primary"
              aria-hidden
            />
          </Link>
        ))}
      </nav>
    </div>
  );
}
