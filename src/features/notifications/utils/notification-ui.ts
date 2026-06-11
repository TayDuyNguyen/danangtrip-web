import { PROTECTED_ROUTES } from "@/config";
import type { Notification } from "@/types";

export const getNotificationContent = (notification: Notification): string =>
  notification.content || notification.message || "";

export const isNotificationUnread = (notification: Notification): boolean =>
  typeof notification.is_read === "boolean" ? !notification.is_read : !notification.read_at;

export const getNotificationTargetUrl = (notification: Notification): string | undefined => {
  const explicitUrl = notification.data?.url;
  if (typeof explicitUrl === "string" && explicitUrl.trim() !== "") {
    return explicitUrl;
  }

  const bookingCode = notification.data?.booking_code;

  switch (notification.type) {
    case "booking_payment_confirmed":
    case "booking_confirmed":
    case "booking_cancelled":
    case "booking_completed":
    case "payment_refunded":
    case "tour_start_reminder":
      return typeof bookingCode === "string" && bookingCode.trim() !== ""
        ? PROTECTED_ROUTES.BOOKING_BY_CODE(bookingCode)
        : PROTECTED_ROUTES.BOOKINGS;

    case "point_earned":
    case "point_voucher_redeemed":
      return PROTECTED_ROUTES.POINTS;

    case "rating_approved":
    case "rating_rejected":
      return PROTECTED_ROUTES.RATINGS;

    default:
      return undefined;
  }
};

export const getNotificationCategory = (type: string): "booking" | "rating" | "point" | "contact" | "promotion" | "system" => {
  if (type.includes("booking") || type.includes("payment") || type.includes("tour_start")) {
    return "booking";
  }

  if (type.includes("rating")) {
    return "rating";
  }

  if (type.includes("point") || type.includes("voucher")) {
    return "point";
  }

  if (type.includes("promotion")) {
    return "promotion";
  }

  if (type.includes("contact")) {
    return "contact";
  }

  return "system";
};
