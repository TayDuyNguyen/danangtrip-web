"use client";

import { useQuery } from "@tanstack/react-query";
import { weatherService } from "@/services/weather.service";
import type { Weather } from "@/types";

/**
 * Enhanced useWeather hook using TanStack Query.
 * Strict Mode: No mock fallback data allowed.
 */
export const useWeather = () => {
  const query = useQuery({
    queryKey: ["home", "weather"],
    queryFn: async () => {
      const res = await weatherService.getWeather();
      if (res.success && res.data) return res.data;
      throw new Error(res.message || "Failed to fetch weather");
    },
    staleTime: 15 * 60 * 1000, 
    retry: 1,
  });

  const weather: Weather | null = query.data || null;

  return {
    weather,
    isLoading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refresh: () => query.refetch(),
  };
};
