import type { PaginatedResponse } from "./api.types";

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationListParams {
  page?: number;
  per_page?: number;
  type?: string;
  read?: boolean;
}

export interface NotificationUnreadCount {
  unread_count: number;
}

export type NotificationListResponse = PaginatedResponse<Notification>;
