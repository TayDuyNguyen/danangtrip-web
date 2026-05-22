"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface Props {
  activeTab: "all" | "unread";
  onChange: (tab: "all" | "unread") => void;
  unreadCount: number;
}

export function NotificationsFilterTabs({
  activeTab,
  onChange,
  unreadCount,
}: Props) {
  const t = useTranslations("notifications");

  return (
    <div className="flex gap-2 p-1 bg-[#080808]/40 border border-[#262626] rounded-2xl backdrop-blur-md w-fit">
      <button
        onClick={() => onChange("all")}
        className={`px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
          activeTab === "all"
            ? "bg-[#8b6a55] text-white shadow-lg shadow-[#8b6a55]/20"
            : "text-neutral-400 hover:text-white hover:bg-white/5"
        }`}
      >
        {t("types.all")}
      </button>

      <button
        onClick={() => onChange("unread")}
        className={`px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 ${
          activeTab === "unread"
            ? "bg-[#8b6a55] text-white shadow-lg shadow-[#8b6a55]/20"
            : "text-neutral-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <span>{t("types.unread")}</span>
        {unreadCount > 0 && (
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
              activeTab === "unread"
                ? "bg-white text-[#8b6a55]"
                : "bg-[#8b6a55] text-white"
            }`}
          >
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
