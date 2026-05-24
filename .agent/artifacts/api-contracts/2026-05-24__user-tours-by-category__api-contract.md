# API Contract & Core Service: Tour theo Danh mục (user-tours-by-category)

- **Date**: 2026-05-24
- **Active Feature**: `user-tours-by-category`

---

## 1. API Endpoint Details
The screen is backed by the following core backend routes, extended to support the full sidebar filtering criteria:

### Main Route
- **URL**: `GET /v1/tour-categories/{slug}/tours`
- **Controller**: `TourCategoryController@toursBySlug`
- **Form Request**: `ToursBySlugTourCategoryRequest`
- **Repository Method**: `TourCategoryRepository@getToursBySlug`

### Extended Parameters Supported
The request schema validates and merges the following filtering parameters:
| Parameter | Type | Validation Rules | Description |
| --- | --- | --- | --- |
| `slug` | `string` | `required`, `exists:tour_categories,slug` | URL route segment representing category |
| `search` | `string` | `sometimes`, `max:100` | Full-text query on name and descriptions |
| `price_min` | `integer` | `sometimes`, `min:0` | Minimum adult price boundary |
| `price_max` | `integer` | `sometimes`, `gte:price_min` | Maximum adult price boundary |
| `duration` | `string` | `sometimes`, `max:50` | Exact matching on duration column |
| `available_from` | `date` | `sometimes`, `date_format:Y-m-d` | Active schedules start date threshold |
| `available_to` | `date` | `sometimes`, `date_format:Y-m-d`, `after_or_equal:available_from` | Active schedules end date threshold |
| `booking_availability` | `string` | `sometimes`, `in:available,few_seats,sold_out` | Booking occupancy filters |
| `sort_by` | `string` | `sometimes`, `in:created_at,price_adult,rating_avg,price` | Sorting field |
| `sort_order` | `string` | `sometimes`, `in:asc,desc` | Sorting direction |
| `page` | `integer` | `sometimes`, `min:1` | Active page index |
| `per_page` | `integer` | `sometimes`, `min:1`, `max:100` | Results limit |

---

## 2. Service Wrapper Layer (`danangtrip-web`)
Added and registered the dynamic helper inside `src/services/tour.service.ts`:
```typescript
getByCategorySlug: (slug: string, params?: TourFilterParams): Promise<ApiResponse<PaginatedResponse<Tour>>> =>
  axiosInstance.get(API_ENDPOINTS.TOURS.BY_CATEGORY_SLUG(slug), { params }),
```

- **Universal Endpoint Mapping** registered in `src/config/api.ts`:
  ```typescript
  BY_CATEGORY_SLUG: (slug: string) => `/tour-categories/${slug}/tours`,
  ```
- **Dynamic Route constant** registered in `src/config/routes.ts`:
  ```typescript
  CATEGORY_TOURS: (slug: string) => `/tour-categories/${slug}/tours`,
  ```

---

## 3. Query Synchronization Layer (`danangtrip-web`)
To enable reactive data fetching, cache sharing, and auto-refresh mechanisms, the hook `useCategoryTours` is registered:
- **Location**: `src/features/tour/category/hooks/useCategoryTours.ts`
- **Implementation**: Uses TanStack Query `useQuery` with hierarchical query keys `["tour", "category", slug, params]`.
- **Mapping**: Integrates `tourMapper.mapTours(...)` to normalize backend schema structures into UI-ready models.
