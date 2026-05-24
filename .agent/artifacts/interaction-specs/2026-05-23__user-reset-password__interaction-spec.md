# Interaction Spec: Đặt lại mật khẩu (user-reset-password)

- **Feature Slug**: `user-reset-password`
- **Mảng tương tác**: Sự kiện nhập liệu, Validation thời gian thực, Focus control và Toast notification.
- **Trạng thái**: **Đã hoàn thành thi công tương tác**

---

## 1. Real-time Field Validation (Xác thực dữ liệu thời gian thực)

Để đảm bảo người dùng nhập đúng định dạng ngay từ đầu, hệ thống áp dụng cơ chế kiểm duyệt 2 lớp:

1. **Kiểm duyệt khi rời ô nhập liệu (Blur Validation)**:
   - Khi người dùng rời con trỏ (`onBlur`) khỏi bất kỳ ô nhập liệu nào (Email, Mật khẩu, Xác nhận), hệ thống tự động chạy `resetPasswordSchema.safeParse` cho giá trị hiện tại.
   - Nếu phát hiện lỗi định dạng (ví dụ: email sai cú pháp, mật khẩu thiếu chữ viết hoa, mật khẩu xác nhận không khớp), hệ thống hiển thị thông báo lỗi màu đỏ trực quan bên dưới trường đó ngay lập tức mà không cần đợi bấm Submit.
   - Khi người dùng gõ thay đổi giá trị (`onChange`), nếu ô nhập liệu đó đang có lỗi và giá trị mới gõ đã thoả mãn điều kiện Zod, hệ thống sẽ tự động xóa thông báo lỗi đỏ đó đi để tạo cảm giác phản hồi nhanh nhạy.

2. **Kiểm duyệt cứng trước khi gửi (Submit Validation)**:
   - Khi người dùng nhấn nút Submit hoặc ấn phím `Enter` trong form, hệ thống kích hoạt chạy kiểm duyệt toàn bộ biểu mẫu.
   - Nếu có bất kỳ trường nào vi phạm điều kiện Zod, hệ thống sẽ chặn cuộc gọi API, hiển thị các thông báo lỗi đỏ dưới từng trường vi phạm, đồng thời bắn ra một Toast thông báo lỗi chung `"failure.general_error"` để nhắc nhở người dùng rà soát lại thông tin.

---

## 2. Interactive Focus Management (Quản lý Tập trung Con trỏ)

Chúng ta tích hợp hook dùng chung `useFieldFocus` để quản lý tập trung:
- Trạng thái `isFocused("email" | "password" | "confirmPassword")` được kích hoạt tương ứng khi người dùng trỏ chuột hoặc tab vào ô nhập liệu đó.
- Các ô nhập liệu có phong cách kính mờ sẽ tự động chuyển màu đường viền sang tông màu đồng sáng `#8B6A55` khi được focus, tăng cường khả năng định vị trực quan cho người dùng.

---

## 3. Keyboard & Control Interactions (Hành vi phím & Nút bấm)

- **Enter-to-submit**: Các ô nhập liệu đều nằm trong thẻ `<form>`, cho phép người dùng nhấn phím `Enter` tại bất kỳ ô nhập liệu nào để kích hoạt sự kiện `onSubmit` của biểu mẫu, mang lại cảm giác nhập liệu tự nhiên và liền mạch.
- **Password Visibility Toggle**: Tái sử dụng tính năng ẩn/hiện mật khẩu thông qua prop `isPassword` của component `<Input />`, cho phép người dùng click vào biểu tượng con mắt ở góc phải để kiểm tra mật khẩu đã gõ chính xác chưa, giảm thiểu tỷ lệ gõ sai.
- **Toast Notifications**: Sử dụng thư viện `sonner` để bắn các thông báo nổi trực quan:
  - Báo thành công đổi mật khẩu.
  - Báo thất bại kèm lý do chi tiết từ backend (ví dụ: "Mã xác thực đã hết hạn").
