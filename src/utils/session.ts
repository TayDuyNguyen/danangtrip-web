import { STORAGE_KEYS } from "./constants";

/**
 * Get the current session ID or generate a new one if it doesn't exist
 */
export const getOrCreateSessionId = (): string => {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem(STORAGE_KEYS.SEARCH_SESSION_ID);

  if (!sessionId) {
    sessionId = `sess_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    localStorage.setItem(STORAGE_KEYS.SEARCH_SESSION_ID, sessionId);
  }

  return sessionId;
};

/**
 * Regenerate a new session ID if needed (e.g., after long inactivity or manual reset)
 */
export const resetSessionId = (): string => {
  if (typeof window === "undefined") return "";
  
  const sessionId = `sess_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
  localStorage.setItem(STORAGE_KEYS.SEARCH_SESSION_ID, sessionId);
  return sessionId;
};
