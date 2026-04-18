export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    ME: "/auth/me",
  },
  TOURS: {
    LIST: "/tours",
    FEATURED: "/tours/featured",
    HOT: "/tours/hot",
    DETAIL: (id: string) => `/tours/${id}`,
    BOOKING: "/tours/booking",
    CATEGORIES: "/tour-categories",
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/update-profile",
    CHANGE_PASSWORD: "/user/change-password",
    FAVORITES: "/user/favorites",
  },
  LOCATIONS: {
    LIST: "/locations",
    FEATURED: "/locations/featured",
    DETAIL: (slug: string) => `/locations/${slug}`,
    CATEGORIES: "/categories",
  },
  WEATHER: "/weather",
  STATISTICS: "/statistics",
  BLOG: {
    LIST: "/blog",
    DETAIL: (slug: string) => `/blog/${slug}`,
  },
  CONFIG: "/config",
};
