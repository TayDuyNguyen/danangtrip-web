"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/config/routes";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

export function FavoritesEmptyState() {
  const t = useTranslations("favorites");

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[#080808]/40 border border-[#262626] rounded-2xl p-8 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div className="w-16 h-16 bg-[#171717] rounded-2xl flex items-center justify-center border border-[#262626] mb-6 text-white/30 hover:text-red-500/50 hover:border-red-500/20 transition-all duration-500 group">
        <Heart className="w-8 h-8 transition-transform duration-500 group-hover:scale-110" />
      </div>

      <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight">
        {t("empty_state")}
      </h3>
      <p className="text-on-surface-subtle text-sm max-w-md mx-auto mb-8 leading-relaxed">
        {t("empty_state_desc")}
      </p>

      <Link
        href={PUBLIC_ROUTES.LOCATIONS}
        className="px-6 py-3 bg-[#8b6a55] text-white hover:bg-[#a67c63] transition-all duration-300 font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-[#8b6a55]/20 focus:outline-none focus:ring-2 focus:ring-[#8b6a55] focus:ring-offset-2"
      >
        {t("explore_button")}
      </Link>
    </div>
  );
}
