export interface Statistics {
  total_users: number;
  total_locations: number;
  total_tours: number;
  total_ratings: number;
  total_views: number;
  total_blog_posts: number;
}

export interface SubCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  image: string | null;
  sort_order: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  subcategories: SubCategory[];
}

export interface Location {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  subcategory_id: number | null;
  description: string;
  short_description: string;
  address: string;
  district: string;
  ward: string | null;
  latitude: string;
  longitude: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  opening_hours: string | null;
  price_min: number | null;
  price_max: number | null;
  price_level: number | null;  // 1-4
  thumbnail: string | null;
  images: string[] | null;
  video_url: string | null;
  status: 'active' | 'inactive';
  is_featured: boolean;
  view_count: number;
  favorite_count: number;
  avg_rating: string;   // parse: parseFloat(avg_rating)
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface TourCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sort_order: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Tour {
  id: number;
  name: string;
  slug: string;
  tour_category_id: number;
  description: string;
  short_desc: string | null;
  itinerary: Array<{time: string; activity: string}> | null;
  inclusions: string | null;
  exclusions: string | null;
  price_adult: string;    // parse: parseFloat(price_adult)
  price_child: string;
  price_infant: string;
  discount_percent: number;
  duration: string;
  start_time: string | null;
  meeting_point: string | null;
  max_people: number;
  min_people: number;
  available_from: string | null;
  available_to: string | null;
  thumbnail: string | null;
  images: string[] | null;
  video_url: string | null;
  location_ids: number[] | null;
  status: 'active' | 'inactive' | 'sold_out';
  is_featured: boolean;
  is_hot: boolean;
  view_count: number;
  booking_count: number;
  avg_rating: string;
  review_count: number;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author_id: number;
  view_count: number;
  status: 'published' | 'draft' | 'archived';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author: { id: number; username: string; full_name: string; avatar: string | null; };
  categories: Array<{ id: number; name: string; slug: string; }>;
}

export interface Weather {
  temp: number;
  condition: string;
  icon: string;
}

export interface Config {
  hotline: string;
  email: string;
  address: string;
  social_links?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
}
