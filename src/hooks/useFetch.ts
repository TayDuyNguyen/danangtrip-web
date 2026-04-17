"use client";

import { useState, useEffect, useCallback } from "react";
import type { ApiResponse } from "@/types";

interface UseFetchOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseFetchReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (...args: unknown[]) => Promise<ApiResponse<T>>;
  refetch: () => Promise<ApiResponse<T>>;
}

// Internal type: fetchFn needs any[] to accept arbitrary function signatures
type FetchFn<T> = (...args: unknown[]) => Promise<ApiResponse<T>>;

export function useFetch<T>(
  fetchFn: FetchFn<T>,
  options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
  const { immediate = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storedArgs, setStoredArgs] = useState<unknown[]>([]);

  const execute = useCallback(
    async (...newArgs: unknown[]): Promise<ApiResponse<T>> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchFn(...newArgs);

        if (response.success && response.data !== undefined) {
          setData(response.data as T);
          onSuccess?.(response.data as T);
        } else {
          setError(response.error || "An error occurred");
          onError?.(response.error || "An error occurred");
        }

        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(message);
        onError?.(message);
        return { success: false, error: message };
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFn, onSuccess, onError]
  );

  const refetch = useCallback(async () => {
    return execute(...storedArgs);
  }, [execute, storedArgs]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    isLoading,
    error,
    execute: (...newArgs: unknown[]) => {
      setStoredArgs(newArgs);
      return execute(...newArgs);
    },
    refetch,
  };
}

export function useLazyFetch<T>(
  fetchFn: FetchFn<T>,
  options: Omit<UseFetchOptions<T>, "immediate"> = {}
): UseFetchReturn<T> {
  return useFetch(fetchFn, { ...options, immediate: false });
}
