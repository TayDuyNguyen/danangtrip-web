import { BlogPost } from "@/types";

export interface BlogFilterParams {
  page?: number;
  per_page?: number;
  category_id?: number | string;
  search?: string;
  sort?: 'latest' | 'popular' | 'oldest';
  tag?: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  /** API Laravel withCount('posts') → `posts_count` */
  posts_count?: number;
  post_count: number;
}

export interface BlogSidebarData {
  categories: BlogCategory[];
  popular_posts: BlogPost[];
  tags: string[];
}

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}
