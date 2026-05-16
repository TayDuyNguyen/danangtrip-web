import { useQuery } from "@tanstack/react-query";
import { tourService } from "@/services/tour.service";
import { TourFilterParams } from "../types";
import { tourMapper } from "../utils/tour-mapper";

export const useTours = (params: TourFilterParams) => {
  return useQuery({
    queryKey: ["tour", "list", params],
    queryFn: async () => {
      const response = await tourService.getAll(params);
      if (response.data?.data) {
        return {
          ...response,
          data: {
            ...response.data,
            data: tourMapper.mapTours(response.data.data),
          },
        };
      }
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useTourCategories = () => {
  return useQuery({
    queryKey: ["tour", "categories"],
    queryFn: () => tourService.getCategories(),
    staleTime: 30 * 60 * 1000,
  });
};
