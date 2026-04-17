/**
 * Application routes configuration
 */

// Public routes - Active
export const PUBLIC_ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  TOURS: "/tours",
} as const;

// Public routes - Planned (Pages not yet created)
export const PLANNED_ROUTES = {
  CONTACT: "/contact",
  TERMS: "/terms",
  PRIVACY: "/privacy",
  DESTINATIONS: "/destinations",
  DINING: "/dining",
  HOTELS: "/hotels",
  BLOG: "/blog",
  PARTNERS_REGISTER: "/partners/register",
  PARTNERS_ADS: "/partners/ads",
  SUPPORT: "/support",
  NEWS: "/news",
  SITEMAP: "/sitemap",
  HELP: "/help",
} as const;

// Auth routes
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
} as const;

// Protected routes (require authentication)
export const PROTECTED_ROUTES = {
  PROFILE: "/profile",
  SETTINGS: "/settings",
} as const;

// Dashboard routes (require authentication + admin/staff role)
export const DASHBOARD_ROUTES = {
  DASHBOARD: "/dashboard",
  USERS: "/dashboard/users",
  USER_DETAIL: (id: string) => `/dashboard/users/${id}`,
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
} as const;

// Legacy compatibility object
export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...PLANNED_ROUTES, // Still included for type safety and config, but UI will hide these
  ...AUTH_ROUTES,
  ...PROTECTED_ROUTES,
  DASHBOARD: DASHBOARD_ROUTES.DASHBOARD,
} as const;

// Navigation links for Header - ONLY ACTIVE ROUTES
export const NAV_LINKS = [
  { name: "Trang chủ", path: PUBLIC_ROUTES.HOME },
  { name: "Tour du lịch", path: PUBLIC_ROUTES.TOURS },
  { name: "Về chúng tôi", path: PUBLIC_ROUTES.ABOUT },
];

// Quick links for Footer - ONLY ACTIVE ROUTES
export const QUICK_LINKS = [
  { name: "Về chúng tôi", path: PUBLIC_ROUTES.ABOUT },
  { name: "Tour du lịch", path: PUBLIC_ROUTES.TOURS },
];

// Route helpers
export const isPublicRoute = (path: string): boolean => {
  return [...Object.values(PUBLIC_ROUTES), ...Object.values(PLANNED_ROUTES)].some((route) => 
    typeof route === "string" ? route === path : false
  );
};

export const isAuthRoute = (path: string): boolean => {
  return Object.values(AUTH_ROUTES).some((route) => 
    typeof route === "string" ? route === path : false
  );
};

export const isProtectedRoute = (path: string): boolean => {
  return Object.values(PROTECTED_ROUTES).some((route) => 
    typeof route === "string" ? path.startsWith(route) : false
  );
};

export const isDashboardRoute = (path: string): boolean => {
  return path.startsWith("/dashboard");
};

