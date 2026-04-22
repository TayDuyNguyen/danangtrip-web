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
  SEARCH_SESSION_ID: "search_session_id",
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
  REQUIRED: "error.required",
  INVALID_EMAIL: "error.invalid_email",
  INVALID_PHONE: "error.invalid_phone",
  INVALID_PASSWORD: "error.invalid_password",
  MIN_LENGTH: "error.min_length",
  MAX_LENGTH: "error.max_length",
  FILE_TOO_LARGE: "error.file_too_large",
  INVALID_FILE_TYPE: "error.invalid_file_type",
  NETWORK_ERROR: "error.network_error",
  SERVER_ERROR: "error.server_error",
  UNAUTHORIZED: "error.unauthorized",
  FORBIDDEN: "error.forbidden",
  URL_INVALID: "error.url_invalid",
  PASSWORD_MISMATCH: "error.password_mismatch",
  RANGE_ERROR: "error.range_error",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "success.login",
  REGISTER_SUCCESS: "success.register",
  LOGOUT_SUCCESS: "success.logout",
  UPDATE_SUCCESS: "success.update",
  DELETE_SUCCESS: "success.delete",
  CREATE_SUCCESS: "success.create",
  BOOKING_SUCCESS: "success.booking",
  PAYMENT_SUCCESS: "success.payment",
} as const;
