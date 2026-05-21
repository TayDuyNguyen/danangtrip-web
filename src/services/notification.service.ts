import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  Notification,
  NotificationListParams,
  NotificationListResponse,
  NotificationUnreadCount,
} from "@/types";

export const notificationService = {
  list: (params?: NotificationListParams): Promise<ApiResponse<NotificationListResponse>> =>
    axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS.LIST, { params }),

  unreadCount: (): Promise<ApiResponse<NotificationUnreadCount>> =>
    axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT),

  markAsRead: (id: number | string): Promise<ApiResponse<Notification>> =>
    axiosInstance.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)),

  markAllAsRead: (): Promise<ApiResponse<unknown>> =>
    axiosInstance.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ),

  remove: (id: number | string): Promise<ApiResponse<unknown>> =>
    axiosInstance.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id)),
};
