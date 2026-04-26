import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { TourFilterParams } from "../types";

export const useTourFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const params: TourFilterParams = {};
    
    const search = searchParams.get("search");
    if (search) params.search = search;

    const catId = searchParams.get("tour_category_id");
    if (catId) params.tour_category_id = Number(catId);

    const priceMin = searchParams.get("price_min");
    if (priceMin) params.price_min = Number(priceMin);

    const priceMax = searchParams.get("price_max");
    if (priceMax) params.price_max = Number(priceMax);

    const duration = searchParams.get("duration");
    if (duration) params.duration = duration;

    const from = searchParams.get("available_from");
    if (from) params.available_from = from;

    const to = searchParams.get("available_to");
    if (to) params.available_to = to;

    const sortBy = searchParams.get("sort_by");
    if (sortBy) params.sort_by = sortBy;

    const sortOrder = searchParams.get("sort_order");
    if (sortOrder === "asc" || sortOrder === "desc") params.sort_order = sortOrder;

    return params;
  }, [searchParams]);

  const setFilters = useCallback((newFilters: Partial<TourFilterParams>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.delete(key);
        value.forEach(v => params.append(key, v));
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    filters,
    setFilters,
    clearFilters
  };
};
