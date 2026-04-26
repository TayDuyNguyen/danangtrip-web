const STORAGE_KEY = "dnt_browse_sid";

export function getOrCreateBrowseSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) {
      return existing;
    }
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return `${Date.now()}`;
  }
}
