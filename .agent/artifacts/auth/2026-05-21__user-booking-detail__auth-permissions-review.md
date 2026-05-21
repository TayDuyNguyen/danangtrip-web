# Đánh giá Bảo mật & Quyền truy cập: Chi tiết Đơn đặt tour (user-booking-detail)

Tài liệu này đánh giá cách thức bảo vệ tuyến đường (route protection) và cơ chế phân quyền bảo mật dữ liệu lớp API cho màn hình chi tiết đơn đặt tour.

---

## 1. Bảo vệ Tuyến đường phía Client (Route Guard & Middleware)

- **Cấu trúc thư mục:** Route nằm tại thư mục `src/app/[locale]/(main)/(protected)/bookings/[id]`.
- **Cơ chế hoạt động:**
  - Do nằm dưới nhóm thư mục route group `(protected)`, route này tự động kế thừa và chịu sự kiểm soát của Middleware xác thực dự án.
  - Khi người dùng chưa đăng nhập cố gắng truy cập trực tiếp URL `/bookings/15` hoặc `/vi/bookings/15`:
    - Middleware sẽ chặn request từ phía máy chủ Next.js.
    - Tự động chuyển hướng (Redirect) người dùng về trang đăng nhập `/login` kèm tham số lưu trữ URL đích (như `/login?redirect=/bookings/15`) để chuyển hướng lại sau khi đăng nhập thành công.

---

## 2. Xác thực và Bảo mật Lớp API (Backend Authorization Audit)

Mặc dù Client đã bảo vệ tuyến đường, bảo mật dữ liệu cốt lõi được thực thi chặt chẽ ở backend (`danangtrip-api`) để tránh lỗ hổng IDOR (Insecure Direct Object Reference):

- **Đính kèm Token tự động:**
  - Client sử dụng `axiosInstance` để gửi các yêu cầu API chi tiết đơn hàng (`GET /user/bookings/{id}`).
  - Axios interceptors tự động đính kèm Token JWT của người dùng hiện tại vào header `Authorization: Bearer <token>`.
- **Kiểm soát quyền sở hữu phía Backend (`BookingController.php`):**
  - Khi nhận request `GET /user/bookings/{id}`, backend tiến hành:
    1. Xác thực danh tính người dùng thông qua Token.
    2. Tải đơn hàng từ DB theo `{id}`.
    3. Thực hiện kiểm tra điều kiện sở hữu:
       ```php
       if ($booking->user_id !== auth()->id()) {
           return response()->json([
               'success' => false,
               'message' => 'Unauthorized action.'
           ], 403);
       }
       ```
    4. Trả về mã lỗi `403 Forbidden` nếu người dùng đăng nhập cố tình thay đổi số ID trên URL để xem lén đơn hàng của người khác.

---

## 3. Khôi phục Trạng thái khi Hết hạn Phiên (Session Expiry Recovery)

- Nếu phiên đăng nhập của người dùng hết hạn trong lúc đang xem trang chi tiết:
  - Bất kỳ tương tác nào (ví dụ bấm "Hủy đơn hàng") gửi yêu cầu lên API sẽ nhận về lỗi `401 Unauthorized` từ Axios.
  - Hệ thống tự động kích hoạt tiến trình refresh token. Nếu refresh thất bại, người dùng sẽ được đưa về trang đăng nhập, bảo vệ an toàn thông tin tài khoản.
