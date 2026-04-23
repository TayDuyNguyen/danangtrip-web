"use client";

import { useQuery } from "@tanstack/react-query";
import { tourService } from "@/services/tour.service";
import { locationService } from "@/services/location.service";
import { extractItems } from "@/utils";
import type { Category } from "@/types";

export function useSearchFilterCategories(
  searchType: "all" | "tour" | "location",
  isOpen: boolean
) {
  return useQuery({
    queryKey: ["search", "filter-categories", searchType],
    queryFn: async () => {
      if (searchType === "location") {
        const res = await locationService.getCategories();
        const list = extractItems<Category>(res.data);
        return list.map((c) => ({ id: c.id, name: c.name }));
      }
      const res = await tourService.getCategories();
      const list = extractItems<Category>(res.data);
      return list.map((c) => ({ id: c.id, name: c.name }));
    },
    enabled: isOpen,
    staleTime: 1000 * 60 * 10,
  });
}
