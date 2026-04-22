export interface LocationQueryParams {
  q?: string;
  categories?: number[];
  districts?: string[];
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  perPage?: number;
  isFeatured?: boolean;
  priceLevel?: number;
  minRating?: number;
}

export interface BackendLocationQueryParams {
  search?: string;
  category_ids?: number[];
  districts?: string[];
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
  is_featured?: boolean;
  price_level?: number;
  min_rating?: number;
}

/**
 * Maps UI query parameters to Backend API parameters
 */
export const mapLocationQueryParams = (params: LocationQueryParams): BackendLocationQueryParams => {
  const mapped: BackendLocationQueryParams = {};

  if (params.q) mapped.search = params.q;
  if (params.categories && params.categories.length > 0) mapped.category_ids = params.categories;
  if (params.districts && params.districts.length > 0) mapped.districts = params.districts;
  if (params.sortBy) mapped.sort_by = params.sortBy;
  if (params.order) mapped.sort_order = params.order;
  if (params.page) mapped.page = params.page;
  if (params.perPage) mapped.per_page = params.perPage;
  if (params.isFeatured !== undefined) mapped.is_featured = params.isFeatured;
  if (params.priceLevel) mapped.price_level = params.priceLevel;
  if (params.minRating) mapped.min_rating = params.minRating;

  return mapped;
};
