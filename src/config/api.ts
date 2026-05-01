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
    CATEGORIES: "/tour-categories",
    SCHEDULES: (id: number | string) => `/tours/${id}/schedules`,
    CHECK_AVAILABILITY: (id: number | string) => `/tours/${id}/check-availability`,
    RATINGS: (id: number | string) => `/tours/${id}/ratings`,
    RATING_STATS: (id: number | string) => `/tours/${id}/rating-stats`,
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/profile",
    CHANGE_PASSWORD: "/user/password",
    FAVORITES: "/user/favorites",
    FAVORITES_CHECK: "/user/favorites/check", // Use query params ?location_id= or ?tour_id=
  },
  LOCATIONS: {
    LIST: "/locations",
    FEATURED: "/locations/featured",
    DETAIL: (slug: string) => `/locations/${slug}`,
    CATEGORIES: "/categories",
    IMAGES: (id: number) => `/locations/${id}/images`,
    RATINGS: (id: number) => `/locations/${id}/ratings`,
    RATING_STATS: (id: number) => `/locations/${id}/rating-stats`,
    NEARBY_BY_ID: (id: number) => `/locations/${id}/nearby`,
    RECORD_VIEW: (id: number) => `/locations/${id}/view`,
  },
  RATINGS: {
    CHECK: "/ratings/check",
    STORE: "/ratings",
    HELPFUL: (id: number) => `/ratings/${id}/helpful`,
  },
  UPLOAD: {
    IMAGES: "/upload/images",
  },
  STATISTICS: "/statistics",
  BLOG: {
    LIST: "/blog",
    DETAIL: (slug: string) => `/blog/${slug}`,
  },
  SEARCH: {
    LIST: "/search",
    SUGGESTIONS: "/search/suggestions",
    POPULAR: "/search/popular",
    TRENDING: "/search/trending",
  },
};
