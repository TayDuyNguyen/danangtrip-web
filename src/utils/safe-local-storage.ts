/**
 * A localStorage wrapper that prevents SyntaxError crashes from corrupted storage entries.
 * Zustand's persist middleware calls JSON.parse internally without try-catch on the raw
 * localStorage value. If the stored string is empty, truncated, or otherwise malformed,
 * JSON.parse throws "Unexpected end of JSON input" which crashes the React tree.
 *
 * This wrapper validates that the stored value is parseable JSON before returning it.
 * If it's corrupted, it auto-removes the key and returns null (fresh state).
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      // Validate that the raw string is valid JSON before returning
      JSON.parse(raw);
      return raw;
    } catch (e) {
      console.error(
        `[Zustand Persist] Found corrupted localStorage key "${key}", removing.`,
        e
      );
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore removal errors (e.g. storage full edge cases)
      }
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error(
        `[Zustand Persist] Failed to set localStorage key "${key}".`,
        e
      );
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore removal errors
    }
  },
};
