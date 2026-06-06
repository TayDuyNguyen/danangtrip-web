# API & Types Contract: User Cart Feature (user-cart-api-planning)

- **Feature Slug**: `user-cart-api-planning`
- **Primary References**:
  - `D:\DATN\DATN_Document\docs\page\user_cart.md`
  - `src/config/api.ts`
  - `src/lib/axios.ts`

This contract secures the data communication format between the Frontend (`danangtrip-web`) and Backend (`danangtrip-api`) for the User Cart.

---

## 1. Backend Endpoints (Laravel Route List)

All endpoints below require user authentication (except guest-side operations using LocalStorage) and must be grouped under the `jwt.auth` middleware prefix `v1`.

| Method | Endpoint | Auth | Request Body | Response Data (Envelope wrapper) | Description |
|---|---|---|---|---|---|
| **GET** | `/v1/cart` | Required | None | `ApiResponse<CartItem[]>` | Retrieve all cart items with loaded Tour & Schedule details. |
| **POST** | `/v1/cart/items` | Required | `AddToCartPayload` | `ApiResponse<CartItem>` | Add a tour schedule to the user's database cart. |
| **PUT** | `/v1/cart/items/{id}`| Required | `UpdateCartPayload`| `ApiResponse<CartItem>` | Update passenger/guest counts for a cart item. |
| **DELETE**| `/v1/cart/items/{id}`| Required | None | `ApiResponse<void>` | Remove a single item from the database cart. |
| **DELETE**| `/v1/cart` | Required | None | `ApiResponse<void>` | Clear all items in the user's database cart. |
| **POST** | `/v1/cart/merge` | Required | `MergeCartPayload` | `ApiResponse<CartItem[]>` | Merge local guest cart items into the database cart upon login. |

---

## 2. Shared TypeScript Types (`danangtrip-web`)

We will create a new type definition file: [cart.types.ts](file:///d:/DATN/danangtrip-web/src/types/cart.types.ts).

```typescript
import type { Tour, TourSchedule } from "./entities.types";

export interface CartItem {
  id: number;
  user_id: number;
  tour_id: number;
  tour_schedule_id: number;
  quantity_adult: number;
  quantity_child: number;
  quantity_infant: number;
  created_at: string;
  updated_at: string;
  // Eager loaded relationships
  tour?: Tour;
  tour_schedule?: TourSchedule;
}

export interface AddToCartPayload {
  tour_id: number;
  tour_schedule_id: number;
  quantity_adult: number;
  quantity_child?: number;
  quantity_infant?: number;
}

export interface UpdateCartPayload {
  quantity_adult: number;
  quantity_child: number;
  quantity_infant: number;
}

export interface MergeCartPayload {
  items: Array<{
    tour_id: number;
    tour_schedule_id: number;
    quantity_adult: number;
    quantity_child: number;
    quantity_infant: number;
  }>;
}
```

---

## 3. Boundary Zod Schemas (`src/features/cart/validators/cart.schema.ts`)

These validators run on the frontend client before submitting payload packages to Axios.

```typescript
import { z } from "zod";

export const addToCartSchema = z.object({
  tour_id: z.number().int().positive("Invalid Tour ID"),
  tour_schedule_id: z.number().int().positive("Invalid Schedule ID"),
  quantity_adult: z.number().int().min(1, "At least 1 adult is required"),
  quantity_child: z.number().int().min(0).default(0),
  quantity_infant: z.number().int().min(0).default(0),
});

export const updateCartSchema = z.object({
  quantity_adult: z.number().int().min(1, "At least 1 adult is required"),
  quantity_child: z.number().int().min(0).default(0),
  quantity_infant: z.number().int().min(0).default(0),
});

export const mergeCartSchema = z.object({
  items: z.array(
    z.object({
      tour_id: z.number().int().positive(),
      tour_schedule_id: z.number().int().positive(),
      quantity_adult: z.number().int().min(1),
      quantity_child: z.number().int().min(0),
      quantity_infant: z.number().int().min(0),
    })
  ),
});

export type AddToCartValues = z.infer<typeof addToCartSchema>;
export type UpdateCartValues = z.infer<typeof updateCartSchema>;
export type MergeCartValues = z.infer<typeof mergeCartSchema>;
```

---

## 4. Response Envelopes Examples

### GET `/v1/cart` Success:
```json
{
  "code": 200,
  "message": "Cart items retrieved successfully.",
  "data": [
    {
      "id": 12,
      "user_id": 5,
      "tour_id": 3,
      "tour_schedule_id": 8,
      "quantity_adult": 2,
      "quantity_child": 1,
      "quantity_infant": 0,
      "created_at": "2026-05-25T15:30:00.000000Z",
      "updated_at": "2026-05-25T15:30:00.000000Z",
      "tour": {
        "id": 3,
        "name": "Tour Bà Nà Hills 1 Ngày",
        "slug": "tour-ba-na-hills-1-ngay",
        "price_adult": 1200000,
        "price_child": 900000,
        "price_infant": 300000
      },
      "tour_schedule": {
        "id": 8,
        "tour_id": 3,
        "start_date": "2026-06-10",
        "max_people": 20,
        "booked_people": 15,
        "booking_availability": "open"
      }
    }
  ]
}
```

### Validation Failure (e.g., PUT `/v1/cart/items/12` exceeds capacity):
```json
{
  "code": 400,
  "message": "Not enough available seats for this tour schedule.",
  "error_key": "CAPACITY_EXCEEDED",
  "errors": {
    "quantity_adult": [
      "The combined passenger count (3) exceeds remaining available seats (2)."
    ]
  }
}
```

---

## 5. Expected Files to Modify & Create

### danangtrip-api (Backend)
- **[NEW]** `database/migrations/2026_05_25_000000_create_cart_items_table.php` (DB schema definition)
- **[NEW]** `app/Models/CartItem.php` (Eloquent Model)
- **[NEW]** `app/Http/Controllers/Api/CartController.php` (Request handling and DB queries)
- **[NEW]** `app/Http/Requests/Cart/AddToCartRequest.php` (Backend input validation)
- **[NEW]** `app/Http/Requests/Cart/UpdateCartRequest.php` (Backend input validation)
- **[NEW]** `app/Http/Requests/Cart/MergeCartRequest.php` (Backend input validation)
- **[MODIFY]** `routes/api.php` (Register cart routes under jwt.auth)

### danangtrip-web (Frontend)
- **[NEW]** `src/types/cart.types.ts` (TypeScript interfaces)
- **[NEW]** `src/features/cart/validators/cart.schema.ts` (Zod schemas)
- **[NEW]** `src/services/cart.service.ts` (API transport wrapper)
- **[NEW]** `src/store/cart.store.ts` (Zustand storage hooks)
- **[MODIFY]** `src/config/api.ts` (Append `/cart` endpoint endpoints)
- **[MODIFY]** `src/config/routes.ts` (Append `/cart` active route page definition)
