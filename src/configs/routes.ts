/**
 * Application routes configuration
 */

// Public routes
export const PUBLIC_ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  TOURS: "/tours",
  TOUR_DETAIL: (id: string) => `/tours/${id}`,
  CONTACT: "/contact",
  BLOG: "/blog",
  BLOG_DETAIL: (slug: string) => `/blog/${slug}`,
  FAQ: "/faq",
} as const;

// Auth routes
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
} as const;

// Protected routes (require authentication)
export const PROTECTED_ROUTES = {
  PROFILE: "/profile",
  SETTINGS: "/settings",
  BOOKINGS: "/bookings",
  BOOKING_DETAIL: (id: string) => `/bookings/${id}`,
  FAVORITES: "/favorites",
  REVIEWS: "/reviews",
  PAYMENTS: "/payments",
} as const;

// Dashboard routes (require authentication + admin/staff role)
export const DASHBOARD_ROUTES = {
  DASHBOARD: "/dashboard",
  USERS: "/dashboard/users",
  USER_DETAIL: (id: string) => `/dashboard/users/${id}`,
  TOURS: "/dashboard/tours",
  TOUR_CREATE: "/dashboard/tours/create",
  TOUR_EDIT: (id: string) => `/dashboard/tours/${id}/edit`,
  BOOKINGS: "/dashboard/bookings",
  BOOKING_DETAIL: (id: string) => `/dashboard/bookings/${id}`,
  REVIEWS: "/dashboard/reviews",
  PAYMENTS: "/dashboard/payments",
  STATISTICS: "/dashboard/statistics",
  SETTINGS: "/dashboard/settings",
} as const;

// API routes
export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
    REFRESH: "/api/auth/refresh",
  },
  USERS: {
    BASE: "/api/users",
    BY_ID: (id: string) => `/api/users/${id}`,
    AVATAR: (id: string) => `/api/users/${id}/avatar`,
  },
  TOURS: {
    BASE: "/api/tours",
    BY_ID: (id: string) => `/api/tours/${id}`,
    REVIEWS: (id: string) => `/api/tours/${id}/reviews`,
  },
  BOOKINGS: {
    BASE: "/api/bookings",
    BY_ID: (id: string) => `/api/bookings/${id}`,
    CANCEL: (id: string) => `/api/bookings/${id}/cancel`,
  },
} as const;

// Route helpers
export const isPublicRoute = (path: string): boolean => {
  return Object.values(PUBLIC_ROUTES).some((route) => 
    typeof route === "string" ? route === path : false
  ) || path.startsWith("/tours/") || path.startsWith("/blog/");
};

export const isAuthRoute = (path: string): boolean => {
  return Object.values(AUTH_ROUTES).some((route) => 
    typeof route === "string" ? route === path : false
  );
};

export const isProtectedRoute = (path: string): boolean => {
  return Object.values(PROTECTED_ROUTES).some((route) => 
    typeof route === "string" ? path.startsWith(route) : false
  ) || path.startsWith("/bookings/");
};

export const isDashboardRoute = (path: string): boolean => {
  return path.startsWith("/dashboard");
};
