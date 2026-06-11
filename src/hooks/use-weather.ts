"use client";

import { useQuery } from "@tanstack/react-query";
import { weatherService } from "@/services/weather.service";
import type { Weather } from "@/types";
import { getApiErrorMessage } from "@/utils";

/**
 * Shared weather query (deduped via TanStack Query). No mock fallback.
 */
export const useWeather = () => {
  const query = useQuery({
    queryKey: ["home", "weather"],
    queryFn: async () => {
      const res = await weatherService.getWeather();
      if (res.success && res.data) {
        return res.data;
      }
      throw res;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const weather: Weather | null = query.data ?? null;

  return {
    weather,
    isLoading: query.isLoading,
    error: query.error
      ? getApiErrorMessage(query.error, "Weather load failed")
      : null,
    refresh: () => query.refetch(),
  };
};
