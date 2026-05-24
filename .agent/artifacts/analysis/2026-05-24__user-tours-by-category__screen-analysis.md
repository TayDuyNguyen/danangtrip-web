# Screen Analysis: Tour theo Danh mục (user-tours-by-category)

- **Feature Slug**: `user-tours-by-category`
- **Screen Name**: Tour theo Danh mục
- **Public Route**: `/tour-categories/{slug}/tours`
- **Target Page Path**: `src/app/[locale]/(main)/(public)/tour-categories/[slug]/tours/page.tsx`
- **Target Feature Folder**: `src/features/tour/category`
- **Primary Document**: `D:\DATN\DATN_Document\docs\page\user_tours_by_category.md`

---

## 1. Purpose of the Screen
This screen acts as a public-facing landing page for discovering tours filtered under a specific category (e.g., "Tour Hằng Ngày", "Tour Nghỉ Dưỡng"). It allows visitors to search, sort, and filter these category-specific tours without requiring an active user login.

---

## 2. API Contract & Parameters

### Original Endpoint
- **GET** `/tour-categories/{slug}/tours`
- **Supported parameters**: `page`, `per_page`, `sort_by`, `sort_order`, `booking_availability`

### Extended Endpoint (Backend modified)
We are extending this route's request handling to support all regular tour discovery filters:
- **GET** `/tour-categories/{slug}/tours`
- **Filters**:
  - `search` (string): Full-text tour search
  - `price_min` (integer): Minimum price boundary
  - `price_max` (integer): Maximum price boundary
  - `duration` (string): Duration exact match (e.g. "1 ngày")
  - `available_from` (date `Y-m-d`): Tours departure start boundary
  - `available_to` (date `Y-m-d`): Tours departure end boundary
  - `booking_availability` (string): E.g., `available`, `few_seats`, `sold_out`
  - `sort_by` (string): `created_at`, `price_adult` (normalized from `price`), `rating_avg`, `booking_count`
  - `sort_order` (string): `asc`, `desc`
  - `page` (integer): Pagination offset
  - `per_page` (integer): Pagination limit (1 to 100)

### Response Shape
Returns a standard length-aware paginated collection of Tour items:
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "name": "Tour Bà Nà Hills 1 Ngày",
        "slug": "tour-ba-na-hills-1-ngay",
        "price_adult": 1200000,
        "price_child": 900000,
        "price_infant": 300000,
        "duration": "1 ngày",
        "rating_avg": 4.8,
        "rating_count": 15,
        "booking_availability": "available",
        "is_featured": true,
        "is_hot": false,
        "tour_category_id": 2,
        "created_at": "2026-05-24T00:00:00.000000Z",
        "updated_at": "2026-05-24T00:00:00.000000Z"
      }
    ],
    "first_page_url": ".../tour-categories/tour-hang-ngay/tours?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": ".../tour-categories/tour-hang-ngay/tours?page=1",
    "next_page_url": null,
    "path": ".../tour-categories/tour-hang-ngay/tours",
    "per_page": 12,
    "prev_page_url": null,
    "to": 1,
    "total": 1
  }
}
```

---

## 3. Reusable Patterns & Components
We can reuse massive elements from the main `tours` screen, reducing the risk of UI divergence and speeding up development:
- **`TourCard`** (`src/features/tour/components/TourCard.tsx`): Fits category tour items without modification.
- **`TourGrid`** (`src/features/tour/components/TourGrid.tsx`): Displays skeletons during loading, and cards/layouts otherwise.
- **`useTourFilters`** (`src/features/tour/hooks/useTourFilters.ts`): Excellent synchronization wrapper between local react state and URL query search parameters. We can reuse it since `/tour-categories/{slug}/tours` uses standard query parameters.
- **`FilterSidebar`** (`src/features/tour/components/FilterSidebar.tsx`): By adding a simple `showCategoryFilter` optional prop, we can hide the category selection section when viewed in a category list, keeping all price range, duration checkboxes, departure calendar, and reset buttons active.

---

## 4. Gaps and Mismatches Identified
- **Backend constraints**: The backend repository `TourCategoryRepository.php` lacks queries for price limits, durations, search keywords, and schedules search for this route. Sửa file và thêm logic là giải pháp hoàn hảo nhất.
- **Visual differentiation**: The requirements doc describes a dynamic hero layout utilizing category icons, localized breadcrumbs, and distinct visual hierarchy compared to the standard `/tours` list page.
- **Category meta retrieval**: When visiting `/tour-categories/{slug}/tours`, we need details about the active category (e.g. name, emoji, descriptions) for the Page Hero and metadata title. We can retrieve the entire category listing via `tourService.getCategories()` and extract the matching element by `slug`. This avoids creating an additional "GET detail category by slug" endpoint.

---

## 5. Potential Risks & Safety Measures
- **Risk**: Modifying `FilterSidebar.tsx` could break or regress the `/tours` main listing.
  - *Mitigation*: Maintain default `showCategoryFilter = true` behavior and test thoroughly under Step 09.
- **Risk**: Modifying `ToursBySlugTourCategoryRequest.php` on the API could break admin or other route actions.
  - *Mitigation*: Ensure change is strictly isolated to this request and repository query, matching the type safety rules exactly.
