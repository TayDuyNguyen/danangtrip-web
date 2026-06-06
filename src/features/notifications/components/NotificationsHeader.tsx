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
    <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
          {t("page_title")}
        </h1>
        <p className="mt-2 text-sm text-on-surface-subtle">
          {t("unread_count", { count: unreadCount })}
        </p>
      </div>

      {unreadCount > 0 && (
        <Button
          onClick={onMarkAllRead}
          disabled={isMarkingAll}
          className="flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-[0_12px_30px_rgba(255,56,92,0.22)] transition-all duration-300 hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-50 sm:self-center"
        >
          <Check className="w-4 h-4" />
          {isMarkingAll ? t("toasts.marked_all_read") + "..." : t("mark_all_read")}
        </Button>
      )}
    </div>
  );
}
