import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { BlogPost, PaginatedResponse, ApiResponse } from "@/types";
import type { BlogFilterParams, BlogSidebarData, BlogCategory } from "@/features/blog/types";

type Unwrapped<T> = { success?: boolean; data?: T; message?: string };

function unwrapData<T>(result: Unwrapped<T>): T | undefined {
  return result?.data as T | undefined;
}

export const blogService = {
  getLatest: (params: BlogFilterParams): Promise<ApiResponse<PaginatedResponse<BlogPost>>> =>
    axiosInstance.get(API_ENDPOINTS.BLOG.LIST, {
      params,
    }),

  getDetail: (slug: string): Promise<ApiResponse<BlogPost>> =>
    axiosInstance.get(API_ENDPOINTS.BLOG.DETAIL(slug)),

  /**
   * Sidebar: GET /blog/categories + GET /blog (5 bài cho khối phổ biến).
   * Tags: backend chưa có API — trả mảng rỗng (xem user_blog_list.md).
   */
  getSidebarData: async (): Promise<ApiResponse<BlogSidebarData>> => {
    const [catResult, listResult] = await Promise.all([
      axiosInstance.get(API_ENDPOINTS.BLOG.CATEGORIES),
      axiosInstance.get(API_ENDPOINTS.BLOG.LIST, {
        params: { page: 1, per_page: 5, sort: "popular" },
      }),
    ]);

    const rawCats = unwrapData<BlogCategory[]>(catResult as Unwrapped<BlogCategory[]>) ?? [];
    const paginator = unwrapData<PaginatedResponse<BlogPost>>(
      listResult as Unwrapped<PaginatedResponse<BlogPost>>,
    );

    const categories: BlogCategory[] = rawCats.map((c) => ({
      ...c,
      post_count: c.post_count ?? c.posts_count ?? 0,
    }));

    const popular_posts = paginator?.data ?? [];

    return {
      success: true,
      data: {
        categories,
        popular_posts,
        tags: [],
      },
      message: "Success",
    };
  },
};
