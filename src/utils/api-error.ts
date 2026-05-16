import type { ApiResponse } from "@/types";

const ERROR_KEY_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    "validation.failed": "Please check the information you entered and try again.",
    "auth.invalid_credentials": "The email or password you entered is incorrect.",
    "auth.session_expired": "Your session has expired. Please sign in again.",
    "auth.unauthenticated": "Please sign in to continue.",
    "auth.forbidden": "You do not have permission to perform this action.",
    "resource.not_found": "The requested information could not be found.",
    "request.method_not_allowed": "This action is not supported.",
    "request.throttled": "You are doing this too quickly. Please wait a moment and try again.",
    "request.already_processed": "This request has already been processed.",
    "request.conflict": "This information already exists in the system.",
    "request.invalid_state": "This action cannot be completed right now.",
    "request.bad_request": "The request could not be completed. Please review your information and try again.",
    "request.unknown": "The request could not be completed at this time.",
    "server.error": "The system is temporarily busy. Please try again later.",
  },
  vi: {
    "validation.failed": "Vui lòng kiểm tra lại thông tin đã nhập và thử lại.",
    "auth.invalid_credentials": "Email hoặc mật khẩu bạn nhập không đúng.",
    "auth.session_expired": "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
    "auth.unauthenticated": "Vui lòng đăng nhập để tiếp tục.",
    "auth.forbidden": "Bạn không có quyền thực hiện hành động này.",
    "resource.not_found": "Không tìm thấy thông tin bạn yêu cầu.",
    "request.method_not_allowed": "Hành động này không được hỗ trợ.",
    "request.throttled": "Bạn thao tác quá nhanh. Vui lòng đợi ít phút rồi thử lại.",
    "request.already_processed": "Yêu cầu này đã được xử lý trước đó.",
    "request.conflict": "Thông tin này đã tồn tại trong hệ thống.",
    "request.invalid_state": "Không thể hoàn tất hành động này vào lúc này.",
    "request.bad_request": "Không thể xử lý yêu cầu. Vui lòng kiểm tra lại thông tin và thử lại.",
    "request.unknown": "Không thể hoàn tất yêu cầu lúc này.",
    "server.error": "Hệ thống đang bận. Vui lòng thử lại sau.",
  },
};

const MESSAGE_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    "Booking not found.": "Booking not found.",
    "Booking not found": "Booking not found.",
    "This booking has already been paid": "This booking has already been paid.",
    "Booking is already cancelled or completed.": "This booking has already been cancelled or completed.",
    "Tour schedule not found.": "Tour schedule not found.",
    "Tour schedule not found": "Tour schedule not found.",
    "Tour not found": "Tour not found.",
    "Location not found": "Location not found.",
    "This item is already in your favorites.": "This item is already in your favorites.",
    "Favorite record not found.": "Favorite not found.",
    "Rating not found": "Rating not found.",
    "Email is already verified.": "Email is already verified.",
    "Contact not found.": "Contact not found.",
    "Blog post not found.": "Blog post not found.",
  },
  vi: {
    "Booking not found.": "Không tìm thấy đơn đặt.",
    "Booking not found": "Không tìm thấy đơn đặt.",
    "This booking has already been paid": "Đơn đặt này đã được thanh toán.",
    "Booking is already cancelled or completed.": "Đơn đặt đã bị hủy hoặc đã hoàn thành.",
    "Tour schedule not found.": "Không tìm thấy lịch khởi hành.",
    "Tour schedule not found": "Không tìm thấy lịch khởi hành.",
    "Tour not found": "Không tìm thấy tour.",
    "Location not found": "Không tìm thấy địa điểm.",
    "This item is already in your favorites.": "Mục này đã có trong danh sách yêu thích.",
    "Favorite record not found.": "Không tìm thấy mục yêu thích.",
    "Rating not found": "Không tìm thấy đánh giá.",
    "Email is already verified.": "Email đã được xác minh.",
    "Contact not found.": "Không tìm thấy liên hệ.",
    "Blog post not found.": "Không tìm thấy bài viết.",
  },
};

function getLocale(): "vi" | "en" {
  if (typeof window !== "undefined") {
    return window.location.pathname.startsWith("/en") ? "en" : "vi";
  }
  return "vi";
}

function normalizeBilingualMessage(message: string): string {
  const trimmed = message.trim();
  const match = trimmed.match(/^(.*?)\s*\((.*?)\)\s*$/);
  if (!match) return trimmed;
  const locale = getLocale();
  return locale === "vi" ? match[2].trim() : match[1].trim();
}

function translateByErrorKey(errorKey?: string): string | undefined {
  if (!errorKey) return undefined;
  const locale = getLocale();
  return ERROR_KEY_TRANSLATIONS[locale]?.[errorKey];
}

function translateByMessage(message?: string): string | undefined {
  if (!message) return undefined;
  const locale = getLocale();
  return MESSAGE_TRANSLATIONS[locale]?.[message.trim()];
}

export function getFirstApiValidationError(
  errors?: Record<string, string[] | string | undefined>
): string | undefined {
  if (!errors) {
    return undefined;
  }

  for (const value of Object.values(errors)) {
    if (Array.isArray(value) && value.length > 0 && value[0]) {
      return normalizeBilingualMessage(value[0]);
    }

    if (typeof value === "string" && value.trim()) {
      return normalizeBilingualMessage(value);
    }
  }

  return undefined;
}

export function getApiErrorMessage(error: unknown, fallback?: string): string {
  const apiError = error as ApiResponse | undefined;

  const validationError = getFirstApiValidationError(apiError?.errors);
  if (validationError) return validationError;

  const byErrorKey = translateByErrorKey(apiError?.error_key);
  if (byErrorKey) return byErrorKey;

  const byMessage =
    translateByMessage(apiError?.message) ||
    translateByMessage(apiError?.user_message);
  if (byMessage) return byMessage;

  if (apiError?.user_message) {
    return normalizeBilingualMessage(apiError.user_message);
  }

  if (apiError?.message) {
    return normalizeBilingualMessage(apiError.message);
  }

  return apiError?.error || fallback || "An error occurred";
}
