import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/services/blog.service";
import type { BlogFilterParams } from "../types";

/**
 * Hook: useBlogDetail
 * Hierarchical key: ["blog", "post", slug]
 */
export function useBlogDetail(slug: string) {
  return useQuery({
    queryKey: ["blog", "post", slug],
    queryFn: () => blogService.getDetail(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook: useBlogSidebar (Popular posts, categories)
 * Hierarchical key: ["blog", "sidebar"]
 */
export function useBlogSidebar() {
  return useQuery({
    queryKey: ["blog", "sidebar"],
    queryFn: () => blogService.getSidebarData(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook: useRelatedPosts
 * Hierarchical key: ["blog", "list", "related", categoryId]
 */
export function useRelatedPosts(params: BlogFilterParams) {
  return useQuery({
    queryKey: ["blog", "list", "related", params.category_id],
    queryFn: () => blogService.getLatest(params),
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!params.category_id,
  });
}
