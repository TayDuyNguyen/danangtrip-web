"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui";
import { StandardPagination } from "@/components/ui/pagination";

import { NotificationsHeader } from "./NotificationsHeader";
import { NotificationsFilterTabs } from "./NotificationsFilterTabs";
import { NotificationItemCard } from "./NotificationItemCard";
import { NotificationsEmptyState } from "./NotificationsEmptyState";
import { NotificationsSkeleton } from "./NotificationsSkeleton";

import { useNotificationsQuery, useUnreadCountQuery } from "../hooks/useNotificationsQuery";
import { useNotificationMutation } from "../hooks/useNotificationMutation";

export function NotificationsPageClient() {
  const t = useTranslations("notifications");

  // Client States
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [page, setPage] = useState<number>(1);
  const perPage = 10;

  // Track items being removed
  const [removingIds, setRemovingIds] = useState<number[]>([]);

  // 1. Fetch live unread count (for badge and header counter)
  const { data: unreadCountData } = useUnreadCountQuery();
  const unreadCount = unreadCountData?.unread_count ?? 0;

  // 2. Fetch paginated notifications list based on active tab and page
  const queryParams = {
    page,
    per_page: perPage,
    read: activeTab === "unread" ? false : undefined,
  };

  const {
    data: listData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useNotificationsQuery(queryParams);

  // 3. API Mutations
  const { markAsRead, markAllAsRead, removeNotification } = useNotificationMutation();

  // Reset page to 1 when changing filters
  const handleTabChange = (tab: "all" | "unread") => {
    setActiveTab(tab);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Actions
  const handleMarkRead = (id: number) => {
    markAsRead.mutate(id, {
      onError: () => {
        toast.error(t("toasts.mark_read_error"));
      },
    });
  };

  const handleMarkAllRead = () => {
    markAllAsRead.mutate(undefined, {
      onSuccess: () => {
        toast.success(t("toasts.marked_all_read"));
      },
      onError: () => {
        toast.error(t("toasts.mark_all_read_error"));
      },
    });
  };

  const handleRemove = (id: number) => {
    // Optimistic disable/loading for this card
    setRemovingIds((prev) => [...prev, id]);

    removeNotification.mutate(id, {
      onSuccess: () => {
        toast.success(t("toasts.removed"));
        setRemovingIds((prev) => prev.filter((item) => item !== id));

        // EC-02: Auto-decrement page if we deleted the last item on the page
        const currentItemsCount = listData?.data.length ?? 0;
        if (currentItemsCount <= 1 && page > 1) {
          setPage((prev) => prev - 1);
        }
      },
      onError: () => {
        toast.error(t("toasts.remove_error"));
        setRemovingIds((prev) => prev.filter((item) => item !== id));
      },
    });
  };

  // Safe data retrieval
  const notifications = listData?.data ?? [];
  const totalPages = listData?.last_page ?? 1;

  return (
    <div className="min-h-screen space-y-6 pb-20">
      {/* Header section with live unread counter */}
      <NotificationsHeader
        unreadCount={unreadCount}
        onMarkAllRead={handleMarkAllRead}
        isMarkingAll={markAllAsRead.isPending}
      />

      {/* Filtering tabs */}
      <div className="flex items-center justify-between gap-4">
        <NotificationsFilterTabs
          activeTab={activeTab}
          onChange={handleTabChange}
          unreadCount={unreadCount}
        />
      </div>

      {/* Main List Area */}
      {isError ? (
        <div className="mx-auto max-w-xl animate-in rounded-[28px] border border-border bg-white p-12 text-center shadow-[0_16px_48px_rgba(15,23,42,0.08)] duration-300">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Info className="w-6 h-6 text-red-500" />
          </div>
          <p className="mb-4 font-bold text-on-surface">{t("toasts.load_error")}</p>
          <Button
            onClick={() => refetch()}
            className="mx-auto flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all duration-300 hover:bg-primary-hover"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            {t("retry")}
          </Button>
        </div>
      ) : isLoading ? (
        <NotificationsSkeleton />
      ) : notifications.length === 0 ? (
        <NotificationsEmptyState activeTab={activeTab} />
      ) : (
        <div className="space-y-6">
          {/* Notifications Card List */}
          <div className="space-y-4">
            {notifications.map((item, index) => (
              <div
                key={item.id}
                className="reveal-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                <NotificationItemCard
                  item={item}
                  onMarkRead={handleMarkRead}
                  onRemove={handleRemove}
                  isRemoving={removingIds.includes(item.id)}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-6 flex justify-center">
              <StandardPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
