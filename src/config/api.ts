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
    DETAIL: (id: string) => `/tours/${id}`,
    BOOKING: "/tours/booking",
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/update-profile",
    CHANGE_PASSWORD: "/user/change-password",
  },
};
