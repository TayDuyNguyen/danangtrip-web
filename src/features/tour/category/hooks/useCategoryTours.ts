import { useQuery } from "@tanstack/react-query";
import { tourService } from "@/services/tour.service";
import type { TourFilterParams } from "../../types";
import { tourMapper } from "../../utils/tour-mapper";

export const useCategoryTours = (slug: string, params: TourFilterParams) => {
  return useQuery({
    queryKey: ["tour", "category", slug, params],
    queryFn: async () => {
      const response = await tourService.getByCategorySlug(slug, params);
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
    enabled: !!slug,
  });
};
