# UI Spec: Đặt lại mật khẩu (user-reset-password)

- **Feature Slug**: `user-reset-password`
- **Giao diện**: Form đặt lại mật khẩu với phong cách Kính mờ (Glassmorphism) màu đồng sang trọng.
- **Trạng thái**: **Đã hoàn thành thi công giao diện**

---

## 1. Visual Layout & Structure (Cấu trúc giao diện)

Giao diện được thiết kế với cấu trúc 2 cột linh hoạt (2-column layout), tự động điều chỉnh theo kích thước màn hình để tối ưu hóa trải nghiệm người dùng (Responsive):

```text
+-----------------------------------------------------------------------+
|                         AMBIENT BACKGROUNDS                           |
|  +-----------------------------------------------------------------+  |
|  | Conic-gradient Spinning Border Edge                             |  |
|  |  +------------------------+----------------------------------+  |  |
|  |  | Left Banner (Hidden    | Right Panel (Form content)       |  |  |
|  |  | on Mobile)             |                                  |  |  |
|  |  |                        |  - Mobile Brand logo             |  |  |
|  |  | - Title: Đặt mật       |  - Form Title & Subtitle         |  |  |
|  |  |   khẩu mới             |  - Input: Email                  |  |  |
|  |  | - Desc: Đảm bảo mật    |  - Input: Mật khẩu mới           |  |  |
|  |  |   khẩu mới mạnh mẽ...  |  - Input: Xác nhận mật khẩu      |  |  |
|  |  |                        |  - Button: Xác nhận đổi mật khẩu |  |  |
|  |  |                        |  - Link: Quay lại Đăng nhập      |  |  |
|  |  +------------------------+----------------------------------+  |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
```

---

## 2. Design Tokens Applied (Áp dụng các Token thiết kế chuẩn)

- **Layout Grid**: Sử dụng hệ thống flexbox và CSS Grid chia đôi màn hình trên desktop.
- **Gradients**:
  - Tấm nền trái sử dụng gradient màu từ đồng sẫm sang đen tuyền (`bg-linear-to-br from-[#5c3822] to-[#080808]`) kết hợp cắt chéo góc độc đáo (`clip-path`).
  - Viền phát sáng chạy hiệu ứng xoay tròn bằng dải gradient hình nón màu đồng (`conic-gradient`).
- **Glassmorphism**: Mặt phẳng chứa form sử dụng màu nền trung tính `#080808` với viền `#262626`, đổ bóng nhẹ `shadow-[0_0_40px_rgba(139,106,85,0.12)]` để nổi bật trên nền các đám mây khuếch tán màu đồng sinh ra từ `<AmbientBackground />`.
- **Typography & Inputs**:
  - Tiêu đề chữ hoa sang trọng (`uppercase tracking-wide`).
  - Các ô nhập dữ liệu có icon chỉ dẫn trực quan (`IoMailOutline`, `IoLockClosedOutline`).
  - Cung cấp nút hiển thị/ẩn mật khẩu tích hợp sẵn trong component `<Input isPassword />`.

---

## 3. High-Fidelity UI States (Các trạng thái giao diện chi tiết)

Chúng tôi đã thi công đầy đủ 3 trạng thái giao diện độc lập để nâng cao trải nghiệm khách hàng:

### Trạng thái A: Biểu mẫu nhập liệu (Form Entry Screen)
- Biểu thị form đầy đủ với 3 trường nhập liệu: Email, Mật khẩu mới và Xác nhận mật khẩu.
- Nút submit hiển thị nhãn `"Xác nhận đổi mật khẩu"`. Khi đang gửi API, nút chuyển sang disabled, hiển thị spinner xoay tròn và nhãn `"Đang xử lý..."`.

### Trạng thái B: Thay đổi thành công (Success Screen)
- Khi API trả về kết quả thành công, hệ thống ẩn toàn bộ form bằng hiệu ứng mờ dần mượt mà (`animate-fade-in`).
- Thay thế bằng thẻ thông báo thành công rực rỡ, chứa biểu tượng tích xanh màu đồng có hiệu ứng phát xung (`CheckCircle2` + `animate-pulse`), tiêu đề `"Đặt lại thành công!"`, lời nhắn chúc mừng và nút chính nổi bật `"Đăng nhập ngay"` đưa người dùng về `/login`.

### Trạng thái C: Mã khôi phục không hợp lệ (Invalid Token Screen)
- Nếu người dùng truy cập trang `/reset-password` nhưng thiếu tham số `token` trên URL, hệ thống sẽ chặn hiển thị form và chuyển ngay sang giao diện cảnh báo kính mờ.
- Hiển thị icon cảnh báo màu đỏ phát xung, tiêu đề `"Mã xác thực không hợp lệ"`, lời nhắn hướng dẫn và nút nổi bật `"Yêu cầu liên kết mới"` dẫn tới `/forgot-password` để bắt đầu lại luồng khôi phục một cách an toàn.
