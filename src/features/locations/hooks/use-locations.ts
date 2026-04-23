import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { locationService } from "@/services/location.service";
import { LocationQueryParams, mapLocationQueryParams } from "../utils/location-query-mapper";

export const useLocations = (params: LocationQueryParams) => {
  const backendParams = useMemo(() => mapLocationQueryParams(params), [params]);

  const { data, isLoading, error, isPlaceholderData } = useQuery({
    queryKey: ["locations", "list", backendParams],
    queryFn: async () => {
      const response = await locationService.getAll(backendParams);
      return response.data; // This is PaginatedResponse<Location>
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return useMemo(() => {
    const paginator = data; // data is the PaginatedResponse object from interceptor
    
    return {
      locations: paginator?.data || [],
      pagination: {
        total: paginator?.total || 0,
        currentPage: paginator?.current_page || 1,
        lastPage: paginator?.last_page || 1,
        perPage: paginator?.per_page || 10,
      },
      isLoading,
      error,
      isPlaceholderData,
    };
  }, [data, isLoading, error, isPlaceholderData]);
};

export const useLocationCategories = () => {
  return useQuery({
    queryKey: ["locations", "categories"],
    queryFn: async () => {
      const response = await locationService.getCategories();
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
