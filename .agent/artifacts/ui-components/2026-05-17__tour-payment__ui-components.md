# UI Components Report: Tour Payment

## 1. Summary
- **Mục tiêu:** Xây dựng các UI Components (Presentational) cho trang Payment, áp dụng chuẩn thiết kế (DESIGN.md) và i18n.
- **Trạng thái (Verdict):** **READY**

## 2. Các Components Đã Xây Dựng
Tất cả các Component được đặt trong `src/features/payment/components/`:

1. **`PaymentStatusCard`:**
   - Nhiệm vụ: Hiển thị icon tương ứng với trạng thái giao dịch (`pending`, `success`, `failed`, `redirecting`) cùng vòng xoay (spinner) cho các trạng thái chờ.
   - Design: Sử dụng chuẩn glassmorphism (`bg-xxx/10`, `border-xxx/20`) khớp với màu sắc của Tailwind v4 được định nghĩa trước.
2. **`TransactionDetails`:**
   - Nhiệm vụ: Hiển thị block thông tin giao dịch (Mã đơn, Số tiền, Phương thức thanh toán).
   - Design: Container bo góc, nền `bg-[#1a1a1a]` và border `#262626`. Tiền tệ hiển thị dạng primary color (`#8b6a55`).
3. **`PaymentClient` (Container Component):**
   - Nhiệm vụ: Bọc tất cả các child UI components, nhận parameters (transaction code, booking id) và quản lý state. (State mock đã được set up chờ API thật ở bước 06).
   - Render hệ thống buttons (Thử lại, Hủy, Xem đơn hàng) dựa trên trạng thái (status).
4. **`PaymentPage`:**
   - Bọc `PaymentClient` trong thẻ `<Suspense>` để hỗ trợ Client Component gọi `useSearchParams`.

## 3. Rủi ro & Kết luận
Không có rủi ro về mặt UI, giao diện đã responsive tốt trên mobile.
Chuyển sang bước tiếp theo: **06. Data Integration**.
