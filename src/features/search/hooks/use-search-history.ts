"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";

/**
 * Hook to manage search history stored in local storage.
 * Segregates history by user ID if logged in, or defaults to guest.
 */
export function useSearchHistory() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id || "guest";
  const storageKey = `danangtrip_search_history:${userId}`;

  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          setHistory(JSON.parse(stored));
        } else {
          setHistory([]);
        }
      } catch {
        setHistory([]);
      }
    }
  }, [storageKey]);

  // Add a query to search history (max 5 unique items, most recent first)
  const addHistory = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      setHistory((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
        const updated = [trimmed, ...filtered].slice(0, 5);
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    },
    [storageKey]
  );

  // Remove a query from search history
  const removeHistory = useCallback(
    (query: string) => {
      setHistory((prev) => {
        const updated = prev.filter((item) => item !== query);
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    },
    [storageKey]
  );

  // Clear all search history
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }, [storageKey]);

  return {
    history,
    addHistory,
    removeHistory,
    clearHistory
  };
}
