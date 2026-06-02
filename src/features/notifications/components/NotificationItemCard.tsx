"use client";

import React, { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  ShoppingBag,
  Star,
  Info,
  Gift,
  Bell,
  Trash2,
  ChevronRight,
} from "lucide-react";
import type { Notification } from "@/types";

interface Props {
  item: Notification;
  onMarkRead: (id: number) => void;
  onRemove: (id: number) => void;
  isRemoving: boolean;
}

export function NotificationItemCard({
  item,
  onMarkRead,
  onRemove,
  isRemoving,
}: Props) {
  const t = useTranslations("notifications");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isUnread = !item.read_at;
  const targetUrl = item.data?.url as string | undefined;

  // Format time ago helper
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffSecs < 60) {
      return t("time_ago.just_now");
    }
    if (diffMins < 60) {
      return t("time_ago.minutes", { count: diffMins });
    }
    if (diffHours < 24) {
      return t("time_ago.hours", { count: diffHours });
    }
    if (diffDays < 30) {
      return t("time_ago.days", { count: diffDays });
    }
    return t("time_ago.months", { count: diffMonths });
  };

  // Semantic icon selector
  const getCategoryIcon = (type: string) => {
    const baseClass = "w-5 h-5";
    switch (type.toLowerCase()) {
      case "booking":
        return {
          icon: <ShoppingBag className={`${baseClass} text-blue-500`} />,
          bg: "bg-blue-500/10 border border-blue-500/20",
        };
      case "rating":
        return {
          icon: <Star className={`${baseClass} text-amber-500`} />,
          bg: "bg-amber-500/10 border border-amber-500/20",
        };
      case "system":
        return {
          icon: <Info className={`${baseClass} text-neutral-400`} />,
          bg: "bg-neutral-500/10 border border-neutral-500/20",
        };
      case "promotion":
        return {
          icon: <Gift className={`${baseClass} text-orange-500`} />,
          bg: "bg-orange-500/10 border border-orange-500/20",
        };
      default:
        return {
          icon: <Bell className={`${baseClass} text-primary`} />,
          bg: "bg-primary/10 border border-primary/20",
        };
    }
  };

  const { icon, bg } = getCategoryIcon(item.type);

  const handleCardClick = () => {
    // 1. Mark as read if unread
    if (isUnread) {
      onMarkRead(item.id);
    }

    // 2. Redirect if target URL exists
    if (targetUrl) {
      if (/^https?:\/\//i.test(targetUrl)) {
        window.location.assign(targetUrl);
        return;
      }

      startTransition(() => {
        router.push(targetUrl);
      });
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    onRemove(item.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex cursor-pointer select-none items-start gap-4 rounded-[24px] border bg-white p-4 transition-all duration-300 md:p-5 ${
        isUnread
          ? "border-primary/25 shadow-[0_14px_40px_rgba(255,56,92,0.08)] hover:border-primary/45"
          : "border-border shadow-[0_12px_34px_rgba(15,23,42,0.06)] hover:border-primary/25"
      } ${isRemoving || isPending ? "pointer-events-none scale-95 opacity-50 duration-250" : "scale-100 hover:-translate-y-0.5"}`}
    >
      {/* Unread indicator vertical strip */}
      {isUnread && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />
      )}

      {/* Category Icon */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${bg}`}
      >
        {icon}
      </div>

      {/* Main Content */}
      <div className="flex-grow space-y-1.5 pr-8">
        <div className="flex items-center gap-2 flex-wrap">
          <h4
            className={`text-sm font-bold tracking-tight transition-colors duration-300 ${
              isUnread ? "text-on-surface" : "text-on-surface-subtle group-hover:text-on-surface"
            }`}
          >
            {item.title}
          </h4>
          {isUnread && (
            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 animate-pulse" />
          )}
        </div>
        
        <p
          className={`text-xs leading-relaxed transition-colors duration-300 ${
            isUnread ? "text-on-surface-subtle" : "text-on-surface-subtle group-hover:text-on-surface"
          }`}
        >
          {item.message}
        </p>

        <span className="mt-2 block text-[11px] text-on-surface-subtle transition-colors duration-300 group-hover:text-on-surface">
          {formatTimeAgo(item.created_at)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 self-center flex-shrink-0">
        {targetUrl && (
          <ChevronRight className="h-4 w-4 text-on-surface-subtle transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
        )}
        
        <button
          onClick={handleDeleteClick}
          disabled={isRemoving}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-on-surface-subtle opacity-100 transition-all duration-300 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-500 focus:opacity-100 disabled:pointer-events-none md:opacity-0 md:group-hover:opacity-100"
          title={t("delete")}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
