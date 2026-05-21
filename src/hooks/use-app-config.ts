"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppConfig } from "@/services/config.service";
import type { Config } from "@/types";
import { shouldRetryQuery } from "@/lib/react-query";

export function useAppConfig() {
  return useQuery<Config | null>({
    queryKey: ["app", "config"],
    queryFn: async () => (await getAppConfig()) ?? null,
    staleTime: 30 * 60 * 1000,
    retry: shouldRetryQuery,
  });
}
