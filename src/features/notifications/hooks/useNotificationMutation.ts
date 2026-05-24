import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";

export function useNotificationMutation() {
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: (id: number | string) =>
      notificationService.markAsRead(id).then((res) => res.data),
    onSuccess: () => {
      // Invalidate both notifications list and unread count queries to keep UI consistent
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () =>
      notificationService.markAllAsRead().then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const removeNotificationMutation = useMutation({
    mutationFn: (id: number | string) =>
      notificationService.remove(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    markAsRead: markAsReadMutation,
    markAllAsRead: markAllAsReadMutation,
    removeNotification: removeNotificationMutation,
  };
}
