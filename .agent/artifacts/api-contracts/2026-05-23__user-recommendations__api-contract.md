# API Contract Specification - user-recommendations

- **Date:** 2026-05-23
- **Feature Slug:** `user-recommendations`
- **Primary Endpoint:** `GET /api/v1/recommendations`
- **Auth Strategy:** 🔐 Bearer Token (`jwt.auth`) via automatic Cookie sync in Axios interceptor.

---

## 1. Endpoint List & Strategy

| Method | Path | Auth | Request Type | Response Type | Description |
|---|---|---|---|---|---|
| `GET` | `/v1/recommendations` | 🔐 Required | Query Params | `ApiResponse<RecommendationResponse>` | Retrieve recommended locations and tours based on user history. |

---

## 2. Request & Response Payload Contract

### Request Parameters (Query)
- `limit`: `number` (optional, default: 10, min: 1, max: 50). Triggers the maximum size for each returned array (locations, tours).

### Response Schema (`ApiResponse<RecommendationResponse>`)

The envelope conforms to the Axios interceptor normalization: `{ success: boolean; data: RecommendationResponse; message: string }`.

```json
{
  "success": true,
  "data": {
    "locations": [
      {
        "id": 12,
        "name": "Chùa Linh Ứng",
        "slug": "chua-linh-ung",
        "category_id": 3,
        "subcategory_id": null,
        "description": "Chùa Linh Ứng Bãi Bụt là ngôi chùa to nhất...",
        "short_description": "Ngôi chùa nổi tiếng tại Bán đảo Sơn Trà.",
        "address": "Bán đảo Sơn Trà, Đà Nẵng",
        "district": "Sơn Trà",
        "avg_rating": "4.9",
        "review_count": 345,
        "price_min": 0,
        "price_max": 0,
        "thumbnail": "/images/linhung.jpg",
        "images": ["/images/linhung.jpg"],
        "is_featured": true,
        "recommendation_reason": "similar_favorite"
      }
    ],
    "tours": [
      {
        "id": 4,
        "name": "Tour Đèo Hải Vân - Lăng Cô",
        "slug": "tour-deo-hai-van-lang-co",
        "tour_category_id": 2,
        "description": "Hành trình khám phá cung đường đèo đẹp nhất...",
        "short_desc": "Khám phá cung đường đèo Hải Vân nổi tiếng.",
        "price_adult": "1200000.00",
        "discount_percent": 0,
        "duration": "1 ngày",
        "max_people": 15,
        "avg_rating": "4.8",
        "review_count": 42,
        "recommendation_reason": "booked"
      }
    ]
  },
  "message": "Success"
}
```

---

## 3. TypeScript Interfaces

We have registered and verified these concrete TypeScript types under `src/types/search.types.ts`:

```typescript
import type { Location, Tour } from "./entities.types";

export interface RecommendationParams {
  limit?: number;
}

export interface RecommendationResponse {
  locations: Location[];
  tours: Tour[];
}
```

- `Location` and `Tour` are the shared core entity types, expanded on the client side with the dynamic `recommendation_reason` string parameter.
- `recommendation_reason` maps to:
  - `'viewed'`: "Bạn đã xem" (based on recent view logs)
  - `'similar_favorite'`: "Tương tự yêu thích" (based on favorited items)
  - `'popular'`: "Phổ biến gần bạn" (fallback for locations)
  - `'booked'`: "Được đặt nhiều" (based on completed/active bookings)

---

## 4. Service & Query Client Design

We mapped the service boundaries to guarantee automatic query caching and request deduplication via TanStack Query:

### Service Transport (`src/services/search.service.ts`)
```typescript
getRecommendations: (params?: { limit?: number }): Promise<ApiResponse<{ locations: Location[]; tours: Tour[] }>> =>
  axiosInstance.get(API_ENDPOINTS.RECOMMENDATIONS, { params }),
```

### TanStack Query Hook (`src/features/recommendations/hooks/useRecommendationsQuery.ts`)
```typescript
export function useRecommendationsQuery(params?: RecommendationParams) {
  return useQuery({
    queryKey: ["recommendations", params],
    queryFn: () => searchService.getRecommendations(params).then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes cache deduplication
  });
}
```

---

## 5. Errors & Safe Fallbacks

1. **401 Unauthorized:** Handled globally by the Axios interceptor. Clears local tokens, triggers logout, and redirects to `/login?callbackUrl=/recommendations`.
2. **500 Server / Network Error:** Renders a clean error alert inside a glassy card component with a manual "Thử lại" retry trigger, preventing page whitescreens.
3. **Empty Data Envelope:** Handled inside the main grid by rendering the dedicated explorer empty state (SVG explore, Quick CTAs to `/locations` and `/tours`).
