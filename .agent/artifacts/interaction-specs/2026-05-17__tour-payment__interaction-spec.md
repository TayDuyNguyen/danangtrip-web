# Interaction Specification: Tour Payment

This specification details the user flows, form rules, URL synchronizations, modal triggers, and toast feedback for the **Tour Payment / Checkout Screen** in `danangtrip-web` (Screen: `Thanh toán / Kết quả đặt tour`).

---

## 1. Main Action Flows

### Flow A: Automatic URL Extraction & Initialization
- **Triggers:** Khi người dùng truy cập trang `/payment?booking_code=xxx&transaction_code=yyy` hoặc `/payment?booking_code=xxx`.
- **Interactions:**
  - `PaymentClient` sẽ đọc các tham số `booking_code` và `transaction_code` trên thanh địa chỉ bằng `useSearchParams()`.
  - Hiển thị màn hình chờ `Loading` trong khi fetching thông tin đơn hàng và trạng thái thanh toán.

### Flow B: Circular Polling (Thăm dò trạng thái)
- **Triggers:** Khi có tham số `transaction_code` trong URL search params.
- **Interactions:**
  - TanStack Query hook `usePaymentStatus` tự động gửi request đến server mỗi **3 giây** (3000ms).
  - Component [PaymentStatusCard](file:///d:/DATN/danangtrip-web/src/features/payment/components/PaymentStatusCard.tsx) hiển thị trạng thái chờ: `"Đang chờ thanh toán"`.
  - Khi API trả về trạng thái `"success"` hoặc `"failed"`, bộ đếm tự động ngừng polling và cập nhật giao diện thành công hoặc thất bại tương ứng.

### Flow C: Thử lại thanh toán (Retry Checkout Session)
- **Triggers:** Người dùng click nút "Thử lại thanh toán" trong panel [PaymentRetryPanel](file:///d:/DATN/danangtrip-web/src/features/payment/components/PaymentRetryPanel.tsx).
- **Interactions:**
  - Trạng thái nút chuyển sang `"Đang chuyển hướng đến cổng thanh toán..."` kèm vòng tròn xoay tròn (loading indicator) để người dùng biết hành động đang được xử lý.
  - Disable nút bấm để tránh tình trạng người dùng click nhiều lần (double submit).
  - Khi có `payment_url` mới từ server, tự động chuyển hướng trình duyệt (`window.location.href`) sang cổng thanh toán của đối tác (Momo/VNPay).

---

## 2. Forms & Client Validation

Do đặc thù trang kết quả thanh toán không có các biểu mẫu (Forms) nhập liệu phức tạp, hành vi validation tập trung chủ yếu vào **Thời gian hết hạn phiên giao dịch**:
- **Logic Kiểm Tra Hết Hạn:**
  - [PaymentRetryPanel](file:///d:/DATN/danangtrip-web/src/features/payment/components/PaymentRetryPanel.tsx) liên tục tính chênh lệch giữa thời gian thực tế hiện tại và `booked_at + 15 phút`.
  - Khi chênh lệch bằng 0 (quá 15 phút):
    - Ẩn đồng hồ đếm ngược.
    - Tự động thay đổi dòng trạng thái thành cảnh báo màu đỏ: `"Phiên thanh toán đã quá 15 phút. Vui lòng tạo giao dịch mới."`.
    - Khóa (Disable) nút "Thử lại thanh toán".

---

## 3. URL State Synchronization

| State Parameter | Sync to URL | Purpose / Behavior |
|:---|:---|:---|
| `booking_code` | **Yes** | Định danh đơn hàng để hiển thị thông tin chi tiết. Khi thay đổi sẽ kích hoạt truy vấn `useBookingForPayment`. |
| `transaction_code` | **Yes** | Định danh phiên thanh toán của cổng đối tác để polling trạng thái thành công/thất bại. |

---

## 4. Destructive Actions & Confirm Dialogs

- **Hủy Giao Dịch / Quay Lại Trang Chủ:**
  - Nút "Hủy giao dịch" dẫn người dùng về trang chủ để hủy checkout session. Hành động này không phá hủy (Delete) booking trực tiếp trên database nhưng sẽ hủy phiên thanh toán hiện tại.
  - Do là link điều hướng (`Link` từ `next-intl`), hành động chuyển hướng mượt mà trong 150ms mà không gây giật lag trang.

---

## 5. i18n Impact

Các bản dịch tiếng Anh & tiếng Việt đều được tích hợp đầy đủ qua tệp dịch thuật tập trung `tour.json` ở key `"payment"`:
*   [tour.json (vi)](file:///d:/DATN/danangtrip-web/src/messages/vi/tour.json)
*   [tour.json (en)](file:///d:/DATN/danangtrip-web/src/messages/en/tour.json)
*   Không sử dụng bất kỳ chuỗi text hardcode nào trong JSX để đảm bảo hỗ trợ dịch thuật hoàn hảo.
