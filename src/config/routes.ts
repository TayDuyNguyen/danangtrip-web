/**
 * Application routes configuration
 */

// Public routes - Active
export const PUBLIC_ROUTES = {
  HOME: "/",
  LOCATIONS: "/locations",
  LOCATION_DETAIL: (slug: string) => `/locations/${slug}`,
  TOURS: "/tours",
  BLOG: "/blog",
  CONTACT: "/contact",
  ABOUT: "/about",
  SEARCH: "/search",
} as const;

// Planned / future pages only — do not merge into ROUTES (see PROJECT_RULES §8).
export const PLANNED_ROUTES = {
  TERMS: "/terms",
  PRIVACY: "/privacy",
  DESTINATIONS: "/destinations",
  DINING: "/dining",
  HOTELS: "/hotels",
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

/** Active app paths only (public + auth + protected entry). Use PLANNED_ROUTES for placeholders. */
export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...AUTH_ROUTES,
  ...PROTECTED_ROUTES,
  DASHBOARD: DASHBOARD_ROUTES.DASHBOARD,
} as const;

// Navigation links for Header - ONLY ACTIVE ROUTES
export const NAV_LINKS = [
  { name: "nav.home", path: PUBLIC_ROUTES.HOME },
  { name: "nav.locations", path: PUBLIC_ROUTES.LOCATIONS },
  { name: "nav.travel", path: PUBLIC_ROUTES.TOURS },
  { name: "nav.blog", path: PUBLIC_ROUTES.BLOG },
  { name: "nav.contact", path: PUBLIC_ROUTES.CONTACT },
];

// Quick links for Footer - ONLY ACTIVE ROUTES
export const QUICK_LINKS = [
  { name: "nav.locations", path: PUBLIC_ROUTES.LOCATIONS },
  { name: "nav.travel", path: PUBLIC_ROUTES.TOURS },
  { name: "nav.blog", path: PUBLIC_ROUTES.BLOG },
  { name: "nav.contact", path: PUBLIC_ROUTES.CONTACT },
];

// Route helpers
export const isPublicRoute = (path: string): boolean => {
  return Object.values(PUBLIC_ROUTES).some((route) =>
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

