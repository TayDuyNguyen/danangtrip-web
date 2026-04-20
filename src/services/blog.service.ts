import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { BlogPost, PaginatedResponse, ApiResponse } from "@/types";

export const blogService = {
  getLatest: (page: number = 1, perPage: number = 3): Promise<ApiResponse<PaginatedResponse<BlogPost>>> =>
    axiosInstance.get(API_ENDPOINTS.BLOG.LIST, { 
      params: { 
        page, 
        per_page: perPage 
      } 
    }),

  getDetail: (slug: string): Promise<ApiResponse<BlogPost>> =>
    axiosInstance.get(API_ENDPOINTS.BLOG.DETAIL(slug)),
};
