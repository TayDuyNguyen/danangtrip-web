import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { Statistics, Category, Location, TourCategory, Tour, BlogPost, ApiResponse } from "@/types";

export interface ApiConfigData {
  general?: {
    hotline?: string;
    email?: string;
    address?: string;
  };
  social?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    website?: string;
  };
  payment?: {
    sepay?: boolean;
    payos?: boolean;
    cod?: boolean;
    vnpay?: boolean;
    momo?: boolean;
    zalopay?: boolean;
  };
  brand?: {
    website_name?: string;
    logo?: string;
    favicon?: string;
  };
  policy?: {
    terms?: string;
    privacy?: string;
    data_protection?: string;
  };
}

export interface HomeUnifiedData {
  statistics: Statistics | null;
  categories: Category[];
  featured_locations: Location[];
  tour_categories: TourCategory[];
  featured_tours: Tour[];
  hot_tours: Tour[];
  latest_blogs: {
    data: BlogPost[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  } | null;
  config: ApiConfigData | null;
}

export interface HomeLocationsData {
  categories: Category[];
  featured_locations: Location[];
}

export interface HomeToursData {
  tour_categories: TourCategory[];
  featured_tours: Tour[];
  hot_tours: Tour[];
}

export interface HomeBlogsData {
  latest_blogs: {
    data: BlogPost[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  } | null;
}

export const homeService = {
  getHomeData: (): Promise<ApiResponse<HomeUnifiedData>> =>
    axiosInstance.get(API_ENDPOINTS.HOME),

  getHomeLocations: (): Promise<ApiResponse<HomeLocationsData>> =>
    axiosInstance.get(API_ENDPOINTS.HOME_LOCATIONS),

  getHomeTours: (): Promise<ApiResponse<HomeToursData>> =>
    axiosInstance.get(API_ENDPOINTS.HOME_TOURS),

  getHomeBlogs: (): Promise<ApiResponse<HomeBlogsData>> =>
    axiosInstance.get(API_ENDPOINTS.HOME_BLOGS),
};
