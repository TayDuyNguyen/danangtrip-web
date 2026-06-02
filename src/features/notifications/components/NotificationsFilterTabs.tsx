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
    <div className="flex w-fit max-w-full gap-2 overflow-x-auto rounded-full border border-border bg-white p-1.5 shadow-[0_12px_34px_rgba(15,23,42,0.06)] no-scrollbar">
      <button
        onClick={() => onChange("all")}
        className={`rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-normal transition-all duration-300 ${
          activeTab === "all"
            ? "rounded-full bg-primary text-white shadow-[0_12px_24px_rgba(255,56,92,0.2)]"
            : "rounded-full text-on-surface-subtle hover:bg-[#f7f7f7] hover:text-on-surface"
        }`}
      >
        {t("types.all")}
      </button>

      <button
        onClick={() => onChange("unread")}
        className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-normal transition-all duration-300 ${
          activeTab === "unread"
            ? "rounded-full bg-primary text-white shadow-[0_12px_24px_rgba(255,56,92,0.2)]"
            : "rounded-full text-on-surface-subtle hover:bg-[#f7f7f7] hover:text-on-surface"
        }`}
      >
        <span>{t("types.unread")}</span>
        {unreadCount > 0 && (
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
              activeTab === "unread"
                ? "bg-white text-primary"
                : "bg-primary text-white"
            }`}
          >
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
