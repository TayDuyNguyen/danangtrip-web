# Data Integration Report: Tour Payment

## 1. Summary
- **Mục tiêu:** Tích hợp API để lấy thông tin thanh toán (polling status), lấy thông tin đơn hàng, và xử lý thử lại thanh toán.
- **Trạng thái (Verdict):** **READY**

## 2. API Hooks Đã Tích Hợp
- Khởi tạo file `src/features/payment/hooks/usePayment.ts` chứa toàn bộ logic tương tác với server State (thông qua TanStack Query v5).
- Các Custom Hooks:
  1. **`usePaymentStatus`**: Theo dõi `transaction_code` truyền qua URL. Tự động **Polling (3s/lần)** nếu trạng thái đang là `pending` hoặc `partially_paid`.
  2. **`useBookingForPayment`**: Lấy chi tiết đơn hàng thông qua `bookingCode` giúp giao diện `TransactionDetails` hiển thị chính xác tên, phương thức thanh toán và tổng tiền mà không cần chờ gateway.
  3. **`usePayment`**: Chứa Mutations (POST request) `retryPaymentMutation` giúp thực hiện tạo lại payment session, tự động chuyển hướng (`window.location.href = payment_url`).

## 3. UI/State Binding
- **`PaymentClient.tsx`** đã kết nối thành công:
  - Hiển thị UI Spinner (`<Loading />`) cho đến khi Booking hoặc Payment data sẵn sàng.
  - Derive `status` ưu tiên từ `paymentData` -> fallback sang `bookingData`.
  - Liên kết nút "Thử lại" với `retryPayment`. Nút tự động chuyển state và bị vô hiệu hóa khi quá trình gọi API đang diễn ra.

## 4. Rủi ro & Nhận xét
Flow thanh toán phụ thuộc hoàn toàn vào param `?transaction_code=` và `?booking_code=` trên URL. Việc này là chính xác với callback convention từ MoMo / VNPay.
Chuyển sang bước tiếp theo: **07. Interactions**.
