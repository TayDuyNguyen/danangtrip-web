# API Contract: Tour Booking

> Feature slug: `tour-booking`
> Date: 2026-05-16
> Version: 1.0

---

## 1) Base URL
- Dev: `${NEXT_PUBLIC_API_URL}/api/v1`
- Auth: Bearer token (Authorization header) - **MANDATORY** for all endpoints below.

## 1.1) Source References
- `api_list.md` section: `BOOKINGS (Đặt tour)`, `PAYMENTS (Thanh toán)`
- `src/config/api.ts` entries: `API_ENDPOINTS.BOOKINGS`, `API_ENDPOINTS.PAYMENTS`
- Analysis file: `.agent/artifacts/analysis/2026-05-16__tour-booking__screen-analysis.md`

## 2) Endpoints

### POST /bookings/calculate
- **Purpose**: Tính toán tổng tiền dựa trên lịch khởi hành và số lượng khách.
- **Auth**: Required (User)
- **Request Body**:
  ```ts
  {
    tour_id: number;
    tour_schedule_id: number;
    quantity_adult: number;
    quantity_child?: number | null;
    quantity_infant?: number | null;
  }
  ```
- **Response 200**:
  ```ts
  {
    code: 200,
    message: "Success",
    data: {
      total_amount: number | string;
      discount_amount?: number | string;
      final_amount: number | string;
      deposit_amount?: number | string;
      available_seats?: number;
    }
  }
  ```

### POST /bookings
- **Purpose**: Tạo đơn đặt tour mới.
- **Auth**: Required (User)
- **Request Body** (validated by Zod):
  ```ts
  {
    tour_id: number;
    tour_schedule_id: number;
    quantity_adult: number;
    quantity_child?: number | null;
    quantity_infant?: number | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address?: string | null;
    customer_note?: string | null;
    payment_method: "momo" | "vnpay" | "zalopay" | "bank_transfer";
  }
  ```
- **Response 201**:
  ```ts
  {
    code: 201,
    message: "Booking created",
    data: Booking // Entity type defined in src/types/booking.types.ts
  }
  ```

### POST /payments/create
- **Purpose**: Tạo yêu cầu thanh toán và lấy link thanh toán từ cổng.
- **Auth**: Required (User)
- **Request Body**:
  ```ts
  {
    booking_id: number;
    payment_method: "momo" | "vnpay" | "zalopay";
  }
  ```
- **Response 200**:
  ```ts
  {
    code: 200,
    data: {
      payment_url: string;
      transaction_code: string;
    }
  }
  ```

## 3) Data Types (Additions & Refinements)

### Zod Schema (Planned for `src/features/tour/validators/booking.schema.ts`)
```ts
import { z } from "zod";

export const bookingSchema = z.object({
  tour_id: z.number(),
  tour_schedule_id: z.number({ required_error: "vui lòng chọn ngày khởi hành" }),
  quantity_adult: z.number().min(1, "tối thiểu 1 người lớn"),
  quantity_child: z.number().min(0).default(0),
  quantity_infant: z.number().min(0).default(0),
  customer_name: z.string().min(2, "tên tối thiểu 2 ký tự"),
  customer_email: z.string().email("email không hợp lệ"),
  customer_phone: z.string().regex(/^[0-9]{10,11}$/, "số điện thoại không hợp lệ"),
  customer_address: z.string().optional().nullable(),
  customer_note: z.string().optional().nullable(),
  payment_method: z.enum(["momo", "vnpay", "zalopay", "bank_transfer"]),
  agree_terms: z.literal(true, {
    errorMap: () => ({ message: "bạn phải đồng ý với điều khoản" }),
  }),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
```

### Response Entities (Shared in `src/types/`)
- `Booking`: Đã có trong `src/types/booking.types.ts`.
- `TourSchedule`: Đã có trong `src/types/entities.types.ts`.
- `Payment`: Đã có trong `src/types/payment.types.ts`.

## 4) Error Model
Tuân thủ `src/lib/axios.ts`:
```ts
interface ApiError {
  code: number;
  message: string;
  errors?: Record<string, string[]>; // Cho validation errors từ Laravel
}
```

## 5) Auth Requirements
| Endpoint | Required Role | Notes |
|----------|--------------|-------|
| `POST /bookings/calculate` | User | Cần token để xác định user đang thao tác |
| `POST /bookings` | User | Lưu `user_id` vào bảng `bookings` |
| `POST /payments/create` | User | Chỉ người đặt mới có quyền tạo payment cho booking đó |

---

## 6) Files Expected To Change
- `src/services/booking.service.ts`: Giữ nguyên (đã có đủ method).
- `src/services/payment.service.ts`: Giữ nguyên (đã có đủ method).
- `src/features/tour/validators/booking.schema.ts`: **Tạo mới** để dùng cho React Hook Form (hoặc local state validation).
- `src/types/booking.types.ts`: Kiểm tra và bổ sung `agree_terms` nếu cần dùng chung, hoặc để ở feature level.
- `src/messages/vi/tour.json`: Bổ sung các key cho validation messages.
