import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import type { NotificationListParams } from "@/types";

export function useNotificationsQuery(params?: NotificationListParams) {
  return useQuery({
    queryKey: ["notifications", "list", params],
    queryFn: () => notificationService.list(params).then((res) => res.data),
    staleTime: 30 * 1000, // 30 seconds cache stability
  });
}

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationService.unreadCount().then((res) => res.data),
    staleTime: 10 * 1000, // 10 seconds cache stability
  });
}
