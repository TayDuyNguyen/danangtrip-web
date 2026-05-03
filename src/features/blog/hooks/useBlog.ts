import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/services/blog.service";
import type { BlogFilterParams } from "../types";

export const useBlogPosts = (params: BlogFilterParams) => {
  return useQuery({
    queryKey: ["blog", "list", params],
    queryFn: async () => {
      const response = await blogService.getLatest(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useBlogSidebar = () => {
  return useQuery({
    queryKey: ["blog", "sidebar"],
    queryFn: async () => {
      const response = await blogService.getSidebarData();
      return response.data;
    },
    staleTime: 15 * 60 * 1000,
  });
};

export const useBlogDetail = (slug: string) => {
  return useQuery({
    queryKey: ["blog", "detail", slug],
    queryFn: async () => {
      const response = await blogService.getDetail(slug);
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!slug,
  });
};
