# API Contract: Chi tiết Đơn đặt theo Mã đơn (user-booking-by-code)

- **Feature slug:** `user-booking-by-code`
- **Ngày thực hiện:** 2026-05-21
- **Phiên bản:** 1.0

---

## 1) Base URL
- API Môi trường: `${NEXT_PUBLIC_API_URL}`
- Xác thực: Bearer token truyền qua `Authorization` header và đồng bộ qua Cookie `token` cho Middleware.

## 1.1) Source References
- `api_list.md` section: `GET /user/bookings/code/{booking_code}`
- `src/config/api.ts` entries: `API_ENDPOINTS.BOOKINGS.DETAIL_BY_CODE`
- Analysis file: `2026-05-21__user-booking-by-code__screen-analysis.md`

---

## 2) Endpoints

### GET /user/bookings/code/{booking_code}
- **Purpose**: Tải thông tin chi tiết của đơn đặt tour dựa vào mã đơn hàng.
- **Auth**: Required (Đăng nhập bắt buộc)
- **Path Params**:
  | Param | Type | Required | Description |
  |-------|------|----------|-------------|
  | `booking_code` | `string` | ✓ | Mã đơn hàng cần tra cứu (ví dụ: `BK-1008`) |
- **Response 200 (ApiResponse<Booking>)**:
  ```ts
  {
    code: 200,
    message: "Success",
    data: {
      id: 12,
      booking_code: "BK-1008",
      user_id: 2,
      customer_name: "Nguyễn Văn An",
      customer_email: "nguyenvanan@gmail.com",
      customer_phone: "0905123456",
      customer_address: "Đà Nẵng",
      customer_note: "Có trẻ em nhỏ đi kèm",
      total_amount: 2200000,
      discount_amount: 0,
      final_amount: 2200000,
      deposit_amount: 0,
      payment_method: "vnpay",
      payment_status: "paid",
      booking_status: "confirmed",
      cancellation_reason: null,
      booked_at: "2026-05-21T13:30:00Z",
      confirmed_at: "2026-05-21T13:35:00Z",
      cancelled_at: null,
      completed_at: null,
      booking_items: [
        {
          id: 15,
          booking_id: 12,
          tour_id: 5,
          tour_schedule_id: 8,
          item_type: "tour",
          item_name: "Tour Bà Nà Hills 1 Ngày",
          travel_date: "2026-05-25",
          quantity_adult: 2,
          quantity_child: 1,
          quantity_infant: 0,
          unit_price_adult: 850000,
          unit_price_child: 500000,
          unit_price_infant: 0,
          subtotal: 2200000,
          status: "active",
          tour: {
            id: 5,
            name: "Tour Bà Nà Hills 1 Ngày",
            slug: "tour-ba-na-hills-1-ngay",
            thumbnail: "/images/tours/banahills.jpg"
          }
        }
      ]
    }
  }
  ```
- **Error Codes**:
  | HTTP Code | API Code | Description | i18n key / Handling |
  |-----------|----------|-------------|---------------------|
  | `401` | `UNAUTHORIZED` | Người dùng chưa đăng nhập | Chuyển hướng sang `/login` |
  | `403` | `FORBIDDEN` | Đơn hàng không thuộc sở hữu của người dùng đang đăng nhập | Hiển thị thông báo không có quyền xem đơn |
  | `404` | `NOT_FOUND` | Không tìm thấy mã đơn hàng trong cơ sở dữ liệu | Hiển thị thông báo không tồn tại đơn hàng |

---

### POST /user/bookings/{id}/cancel
- **Purpose**: Yêu cầu hủy đơn hàng dựa trên ID thực tế của đơn hàng (lấy từ dữ liệu trả về của endpoint detail bằng code).
- **Auth**: Required (Đăng nhập bắt buộc)
- **Path Params**:
  | Param | Type | Required | Description |
  |-------|------|----------|-------------|
  | `id` | `number \| string` | ✓ | ID hệ thống của đơn hàng (ví dụ: `12`) |
- **Request Body (validated by Zod)**:
  ```ts
  {
    cancellation_reason: "Lý do hủy đơn hàng..." // tối thiểu 10 ký tự
  }
  ```
- **Response 200 (ApiResponse<Booking>)**: Trả về dữ liệu Booking đã được cập nhật trạng thái `booking_status: "cancelled"`.

---

### GET /user/bookings/{id}/invoice
- **Purpose**: Tải thông tin hóa đơn dạng JSON của đơn hàng để in hoặc kết xuất PDF.
- **Auth**: Required (Đăng nhập bắt buộc)
- **Path Params**:
  | Param | Type | Required | Description |
  |-------|------|----------|-------------|
  | `id` | `number \| string` | ✓ | ID hệ thống của đơn hàng |
- **Response 200 (ApiResponse<any>)**: Trả về tệp dữ liệu hóa đơn dạng JSON.

---

## 3) Data Types

Kiểu dữ liệu TypeScript kế thừa trực tiếp từ hệ thống types của ứng dụng tại `src/types/booking.types.ts` và `src/types/api.types.ts`:

```typescript
// Trạng thái đơn hàng
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

// Trạng thái thanh toán
export type PaymentStatus = "pending" | "success" | "failed" | "refunded" | "unpaid" | "partially_paid";

// Phương thức thanh toán
export type PaymentMethod = "bank_transfer" | "credit_card" | "paypal" | "cash" | "momo" | "vnpay" | "zalopay";

// Chi tiết phần tử đặt tour
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

// Đối tượng Đơn hàng chính
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
  items?: BookingItem[];
  booking_items?: BookingItem[];
}
```

---

## 4) Error Model

Mọi lỗi trả về từ API đều tuân thủ envelope chuẩn của Axios wrapper:

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}
```

---

## 5) Auth Requirements

| Endpoint | Required Role | Notes |
|----------|--------------|-------|
| `GET /user/bookings/code/{booking_code}` | Đã đăng nhập (Owner) | Chỉ có chủ sở hữu của đơn hàng mới được quyền truy cập. Trả về 403 nếu cố ý truy cập đơn của người khác. |
| `POST /user/bookings/{id}/cancel` | Đã đăng nhập (Owner) | Chỉ hủy được khi trạng thái là pending/confirmed và chưa đến ngày khởi hành. |
| `GET /user/bookings/{id}/invoice` | Đã đăng nhập (Owner) | Chỉ cho phép xem khi đơn đặt tour tồn tại. |

---

## 6) Files Expected To Change
- `src/features/tour/hooks/useBookingQueries.ts` (Đã thêm `useBookingDetailByCode` thành công)
