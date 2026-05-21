# Kế hoạch Định tuyến & Bố cục: Hóa đơn PDF (user-booking-invoice)

Tài liệu này đặc tả cách thức định tuyến và bảo mật đối với hành động tải hóa đơn PDF của đơn đặt tour.

---

## 1. Cấu trúc Route & Thư mục tích hợp

Đặc tả yêu cầu ghi nhận **không có giao diện trang riêng** cho hóa đơn PDF. Thay vào đó, hành động in hóa đơn được tích hợp trực tiếp dưới dạng nút tương tác trên các giao diện chi tiết đơn đặt tour hiện tại:
- **Trang Chi tiết bằng ID:**
  - Route: `/bookings/{id}`
  - File: `src/app/[locale]/(main)/(protected)/bookings/[id]/page.tsx`
- **Trang Chi tiết bằng Mã đơn đặt:**
  - Route: `/bookings/code/{bookingCode}`
  - File: `src/app/[locale]/(main)/(protected)/bookings/code/[bookingCode]/page.tsx`

Cả hai trang này đều sử dụng chung thành phần giao diện client `BookingDetailClient` nằm trong `src/features/tour/components/BookingDetailClient.tsx`.

---

## 2. Bảo mật Tuyến đường (Auth & Route Protection)

### 2.1 Middleware Bảo vệ ở Client:
- Vì cả hai trang chi tiết đơn đặt đều nằm trong nhóm thư mục `(protected)` (tức là `src/app/[locale]/(main)/(protected)`), chúng được tự động bảo vệ bởi Next.js Middleware của dự án.
- Khách vãng lai truy cập trực tiếp vào các tuyến đường này sẽ bị chặn và điều hướng về trang đăng nhập `/login`.

### 2.2 Bảo vệ tại Service:
- Yêu cầu API tải hóa đơn `GET /user/bookings/{id}/invoice` được gửi qua `axiosInstance` đã cấu hình để tự động gắn kèm Token Bearer của người dùng hiện tại.
- Backend (`BookingController@invoice`) sẽ thực hiện kiểm tra quyền sở hữu đơn đặt tour (`booking.user_id === auth.id`). Nếu người dùng cố gắng tải hóa đơn của một đơn hàng mà họ không sở hữu, backend sẽ trả về lỗi `403 Forbidden` hoặc `401 Unauthorized` và client sẽ bắt lỗi, hiển thị Toast cảnh báo hoặc điều hướng về `/login`.
