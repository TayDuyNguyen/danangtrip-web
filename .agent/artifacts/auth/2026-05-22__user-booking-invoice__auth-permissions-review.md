# Đánh giá Bảo mật & Quyền truy cập: Hóa đơn PDF (user-booking-invoice)

Tài liệu này đánh giá tính bảo mật, xác thực người dùng và cơ chế kiểm soát quyền hạn đối với tính năng tải hóa đơn PDF của đơn đặt tour.

---

## 1. Xác thực Tuyến đường (Route Protection)

### 1.1 Nhóm trang được Bảo vệ (Protected Routes)
Tất cả các trang hiển thị chi tiết đơn hàng đều nằm trong nhóm thư mục `src/app/[locale]/(main)/(protected)/bookings/...`.
- **Cơ chế hoạt động:** Next.js Middleware kiểm tra sự tồn tại của Token truy cập trong cookie.
- **Xử lý:** Khách chưa đăng nhập sẽ bị chặn truy cập và chuyển hướng tức thời về `/login`.

---

## 2. Bảo mật Gọi API (Bearer Token Authorization)

### 2.1 Tự động đính kèm Token
Mọi yêu cầu gửi tới server thông qua `axiosInstance` đều được đi qua interceptor yêu cầu để đính kèm Token Bearer tự động:
```typescript
const token = getAccessToken();
if (token) {
  axiosConfig.headers.Authorization = `Bearer ${token}`;
}
```

### 2.2 Xử lý Hết hạn Phiên (Session Expiry & 401 Unauthorized)
Khi Token hết hạn hoặc không hợp lệ, API trả về `401 Unauthorized`.
- **Phía Axios Interceptor:** Tự động bắt lỗi 401, gọi hàm `handleLogout()` để xóa cookie, dọn dẹp trạng thái `authStore`, và chuyển hướng trình duyệt về `/login`.
- **Phía UI Component:** Nếu có lỗi 401 lọt qua hoặc xảy ra trong lúc gọi dịch vụ, component sẽ chủ động bắt lỗi và điều hướng về trang đăng nhập bằng:
  ```typescript
  if (err?.status === 401) {
    router.push("/login");
    return;
  }
  ```

---

## 3. Kiểm soát Quyền truy cập từ Máy chủ (Server-side Ownership Check)

Mặc dù Client đã gửi đúng Token Bearer, máy chủ (`BookingController@invoice`) bắt buộc phải thực hiện kiểm tra quyền sở hữu đối với hóa đơn cần tải:
- **Nguyên tắc:** Một người dùng chỉ được phép tải hóa đơn của chính các đơn hàng mà họ đã đặt (`booking.user_id === authenticated_user.id`).
- **Ngăn chặn:** Ngăn chặn tấn công IDOR (Insecure Direct Object Reference) khi kẻ tấn công cố tình thay đổi `booking.id` trên URL để tải hóa đơn của người khác. Nếu phát hiện vi phạm, máy chủ trả về `403 Forbidden` và client hiển thị cảnh báo tương ứng.
