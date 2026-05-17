# Types & API Contract Report: Tour Payment

## 1. Summary
- **Mục tiêu:** Kiểm tra và định nghĩa các Type/Interfaces, API Services cần thiết cho màn hình Thanh toán (Payment).
- **Trạng thái (Verdict):** **READY / FULLY IMPLEMENTED**

## 2. API Contract & Mappings

Dựa trên tài liệu `api_list.md`, toàn bộ các endpoint cần thiết cho luồng Payment đã được backend thiết kế và hỗ trợ:

### Queries & Data Fetching
- `GET /user/bookings/code/{booking_code}`: Lấy chi tiết đơn hàng dựa vào mã đơn (booking_code), phục vụ render phần tử `RedirectCountdown` hoặc `PaymentSuccessCard`.
- `GET /payments/status/{transaction_code}`: API Polling để tra cứu trạng thái giao dịch thực tế của MoMo/VNPay/ZaloPay.

### Mutations & Actions
- `POST /payments/create`: Khởi tạo thanh toán, backend trả về URL (`payment_url`) để frontend thực hiện redirect.
- `POST /payments/retry/{booking_code}`: Thử lại thanh toán với booking đang bị pending/failed (nhưng chưa quá hạn).
- `POST /user/bookings/{id}/cancel`: Người dùng chủ động hủy bỏ booking nếu thanh toán lỗi.

## 3. Frontend Implementation Check

Kiểm tra trực tiếp source code hiện tại:

- **Các types đã khai báo chuẩn xác:**
  - `CreatePaymentPayload` (thuộc `src/types/payment.types.ts`)
  - `Payment` và `PaymentCreateResult` (thuộc `src/types/payment.types.ts`)
  - `Booking` và `CancelBookingPayload` (thuộc `src/types/booking.types.ts`)
- **API Services đã map thành công:**
  - `paymentService.create`
  - `paymentService.status`
  - `paymentService.retry`
  - `bookingService.detailByCode`
  - `bookingService.cancel`
- **Config Endpoints:** Các hàm sinh URL trong `src/config/api.ts` đều chính xác với tài liệu.

## 4. Rủi ro & Kết luận
Không có rủi ro nào ở tầng dữ liệu và Service. Mọi Zod schemas (nếu cần thiết cho form) hoặc fetch calls đều có đủ dữ kiện để hoạt động.
Chuyển sang bước tiếp theo: **04. Layout & Routing**.
