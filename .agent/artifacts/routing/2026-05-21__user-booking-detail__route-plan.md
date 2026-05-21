# Kế hoạch Định tuyến & Bố cục: Chi tiết Đơn đặt tour (user-booking-detail)

Tài liệu này xác định cách thức định tuyến, bảo mật bằng Middleware và cấu trúc trang Server Component để tải chi tiết đơn đặt tour.

---

## 1. Cấu trúc Route & Thư mục
Route mục tiêu: `/bookings/[id]`
Địa điểm file: `src/app/[locale]/(main)/(protected)/bookings/[id]/page.tsx`

---

## 2. Server Component Page Shell
Mã nguồn Server Component sẽ đảm nhận:
1. Nhận `params` bất đồng bộ (chứa `locale` và `id` của đơn hàng).
2. Gọi `setRequestLocale(locale)` để Next-intl định cấu hình ngôn ngữ hiển thị phía máy chủ.
3. Tạo metadata động chứa ID đơn hàng để SEO hiển thị tối ưu (ví dụ: `Chi tiết đơn hàng #15 | DanangTrip`).
4. Bọc Client Component `BookingDetailClient` và truyền ID đơn đặt tour vào đó.

---

## 3. Middleware & Bảo mật (Auth / Route Protection)
- Vì route nằm trong nhóm thư mục `(protected)` của App Router (tức là `src/app/[locale]/(main)/(protected)`), nó thừa hưởng middleware xác thực từ dự án.
- Mọi truy cập chưa đăng nhập sẽ bị tự động chuyển hướng về `/login`.
- Frontend gửi Token người dùng hiện tại lên API backend. Backend (`BookingController@show`) kiểm tra quyền sở hữu `booking.user_id === auth.id` để đảm bảo bảo mật dữ liệu cấp độ DB.
