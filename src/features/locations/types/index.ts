export interface Location {
  id: string;
  name: string;
  slug: string;
  category: string;
  district: string;
  address: string;
  rating: number;
  reviewCount: number;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  images: string[];
  description: string;
  features: string[];
  isFeatured?: boolean;
}

export type LocationCategory = 'sightseeing' | 'food' | 'entertainment' | 'culture' | 'nature';
export type District = 'hai-chau' | 'thanh-khe' | 'son-tra' | 'ngu-hanh-son' | 'lien-chieu' | 'cam-le' | 'hoa-vang' | 'hoang-sa';
