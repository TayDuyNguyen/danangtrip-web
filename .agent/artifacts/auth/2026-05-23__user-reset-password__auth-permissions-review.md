# Auth & Permissions Review: Đặt lại mật khẩu (user-reset-password)

- **Feature Slug**: `user-reset-password`
- **Route UI**: `/reset-password`
- **Cơ chế phân quyền**: **Khách vãng lai (Public Guest) có token email hợp lệ**
- **Trạng thái**: **Đã hoàn thành kiểm soát phân quyền an toàn**

---

## 1. Edge Middleware Route Policies (Bộ lọc định tuyến ở Edge)

Hoạt động định tuyến đã được tích hợp chặt chẽ với bộ Edge Middleware (`src/middleware.ts`):

- **Kịch bản A: Người dùng đã đăng nhập (Authenticated User)**:
  - Nếu người dùng đã đăng nhập (có cookie `token` hợp lệ) cố tình truy cập vào `/reset-password`, Edge Middleware sẽ intercept yêu cầu ở lớp mạng đầu tiên và thực hiện redirect (mã trạng thái 307) về trang chủ `/` (hoặc `/en`).
  - **Lý do**: Người dùng đã đăng nhập hoàn toàn có thể đổi mật khẩu qua trang cá nhân bảo mật `/profile/password`. Trang khôi phục mật khẩu ở ngoài màn hình đăng nhập chỉ dành cho người dùng bị mất quyền truy cập tài khoản.

- **Kịch bản B: Khách vãng lai chưa đăng nhập (Guest)**:
  - Nếu không phát hiện cookie `token`, Edge Middleware sẽ cho phép tiếp tục đi qua để truy cập vào `/reset-password` bình thường.
  - **Lý do**: Đây là luồng khôi phục công cộng (Public Auth Flow).

---

## 2. API Level Security Constraints (Bảo mật tầng API)

- **Không yêu cầu Bearer Token**: API `POST /auth/reset-password` được thiết kế hoàn toàn public trên backend Laravel, không yêu cầu header `Authorization: Bearer <token>` của phiên đăng nhập.
- **Ràng buộc an toàn bằng Email + Token**: Backend Laravel thực hiện so khớp mã xác thực `token` với địa chỉ `email` và thời gian khởi tạo trong bảng lưu trữ khôi phục mật khẩu (`password_resets`) trước khi cho phép thay đổi cơ sở dữ liệu.
- **Không xảy ra rò rỉ phiên**: Việc đặt lại mật khẩu thành công không tự động sinh ra token đăng nhập. Người dùng bắt buộc phải quay lại trang `/login` để đăng nhập thủ công bằng mật khẩu mới, đảm bảo phiên hoạt động được kiểm soát minh bạch.

---

## 3. Flow Verification Matrix (Ma trận kiểm duyệt luồng)

| Đối tượng | Trạng thái Token URL | Cookie Token | Hành vi mong đợi | Kết quả kiểm duyệt |
|---|---|---|---|---|
| Khách vãng lai | Đầy đủ (`?token=XYZ&email=a@b.c`) | Không có | Cho phép đi qua, render Form đặt lại mật khẩu với Email điền sẵn. | **ĐẠT** |
| Khách vãng lai | Thiếu (`?token=`) | Không có | Cho phép đi qua, nhưng hiển thị Card thông báo lỗi "Mã xác thực không hợp lệ", chặn render form. | **ĐẠT** |
| Người dùng đã đăng nhập | Bất kỳ | Có | Edge Middleware tự động chặn và chuyển hướng về trang chủ `/`. | **ĐẠT** |

Cơ chế phân quyền của màn hình `/reset-password` đã hoàn toàn an toàn và khép kín!
