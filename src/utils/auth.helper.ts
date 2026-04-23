/**
 * Auth helper utilities ported from source project
 */

import Cookies from "js-cookie";

export const ACCESS_TOKEN_KEY = "token";

export const parseJwtPayload = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload) as { exp?: number };
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const payload = parseJwtPayload(token);
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

export const getTokenExpiryMs = (token: string | null): number => {
  if (!token) return 0;
  try {
    const payload = parseJwtPayload(token);
    if (!payload?.exp) return 0;
    return payload.exp * 1000 - Date.now();
  } catch {
    return 0;
  }
};

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return Cookies.get(ACCESS_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string) => {
  if (typeof window === "undefined") return;
  Cookies.set(ACCESS_TOKEN_KEY, token, { expires: 7, path: "/" });
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearTokens = () => {
  if (typeof window === "undefined") return;
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const getLanguage = () => {
  if (typeof window === "undefined") return "vi";
  return localStorage.getItem("locale") || "vi";
};
