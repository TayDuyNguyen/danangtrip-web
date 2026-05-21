# API Contract: Tour Booking History (user-bookings-list)

> Feature slug: `user-bookings-list`  
> Date: 2026-05-20  
> Version: 1.0  

---

## 1) Base URL
- Dev: `${NEXT_PUBLIC_API_URL}`
- Auth: Bearer token (Authorization header) via `axiosInstance`

## 1.1) Source References
- `src/config/api.ts` entries: `API_ENDPOINTS.BOOKINGS.USER_LIST`, `API_ENDPOINTS.BOOKINGS.CANCEL`
- `src/services/booking.service.ts` methods: `bookingService.list`, `bookingService.cancel`
- Analysis file: `2026-05-20__user-bookings-list__screen-analysis.md`

---

## 2) Endpoints

### GET /api/user/bookings
- **Purpose**: Lấy danh sách lịch sử đặt tour của người dùng hiện tại (phân trang, lọc trạng thái, tìm kiếm).
- **Auth**: Required (Bearer Token)
- **Query Params**:
  | Param | Type | Required | Default | Description |
  |-------|------|----------|---------|-------------|
  | `booking_status` | `'pending' \| 'confirmed' \| 'cancelled' \| 'completed' \| 'all'` | ✗ | `'all'` | Trạng thái đặt tour |
  | `search` | `string` | ✗ | `undefined` | Tìm kiếm theo mã đặt tour, tên tour, v.v. |
  | `page` | `number` | ✗ | `1` | Số trang cần lấy |
  | `per_page` | `number` | ✗ | `10` | Số bản ghi mỗi trang |
  | `sort_by` | `string` | ✗ | `'id'` | Sắp xếp theo cột |
  | `sort_order` | `'asc' \| 'desc'` | ✗ | `'desc'` | Thứ tự sắp xếp |

- **Response 200**:
  ```ts
  {
    code: number;
    message: string;
    data: {
      data: Booking[];
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }
  ```

- **Error Codes**:
  | Code | HTTP | Description | i18n key |
  |------|------|-------------|----------|
  | 401 | 401 Unauthorized | Token không hợp lệ hoặc hết hạn | |

---

### POST /api/user/bookings/:id/cancel
- **Purpose**: Hủy đơn đặt tour khi ở trạng thái `pending` hoặc `confirmed`.
- **Auth**: Required (Bearer Token)
- **Request Body** (validated by Zod):
  ```ts
  {
    cancellation_reason: string;
  }
  ```
- **Response 200**:
  ```ts
  {
    code: number;
    message: string;
    data: Booking;
  }
  ```
- **Validation Errors 400**:
  | Field | Rule | Message key |
  |-------|------|-------------|
  | `cancellation_reason` | `min(10)` | "Lý do hủy tour phải có ít nhất 10 ký tự" |

---

## 3) Data Types

```ts
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "success" | "failed" | "refunded" | "unpaid" | "partially_paid";
export type PaymentMethod = "bank_transfer" | "credit_card" | "paypal" | "cash" | "momo" | "vnpay" | "zalopay";

export interface BookingListParams {
  search?: string;
  booking_status?: BookingStatus | "all";
  payment_status?: PaymentStatus | "all";
  from_date?: string;
  to_date?: string;
  per_page?: number;
  page?: number;
  sort_by?: "id" | "created_at" | "booked_at" | "booking_code" | "total_amount" | "booking_status" | "payment_status";
  sort_order?: "asc" | "desc";
}

export interface BookingItem {
  id: number;
  booking_id: number;
  tour_id: number;
  tour_schedule_id: number;
  item_type: string;
  item_name: string;
  travel_date: string;
  quantity_adult: number;
  quantity_child: number;
  quantity_infant: number;
  unit_price_adult: string | number;
  unit_price_child: string | number;
  unit_price_infant: string | number;
  subtotal: string | number;
  status: string;
  tour?: Tour;
  tour_schedule?: TourSchedule;
}

export interface Booking {
  id: number;
  booking_code: string;
  user_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string | null;
  customer_note: string | null;
  total_amount: string | number;
  discount_amount: string | number;
  final_amount: string | number;
  deposit_amount: string | number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  cancellation_reason: string | null;
  booked_at: string;
  confirmed_at: string | null;
  cancelled_at: string | null;
  completed_at: string | null;
  booking_items?: BookingItem[];
}

export interface CancelBookingPayload {
  cancellation_reason: string;
}
```

---

## 4) Error Model
```ts
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
```
Lỗi mạng hoặc xác thực từ API sẽ trả về thông qua wrapper standard error.

---

## 5) Auth Requirements
| Endpoint | Required Role | Notes |
|----------|--------------|-------|
| `GET /api/user/bookings` | authenticated user | Xem đơn đặt hàng của bản thân |
| `POST /api/user/bookings/:id/cancel` | authenticated user (owner) | Chỉ chủ đơn hàng mới có quyền hủy |

---

## 6) Files Expected To Change
- `src/features/tour/validators/booking.schema.ts` (Thêm Zod validator cho cancellation reason)
- `src/features/tour/hooks/useBookingQueries.ts` (Thêm hook React Query `useUserBookings` và `useCancelBooking`)
