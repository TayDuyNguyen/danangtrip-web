# Hợp đồng API: Chi tiết Đơn đặt tour (user-booking-detail)

Tài liệu này đặc tả các endpoint API thực tế được kiểm tra tại backend (`danangtrip-api`) và các kiểu dữ liệu tương ứng trong client (`danangtrip-web`).

---

## 1. Các Endpoints API Đã Kiểm Chứng (Audited Endpoints)

### 1.1 Chi tiết Đơn đặt tour
- **Endpoint:** `GET /api/v1/user/bookings/{id}`
- **Định nghĩa Route Backend:** `BookingController@show`
- **Mô tả:** Lấy thông tin chi tiết đơn đặt tour dựa trên ID tự tăng (cơ sở dữ liệu).
- **Phản hồi Thành công (200 OK):**
```json
{
  "success": true,
  "message": "Booking retrieved successfully.",
  "data": {
    "id": 15,
    "booking_code": "BOOK-ABCDEFGH",
    "user_id": 3,
    "customer_name": "Nguyen Van A",
    "customer_email": "a.nguyen@example.com",
    "customer_phone": "0912345678",
    "customer_address": "Danang, Vietnam",
    "customer_note": "Yêu cầu phòng không hút thuốc",
    "total_amount": "5000000.00",
    "discount_amount": "500000.00",
    "final_amount": "4500000.00",
    "deposit_amount": "0.00",
    "payment_method": "momo",
    "payment_status": "paid",
    "booking_status": "confirmed",
    "cancellation_reason": null,
    "booked_at": "2026-05-21 14:00:00",
    "confirmed_at": "2026-05-21 14:15:00",
    "cancelled_at": null,
    "completed_at": null,
    "items": [
      {
        "id": 20,
        "booking_id": 15,
        "tour_id": 5,
        "tour_schedule_id": 12,
        "item_type": "tour",
        "item_name": "Tour Bà Nà Hills 1 Ngày",
        "travel_date": "2026-06-01",
        "quantity_adult": 2,
        "quantity_child": 1,
        "quantity_infant": 0,
        "unit_price_adult": "2000000.00",
        "unit_price_child": "1000000.00",
        "unit_price_infant": "0.00",
        "subtotal": "5000000.00",
        "status": "active",
        "tour": {
          "id": 5,
          "name": "Tour Bà Nà Hills 1 Ngày",
          "slug": "tour-ba-na-hills-1-ngay",
          "thumbnail": "banahills.jpg",
          "duration": "1 ngày"
        },
        "tour_schedule": {
          "id": 12,
          "start_date": "2026-06-01",
          "end_date": "2026-06-01"
        }
      }
    ]
  }
}
```

### 1.2 Yêu cầu Hủy đơn
- **Endpoint:** `POST /api/v1/user/bookings/{id}/cancel`
- **Định nghĩa Route Backend:** `BookingController@cancel`
- **Payload Yêu cầu (Request Body):**
```json
{
  "cancellation_reason": "Lý do hủy đơn hàng của tôi..."
}
```
- **Phản hồi Thành công (200 OK):** Trả về model Booking cập nhật với trạng thái mới.

### 1.3 Lấy thông tin Hóa đơn
- **Endpoint:** `GET /api/v1/user/bookings/{id}/invoice`
- **Định nghĩa Route Backend:** `BookingController@invoice`
- **Mô tả:** Trả về dữ liệu JSON tương tự chi tiết Booking kèm thông điệp *"Invoice data retrieved. PDF generation is not yet available."*
- **Hành động phía Client:** Nút "In hóa đơn" kích hoạt tải file JSON chi tiết hóa đơn hoặc kích hoạt `window.print()` trang chi tiết.

---

## 2. Các Kiểu Dữ Liệu TypeScript (Client Entities)

Phát triển dựa trên `src/types/booking.types.ts` và `src/types/entities.types.ts`:

- **BookingStatus:** `"pending" | "confirmed" | "cancelled" | "completed"`
- **PaymentStatus:** `"pending" | "success" | "failed" | "refunded" | "unpaid" | "partially_paid"`
- **PaymentMethod:** `"bank_transfer" | "credit_card" | "paypal" | "cash" | "momo" | "vnpay" | "zalopay"`

---

## 3. Khả Năng Khôi Phục & Hạ Cấp (Graceful Degradation Plan)

- **Passengers (Hành khách):** Không có route/model riêng. Dữ liệu chỉ đọc trực tiếp từ `customer_name`, `customer_email`, `customer_phone` trên Booking đại diện.
- **Timeline (Dòng thời gian):** Không có route `/timeline`. client sinh ra mốc thời gian động:
  - Mốc 1: Đặt tour (`booked_at`)
  - Mốc 2: Xác nhận (`confirmed_at` hoặc trạng thái `cancelled` -> Đã hủy (`cancelled_at`))
  - Mốc 3: Khởi hành (`travel_date` trong quá khứ hoặc tương lai)
  - Mốc 4: Hoàn thành (`completed_at` hoặc kiểm tra logic nếu đã đi qua)
