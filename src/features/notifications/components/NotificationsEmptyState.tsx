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
    <div className="mx-auto flex max-w-2xl animate-in slide-in-from-bottom-4 fade-in flex-col items-center justify-center rounded-[20px] border border-border bg-white px-4 py-20 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)] duration-500">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-[#f7f7f7] text-on-surface-subtle transition-all duration-500 group">
        {isUnreadTab ? (
          <CheckCircle className="w-8 h-8 text-primary transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <BellOff className="w-8 h-8 text-on-surface-subtle transition-transform duration-500 group-hover:scale-110" />
        )}
      </div>

      <h3 className="mb-3 text-2xl font-extrabold tracking-tight text-on-surface">
        {isUnreadTab ? t("empty_state_unread") : t("empty_state_all")}
      </h3>
      <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-on-surface-subtle">
        {isUnreadTab ? t("empty_state_unread_desc") : t("empty_state_all_desc")}
      </p>

      <Link
        href={PUBLIC_ROUTES.TOURS}
        className="rounded-full bg-primary px-6 py-3 text-xs font-extrabold uppercase tracking-widest text-white shadow-[0_12px_30px_rgba(255,56,92,0.22)] transition-all duration-300 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {t("explore_button")}
      </Link>
    </div>
  );
}
