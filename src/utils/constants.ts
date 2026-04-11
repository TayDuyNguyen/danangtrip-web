/**
 * Application constants
 */

// App Information
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "DaNangTrip";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Timeouts
export const API_TIMEOUT = 30000; // 30 seconds
export const DEBOUNCE_DELAY = 300; // 300ms
export const TOAST_DURATION = 5000; // 5 seconds

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
  SIDEBAR_COLLAPSED: "sidebar_collapsed",
} as const;

// Cookie Keys
export const COOKIE_KEYS = {
  SESSION: "session",
  REFRESH_TOKEN: "refresh_token",
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  TOUR_GUIDE: "tour_guide",
  MANAGER: "manager",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Booking Status
export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

// Tour Types
export const TOUR_TYPES = {
  DAILY: "daily",
  PACKAGE: "package",
  PRIVATE: "private",
  GROUP: "group",
} as const;

export type TourType = (typeof TOUR_TYPES)[keyof typeof TOUR_TYPES];

// Regex Patterns
export const REGEX = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PHONE: /^(\+84|0)\d{9,10}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: "Trường này là bắt buộc",
  INVALID_EMAIL: "Email không hợp lệ",
  INVALID_PHONE: "Số điện thoại không hợp lệ",
  INVALID_PASSWORD: "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
  MIN_LENGTH: (min: number) => `Phải có ít nhất ${min} ký tự`,
  MAX_LENGTH: (max: number) => `Không được quá ${max} ký tự`,
  FILE_TOO_LARGE: `Kích thước file không được vượt quá ${MAX_FILE_SIZE / 1024 / 1024}MB`,
  INVALID_FILE_TYPE: "Định dạng file không hỗ trợ",
  NETWORK_ERROR: "Lỗi kết nối mạng. Vui lòng thử lại sau",
  SERVER_ERROR: "Lỗi máy chủ. Vui lòng thử lại sau",
  UNAUTHORIZED: "Bạn chưa đăng nhập hoặc phiên đã hết hạn",
  FORBIDDEN: "Bạn không có quyền truy cập",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Đăng nhập thành công",
  REGISTER_SUCCESS: "Đăng ký thành công",
  LOGOUT_SUCCESS: "Đăng xuất thành công",
  UPDATE_SUCCESS: "Cập nhật thành công",
  DELETE_SUCCESS: "Xóa thành công",
  CREATE_SUCCESS: "Tạo mới thành công",
  BOOKING_SUCCESS: "Đặt tour thành công",
  PAYMENT_SUCCESS: "Thanh toán thành công",
} as const;
