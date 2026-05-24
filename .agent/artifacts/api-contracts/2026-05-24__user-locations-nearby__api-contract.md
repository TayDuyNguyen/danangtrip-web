# API Contract Report: user-locations-nearby

> Feature slug: `user-locations-nearby`
> Date: 2026-05-24
> Scope: `API & TypeScript Types Contract Alignments`

---

## 1) Endpoint Definition

### `GET /v1/locations/nearby`
- **Description**: Tìm kiếm các địa điểm du lịch, ẩm thực, giải trí lân cận vị trí hiện tại dựa trên tọa độ GPS thiết bị (sử dụng công thức Haversine tính toán khoảng cách).
- **Quyền truy cập (Auth)**: **Công khai (Public)** - Không cần Bearer Token.

---

## 2) Request Parameters

| Parameter | Type | Required | Default | Validation Rules | Description |
|-----------|------|----------|---------|------------------|-------------|
| `lat` | `numeric` | ✅ | N/A | `between:-90,90` | Vĩ độ hiện tại của thiết bị khách. |
| `lng` | `numeric` | ✅ | N/A | `between:-180,180` | Kinh độ hiện tại của thiết bị khách. |
| `radius` | `numeric` | ✗ | `5` | `min:0.1`, `max:50` | Bán kính quét (đơn vị: km). |
| `limit` | `integer` | ✗ | `15` | `min:1`, `max:100` | Số lượng địa điểm trả về tối đa. |
| `sort_by` | `string` | ✗ | `distance` | `in:avg_rating,review_count,view_count,created_at,price_min` | Tiêu chí sắp xếp. Mặc định là theo khoảng cách gần nhất. |
| `sort_order` | `string` | ✗ | `asc` | `in:asc,desc` | Thứ tự sắp xếp (tăng dần/giảm dần). |

> [!WARNING]
> Không gửi các tham số không hợp lệ hoặc không được hỗ trợ bởi validator của Laravel (ví dụ: `category_id`, `district`, `price_level`) trực tiếp lên API này. Việc lọc danh mục sẽ được thực hiện ở phía client-side trên tập hợp kết quả trả về để đảm bảo tính an toàn cho contract API.

---

## 3) Response Contract (200 OK)

Trả về danh sách các địa điểm kèm theo thuộc tính tính toán `distance` (số thực biểu thị khoảng cách dạng km) và dữ liệu quan hệ `category` đã được eager load:

```json
{
  "status": 200,
  "data": [
    {
      "id": 14,
      "name": "Cầu Rồng",
      "slug": "cau-rong",
      "description": "Cầu Rồng bắc qua sông Hàn, phun lửa và nước vào tối cuối tuần...",
      "short_description": "Cầu phun lửa độc đáo tại Đà Nẵng",
      "address": "Đường Nguyễn Văn Linh, Phước Ninh, Hải Châu, Đà Nẵng",
      "district": "Hải Châu",
      "ward": "Phước Ninh",
      "latitude": "16.0611",
      "longitude": "108.2274",
      "phone": null,
      "email": null,
      "website": null,
      "opening_hours": "24/7",
      "price_min": 0,
      "price_max": 0,
      "price_level": 1,
      "thumbnail": "/images/discovery/dragon-bridge.png",
      "images": [
        "/images/discovery/dragon-bridge.png"
      ],
      "video_url": null,
      "status": "active",
      "is_featured": true,
      "view_count": 1042,
      "favorite_count": 328,
      "avg_rating": "4.9",
      "review_count": 89,
      "distance": 1.25,
      "category": {
        "id": 3,
        "name": "Điểm tham quan",
        "slug": "diem-tham-quan",
        "icon": "map-marker",
        "description": "Các danh lam thắng cảnh, di tích lịch sử lý thú",
        "image": null,
        "sort_order": 1,
        "status": "active"
      }
    }
  ]
}
```

---

## 4) Frontend TypeScript Contracts

Định nghĩa kiểu dữ liệu trong `src/features/locations/nearby/types/nearby.types.ts`:

```typescript
import type { Location } from "@/types";

export interface NearbyQueryParams {
  lat: number;
  lng: number;
  radius?: number;
  limit?: number;
  sort_by?: "avg_rating" | "review_count" | "view_count" | "created_at" | "price_min";
  sort_order?: "asc" | "desc";
}

export interface NearbyLocation extends Location {
  distance: number; // calculated distance in km
}
```

---

## 5) API & Route Configuration Declarations

### `src/config/api.ts`
```typescript
export const API_ENDPOINTS = {
  // ...
  LOCATIONS: {
    // ...
    NEARBY: "/locations/nearby",
    NEARBY_BY_ID: (id: number) => `/locations/${id}/nearby`,
  }
};
```

### `src/config/routes.ts`
```typescript
export const PUBLIC_ROUTES = {
  // ...
  NEARBY: "/nearby",
};
```

### `src/services/location.service.ts`
```typescript
  getNearby: (params: NearbyQueryParams): Promise<ApiResponse<Location[]>> =>
    axiosInstance.get(API_ENDPOINTS.LOCATIONS.NEARBY, { params }),
```
