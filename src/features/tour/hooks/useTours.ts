import { useQuery } from "@tanstack/react-query";
import { tourService } from "@/services/tour.service";
import { TourFilterParams } from "../types";

export const useTours = (params: TourFilterParams) => {
  return useQuery({
    queryKey: ["tour", "list", params],
    queryFn: () => tourService.getAll(params),
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
