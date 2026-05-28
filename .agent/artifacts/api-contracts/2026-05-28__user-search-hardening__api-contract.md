# API Contract: User Search Hardening

> Feature slug: `user-search-hardening`
> Date: 2026-05-28
> Version: 1.0

---

## 1) Base URL
- Dev: `${NEXT_PUBLIC_API_URL}`
- Auth: Bearer token (Authorization header) nếu đã đăng nhập (dùng cho recommendations), không bắt buộc cho tìm kiếm công khai.

## 1.1) Source References
- `api_list.md` section: Public Routes & Protected Routes
- `src/config/api.ts` entries: API_ENDPOINTS.SEARCH
- Analysis file: `2026-05-28__user-search-hardening__screen-analysis.md`

## 2) Endpoints

### GET /v1/search
- **Purpose**: Tìm kiếm địa điểm hoặc tour du lịch theo các bộ lọc
- **Auth**: Public
- **Query Params**:
  | Param | Type | Required | Default | Description |
  |-------|------|----------|---------|-------------|
  | `q` | `string` | No | `""` | Từ khóa tìm kiếm |
  | `type` | `"tour" \| "location"` | No | `"location"` | Loại tìm kiếm |
  | `category_id` | `number` | No | | ID danh mục địa điểm |
  | `tour_category_id` | `number` | No | | ID danh mục tour |
  | `district` | `string` | No | | Tên quận huyện |
  | `price_min` | `number` | No | | Giá tối thiểu |
  | `price_max` | `number` | No | | Giá tối đa |
  | `sort_by` | `string` | No | `"created_at"` | Cột sắp xếp |
  | `sort_order` | `"asc" \| "desc"` | No | `"desc"` | Chiều sắp xếp |
  | `page` | `number` | No | `1` | Trang hiện tại |
  | `per_page` | `number` | No | `12` | Số bản ghi trên trang |
  | `session_id` | `string` | No | | ID phiên để ghi nhận lịch sử tìm kiếm |

- **Response 200**:
  ```ts
  {
    success: boolean;
    data: {
      query: string;
      type: "tour" | "location";
      results: {
        data: (Tour | Location)[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    };
  }
  ```

### GET /v1/search/suggestions
- **Purpose**: Lấy danh sách từ khóa gợi ý khi người dùng đang nhập
- **Auth**: Public
- **Query Params**:
  | Param | Type | Required | Default | Description |
  |-------|------|----------|---------|-------------|
  | `q` | `string` | Yes | | Từ khóa tìm kiếm prefix |
  | `limit` | `number` | No | `5` | Số gợi ý tối đa |

- **Response 200**:
  ```ts
  {
    success: boolean;
    data: {
      query: string;
      suggestions: string[];
    };
  }
  ```

### GET /v1/search/popular
- **Purpose**: Lấy danh sách từ khóa tìm kiếm phổ biến nhất
- **Auth**: Public
- **Query Params**:
  | Param | Type | Required | Default | Description |
  |-------|------|----------|---------|-------------|
  | `limit` | `number` | No | `10` | Số từ khóa tối đa |
  | `days` | `number` | No | `30` | Khoảng thời gian thống kê |

- **Response 200**:
  ```ts
  {
    success: boolean;
    data: {
      popular: {
        query: string;
        count: number;
      }[];
    };
  }
  ```

### GET /v1/search/trending
- **Purpose**: Lấy danh sách từ khóa tìm kiếm xu hướng (24h qua)
- **Auth**: Public
- **Query Params**:
  | Param | Type | Required | Default | Description |
  |-------|------|----------|---------|-------------|
  | `limit` | `number` | No | `10` | Số từ khóa tối đa |

- **Response 200**:
  ```ts
  {
    success: boolean;
    data: {
      trending: {
        query: string;
        count: number;
      }[];
    };
  }
  ```

## 3) Data Types

```ts
import type { Tour, Location } from "@/types";

export type SearchResultType = "tour" | "location";

export interface SearchResultBase {
  id: number | string;
  type: SearchResultType;
  title: string;
  slug: string;
  thumbnail: string | null;
  rating: number;
  reviewCount: number;
  featured?: boolean;
}

export interface TourSearchResult extends SearchResultBase {
  type: "tour";
  price: number;
  duration: string;
  categoryName: string;
  bookingCount: number;
  originalData: Tour;
}

export interface LocationSearchResult extends SearchResultBase {
  type: "location";
  priceLevel?: number;
  categoryName: string;
  address: string;
  viewCount: number;
  originalData: Location;
}

export type SearchResult = TourSearchResult | LocationSearchResult;

export interface SearchSuggestionResponse {
  query: string;
  suggestions: string[];
}

export interface SearchPopularResponse {
  popular: {
    query: string;
    count: number;
  }[];
}

export interface SearchTrendingResponse {
  trending: {
    query: string;
    count: number;
  }[];
}
```

## 4) Error Model
```ts
interface ApiError {
  success: boolean;
  error: string;
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
```

## 5) Auth Requirements
| Endpoint | Required Role | Notes |
|----------|--------------|-------|
| `GET /v1/search` | Public | Không bắt buộc token |
| `GET /v1/search/suggestions` | Public | Không bắt buộc token |
| `GET /v1/search/popular` | Public | Không bắt buộc token |
| `GET /v1/search/trending` | Public | Không bắt buộc token |

---

## 6) Files Expected To Change
- `src/features/search/types/search.types.ts`
- `src/features/search/hooks/use-search-discovery.ts`
- `src/services/search.service.ts`
