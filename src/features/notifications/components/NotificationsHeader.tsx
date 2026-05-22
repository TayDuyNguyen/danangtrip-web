"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui";

interface Props {
  unreadCount: number;
  onMarkAllRead: () => void;
  isMarkingAll: boolean;
}

export function NotificationsHeader({
  unreadCount,
  onMarkAllRead,
  isMarkingAll,
}: Props) {
  const t = useTranslations("notifications");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#262626]">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {t("page_title")}
        </h1>
        <p className="text-neutral-400 text-sm mt-2">
          {t("unread_count", { count: unreadCount })}
        </p>
      </div>

      {unreadCount > 0 && (
        <Button
          onClick={onMarkAllRead}
          disabled={isMarkingAll}
          className="self-start sm:self-center flex items-center gap-2 rounded-xl bg-[#8b6a55] hover:bg-[#a67c63] px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
        >
          <Check className="w-4 h-4" />
          {isMarkingAll ? t("toasts.marked_all_read") + "..." : t("mark_all_read")}
        </Button>
      )}
    </div>
  );
}
