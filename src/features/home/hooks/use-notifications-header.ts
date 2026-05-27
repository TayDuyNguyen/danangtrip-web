"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import { useAuthStore } from "@/store/auth.store";
import { shouldRetryQuery } from "@/lib/react-query";
import type { Notification } from "@/types";

/**
 * Custom hook to manage Header notification state and actions.
 * Fetches unread counts and recent 5 notifications when authenticated.
 */
export const useNotificationsHeader = () => {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  // 1. Unread Count Query
  const unreadCountQuery = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const res = await notificationService.unreadCount();
      return res?.data?.unread_count ?? 0;
    },
    enabled: isAuthenticated,
    staleTime: 60 * 1000, // 1 minute
    retry: shouldRetryQuery,
  });

  // 2. Recent List Query (latest 5)
  const listQuery = useQuery({
    queryKey: ["notifications", "recent"],
    queryFn: async () => {
      const res = await notificationService.list({ per_page: 5 });
      return res?.data?.data ?? [];
    },
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
    retry: shouldRetryQuery,
  });

  // 3. Mark All as Read Mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return notificationService.markAllAsRead();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // 4. Mark Single as Read Mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number | string) => {
      return notificationService.markAsRead(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unreadCount = unreadCountQuery.data ?? 0;
  const notifications: Notification[] = listQuery.data ?? [];
  const isLoading = unreadCountQuery.isLoading || listQuery.isLoading;

  return {
    unreadCount,
    notifications,
    isLoading,
    markAllAsRead: () => markAllAsReadMutation.mutateAsync(),
    markAsRead: (id: number | string) => markAsReadMutation.mutateAsync(id),
    refresh: () => {
      void unreadCountQuery.refetch();
      void listQuery.refetch();
    },
  };
};
