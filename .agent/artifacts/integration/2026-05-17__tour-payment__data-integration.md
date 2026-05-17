# Data Integration Specification: Tour Payment

This specification details how data flows from the backend API services into the TanStack Query hook layers, and finally hydrates the UI components for the **Tour Payment / Checkout Screen** in `danangtrip-web` (Screen: `Thanh toán / Kết quả đặt tour`).

---

## 1. Data Sources Breakdown

| Service Method | API Endpoint | HTTP Method | Server / Client Ownership | Rationale / Purpose |
|:---|:---|:---|:---|:---|
| `bookingService.detailByCode` | `/bookings/detail-by-code/{code}` | `GET` | **Client (useQuery)** | Lấy thông tin đặt tour (tên, số tiền, ngày đi) động dựa trên `booking_code` trong URL search params. |
| `paymentService.status` | `/payments/status/{transaction_code}` | `GET` | **Client (useQuery)** | Lấy trạng thái xử lý thanh toán từ cổng thanh toán đối tác (Momo/Vnpay) thông qua `transaction_code`. |
| `paymentService.create` | `/payments/create` | `POST` | **Client (useMutation)** | Khởi tạo phiên thanh toán mới cho booking và lấy liên kết `payment_url` để chuyển hướng. |
| `paymentService.retry` | `/payments/retry/{booking_code}` | `POST` | **Client (useMutation)** | Yêu cầu tạo lại/thử lại link thanh toán mới nếu giao dịch trước bị lỗi hoặc hết hạn. |

---

## 2. Query Strategy

### A. Booking Detail Query
- **Hook Name:** `useBookingForPayment`
- **Query Key:** `["bookings", "detail", bookingCode]`
- **Dependency / Enabled:** `!!bookingCode` (Chỉ kích hoạt khi trên URL có tham số `booking_code`).
- **Caching Spec:**
  - `staleTime`: Default (`0ms` vì thông tin thanh toán cần chính xác tuyệt đối, tránh caching dữ liệu cũ).

### B. Payment Status Query (Polling)
- **Hook Name:** `usePaymentStatus`
- **Query Key:** `["payment", "status", transactionCode]`
- **Dependency / Enabled:** `!!transactionCode` (Chỉ kích hoạt khi trên URL có tham số `transaction_code` trả về từ redirect gateway).
- **Circular Polling Logic:**
  - `refetchInterval`: Nếu trạng thái trả về là `"pending"` hoặc `"partially_paid"`, tự động gửi lại query sau **3 giây** (3000ms) để cập nhật trạng thái thanh toán real-time từ server.
  - Tắt tự động polling khi trạng thái chuyển sang `"success"` hoặc `"failed"`.
  - `refetchIntervalInBackground: true` giúp tiến trình tiếp tục chạy kể cả khi người dùng chuyển tab.

---

## 3. Mutation Strategy

### A. Retry Payment Mutation
- **Hook Name:** `usePayment` -> `retryPayment`
- **Trigger:** Người dùng click nút "Thử lại thanh toán" trong component `PaymentRetryPanel`.
- **Success Handler:**
  - Tự động chuyển hướng trình duyệt (`window.location.href`) sang liên kết `payment_url` trả về từ backend gateway.
- **Error Handler:**
  - Hiển thị Toast thông báo lỗi tiếng Việt thân thiện: `"Thử lại thanh toán thất bại."` thông qua thư viện `sonner`.

---

## 4. UI State Handling per Section

### A. Loading State (Skeleton / Spinner)
- Khi `isPaymentLoading || isBookingLoading` bằng `true`:
  - Component [PaymentClient](file:///d:/DATN/danangtrip-web/src/features/payment/components/PaymentClient.tsx) sẽ hiển thị màn hình chờ [Loading](file:///d:/DATN/danangtrip-web/src/components/ui/loading.tsx) để giữ bố cục trang ổn định, tránh tình trạng Layout Shift gây khó chịu (CLS).

### B. Expiry & Timeout State (Local State)
- Bộ đếm ngược của [PaymentRetryPanel](file:///d:/DATN/danangtrip-web/src/features/payment/components/PaymentRetryPanel.tsx) tự động tính toán thời gian hết hạn sau **15 phút** kể từ thời điểm `booked_at`.
- Khi hết hạn:
  - Khóa (Disable) nút "Thử lại thanh toán".
  - Hiển thị thông báo màu đỏ: `"Phiên thanh toán đã quá 15 phút. Vui lòng tạo giao dịch mới."`.

### C. Error States
- Nếu API ném ra lỗi hoặc không tìm thấy booking:
  - TanStack Query hooks sẽ bắt lỗi và hiển thị các cảnh báo Toast cụ thể qua thư viện `toast`.

---

## 5. Files Involved in Data Integration

- [usePayment.ts](file:///d:/DATN/danangtrip-web/src/features/payment/hooks/usePayment.ts) (Hooks Layer)
- [PaymentClient.tsx](file:///d:/DATN/danangtrip-web/src/features/payment/components/PaymentClient.tsx) (UI Controller Layer)
- [PaymentRetryPanel.tsx](file:///d:/DATN/danangtrip-web/src/features/payment/components/PaymentRetryPanel.tsx) (UI Presentational Layer)
