"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { PUBLIC_ROUTES } from "@/config/routes";
import { BellOff, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  activeTab: "all" | "unread";
}

export function NotificationsEmptyState({ activeTab }: Props) {
  const t = useTranslations("notifications");

  const isUnreadTab = activeTab === "unread";

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[#080808]/40 border border-[#262626] rounded-2xl p-8 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div className="w-16 h-16 bg-[#171717] rounded-2xl flex items-center justify-center border border-[#262626] mb-6 text-white/30 transition-all duration-500 group">
        {isUnreadTab ? (
          <CheckCircle className="w-8 h-8 text-[#8b6a55] transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <BellOff className="w-8 h-8 text-white/30 transition-transform duration-500 group-hover:scale-110" />
        )}
      </div>

      <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight">
        {isUnreadTab ? t("empty_state_unread") : t("empty_state_all")}
      </h3>
      <p className="text-neutral-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
        {isUnreadTab ? t("empty_state_unread_desc") : t("empty_state_all_desc")}
      </p>

      <Link
        href={PUBLIC_ROUTES.TOURS}
        className="px-6 py-3 bg-[#8b6a55] text-white hover:bg-[#a67c63] transition-all duration-300 font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-[#8b6a55]/20 focus:outline-none focus:ring-2 focus:ring-[#8b6a55]"
      >
        {t("explore_button")}
      </Link>
    </div>
  );
}
