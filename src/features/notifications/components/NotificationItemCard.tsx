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
          icon: <Bell className={`${baseClass} text-[#8b6a55]`} />,
          bg: "bg-[#8b6a55]/10 border border-[#8b6a55]/20",
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
      className={`bg-[#080808]/40 border rounded-2xl p-4 md:p-5 flex gap-4 items-start relative transition-all duration-300 backdrop-blur-md cursor-pointer select-none group ${
        isUnread
          ? "border-[#8b6a55]/30 hover:border-[#8b6a55]/50 shadow-sm shadow-[#8b6a55]/5"
          : "border-[#262626] hover:border-[#383838]"
      } ${isRemoving || isPending ? "opacity-50 pointer-events-none scale-95 duration-250" : "scale-100"}`}
    >
      {/* Unread indicator vertical strip */}
      {isUnread && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8b6a55] rounded-l-2xl" />
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
              isUnread ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"
            }`}
          >
            {item.title}
          </h4>
          {isUnread && (
            <span className="w-2 h-2 rounded-full bg-[#8b6a55] flex-shrink-0 animate-pulse" />
          )}
        </div>
        
        <p
          className={`text-xs leading-relaxed transition-colors duration-300 ${
            isUnread ? "text-neutral-300" : "text-neutral-500 group-hover:text-neutral-400"
          }`}
        >
          {item.message}
        </p>

        <span className="block text-[10px] font-mono text-neutral-600 group-hover:text-neutral-500 transition-colors duration-300 mt-2">
          {formatTimeAgo(item.created_at)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 self-center flex-shrink-0">
        {targetUrl && (
          <ChevronRight className="w-4 h-4 text-neutral-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-neutral-400" />
        )}
        
        <button
          onClick={handleDeleteClick}
          disabled={isRemoving}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 focus:opacity-100 disabled:pointer-events-none"
          title={t("delete")}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
