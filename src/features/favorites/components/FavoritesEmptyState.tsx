"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/config/routes";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

export function FavoritesEmptyState() {
  const t = useTranslations("favorites");

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-[20px] border border-border bg-white px-4 py-20 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="group mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-[#f7f7f7] text-on-surface-subtle transition-all duration-500 hover:border-red-500/20 hover:text-red-500/50">
        <Heart className="w-8 h-8 transition-transform duration-500 group-hover:scale-110" />
      </div>

      <h3 className="mb-3 text-2xl font-semibold tracking-tight text-on-surface">
        {t("empty_state")}
      </h3>
      <p className="text-on-surface-subtle text-sm max-w-md mx-auto mb-8 leading-relaxed">
        {t("empty_state_desc")}
      </p>

      <Link
        href={PUBLIC_ROUTES.LOCATIONS}
        className="rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {t("explore_button")}
      </Link>
    </div>
  );
}
