# Screen Analysis: Đặt lại mật khẩu (user-reset-password)

- **Feature Slug**: `user-reset-password`
- **Màn hình**: Đặt lại mật khẩu (Reset Password)
- **Actor chính**: Khách truy cập (Public Guest) có liên kết khôi phục nhận từ Email
- **Route UI**: `/reset-password` (hoặc `/[locale]/reset-password`)
- **API sử dụng**: `POST /auth/reset-password`

---

## 1. Summary & Scope

Màn hình này cho phép người dùng thiết lập mật khẩu mới sau khi đã click vào liên kết được gửi tới hòm thư cá nhân từ màn hình Quên mật khẩu.

**Mục tiêu**:
1. Đón nhận `token` và `email` từ URL Query Parameters khi người dùng chuyển tới từ hòm thư.
2. Kiểm tra tính hợp lệ sơ bộ của token.
3. Cho phép người dùng nhập mật khẩu mới và xác nhận mật khẩu mới.
4. Gửi yêu cầu cập nhật mật khẩu tới hệ thống backend.
5. Hiển thị thông báo kết quả trực quan và dẫn dắt người dùng đăng nhập lại an toàn.

---

## 2. Design & Token Audit

Dựa trên tài liệu [DESIGN.md](file:///d:/DATN/danangtrip-web/DESIGN.md) và phong cách thiết kế đã triển khai thành công tại `forgot-password-form.tsx`, giao diện màn hình sẽ áp dụng hệ thống token chuẩn hóa sau:

- **Bảng màu (Colors)**:
  - Nền trang (Background): `#080808` (Darkest Black) tạo chiều sâu cao cấp.
  - Mặt phẳng chứa form (Surface): `#080808` với hiệu ứng kính mờ (Glassmorphism), viền `1px solid #262626`.
  - Tông màu chủ đạo (Primary Accent): `#8B6A55` (Màu đồng Azure-gold) cho tiêu đề phụ, nút chính lúc hover, viền tập trung.
  - Phụ trợ (Secondary Accent): `#5C3822` (Màu đồng sẫm) cho nền hiệu ứng phát sáng.
  - Văn bản chính (Text Primary): `#737373` cho nhãn, tiêu đề phụ.
  - Văn bản phụ (Text Secondary): `#FFFFFF` cho nội dung chính, chữ trong nút.

- **Hiệu ứng & Chuyển động (Motion & Depth)**:
  - Thừa hưởng hiệu ứng viền phát sáng động bằng dải màu `conic-gradient` xoay tròn vô hạn bao quanh card form.
  - Sử dụng component `<AmbientBackground />` tạo các vùng sáng màu đồng huyền ảo khuếch tán phía sau form.
  - Áp dụng class `animate-reveal-up` khi màn hình được load lần đầu để tạo cảm giác trồi lên mượt mà (nhịp độ delay tăng dần 100ms).

- **Kiểu chữ (Typography)**:
  - Sử dụng phông chữ **Inter** làm phông chữ chính cho tiêu đề và các trường nhập liệu.
  - Cắt góc mềm mại (Corner Radii) theo chuẩn: nút bấm góc `9999px` (full rounded), hộp form `7px` hoặc `12px` tương thích phong cách tối giản.

---

## 3. Component Breakdown

Các thành phần giao diện được phân tách rõ ràng để tái sử dụng tối đa cấu trúc có sẵn:

| Thành phần | Loại | Cấp độ | Đường dẫn | Mục đích |
|---|---|---|---|---|
| `AmbientBackground` | [REUSE] | Atom | `src/components/layout/AmbientBackground.tsx` | Tạo nền khuếch tán màu đồng huyền ảo. |
| `Input` | [REUSE] | Atom | `src/components/ui/Input.tsx` (nếu có) | Hộp nhập liệu chuẩn hoá có nhãn, icon và viền hover màu đồng. |
| `IoMailOutline` | [REUSE] | Icon | `@/components/icons/solar` | Icon thư điện tử đại diện cho trường email. |
| `IoLockKeyholeOutline`| [REUSE] | Icon | `@/components/icons/solar` | Icon ổ khóa biểu thị cho mật khẩu mới. |
| `IoChevronBack` | [REUSE] | Icon | `@/components/icons/solar` | Nút quay lại trang Đăng nhập. |
| `CheckCircle2` | [REUSE] | Icon | `@/components/icons/solar` | Icon tích xanh hiển thị khi đổi mật khẩu thành công. |
| `ResetPasswordForm` | [NEW] | Organism | `src/features/auth/components/reset-password-form.tsx` | Biểu mẫu chính quản lý nhập liệu, validate và tương tác gọi API. |

---

## 4. Responsive & UI States

### Phân rã hiển thị theo kích thước thiết bị
- **Mobile (< 768px)**: Trải rộng full chiều ngang, ẩn đi tấm nền trang trí bên trái để dồn toàn bộ sự tập trung vào form nhập liệu. Tiêu đề thương hiệu hiển thị nhỏ gọn phía trên form.
- **Tablet & Desktop (>= 768px)**: Hiển thị giao diện 2 cột cân đối. Cột trái chứa banner màu đồng sẫm mượt mà tạo chiều sâu, cột phải chứa form nhập liệu chính.

### Đặc tả các trạng thái giao diện (UI States)

| Khu vực / Trạng thái | Đang tải (Loading) | Trống/Lỗi Token (Invalid Token) | Thành công (Success) |
|---|---|---|---|
| **Cột nhập liệu chính** | Vô hiệu hóa (disabled) các ô nhập liệu. Nút submit chuyển sang trạng thái loading với icon xoay tròn và văn bản `"Đang xử lý..."`. | Ẩn toàn bộ form nhập liệu. Thay thế bằng giao diện cảnh báo kính mờ: "Mã xác thực không hợp lệ", kèm icon cảnh báo và nút hành động "Yêu cầu liên kết mới" dẫn về `/forgot-password`. | Ẩn form nhập liệu. Hiển thị thẻ thông báo thành công rực rỡ với icon Check phát sáng, nội dung hướng dẫn đăng nhập và nút "Đăng nhập ngay" dẫn tới `/login`. |
| **Thông báo nhanh** | Không hiển thị | Hiển thị Toast thông báo lỗi chi tiết nhận được từ máy chủ. | Hiển thị Toast thông báo thành công. |

---

## 5. Data & API Mapping

- **API Endpoint**: `POST /auth/reset-password` (Qua `authService.resetPassword`)
- **Dữ liệu gửi lên (Payload Mapping)**:

| Field (Frontend) | Field (Backend API) | Kiểu dữ liệu | Bắt buộc | Mô tả |
|---|---|---|---|---|
| `token` | `token` | `string` | Có | Mã thông báo lấy trực tiếp từ URL query `?token=...` |
| `email` | `email` | `string` | Có | Email lấy từ URL query `?email=...` hoặc do người dùng nhập thủ công. |
| `password` | `password` | `string` | Có | Mật khẩu mới (Tối thiểu 8 ký tự, có chữ hoa, thường, số, ký tự đặc biệt). |
| `confirmPassword`| `password_confirmation` | `string` | Có | Chuỗi xác nhận mật khẩu (phải trùng khớp hoàn toàn với `password`). |

---

## 6. Business / Auth / i18n Review

### Business Rules & Edge Cases:
- **Token/Email rỗng**: Nếu URL truy cập không chứa `token`, lập tức chuyển form sang trạng thái `invalid_token` để chặn người dùng thao tác thừa.
- **Validate thời gian thực**: Khi người dùng rời con trỏ (onBlur) khỏi ô nhập mật khẩu hoặc ô xác nhận, kích hoạt validate bằng Zod schema để hiện cảnh báo lỗi tức thì, tránh đợi đến lúc submit.
- **Mật khẩu trùng lặp**: Xác thực hai mật khẩu khớp nhau ngay tại Client qua bộ lọc `.refine` của Zod.

### i18n & Localization Impact:
- Phải khai báo đầy đủ các văn bản hiển thị cho cả hai ngôn ngữ Tiếng Việt và Tiếng Anh.
- Sử dụng hook `useTranslations("resetPassword")` để dịch động toàn bộ nhãn, placeholder, tiêu đề và lỗi trên form.
- Đăng ký tĩnh namespace `"resetPassword"` trong tệp `src/i18n/request.ts` để tối ưu cho Edge Runtime.

### Phân tích rủi ro (Risk List):
1. **Rủi ro Edge Runtime**: Trình duyệt hoặc Workers chặn import động -> Giải quyết bằng cách cấu hình static import trong `request.ts`.
2. **Rủi ro Token giả mạo/hết hạn**: Gửi request lên API báo lỗi 400 hoặc 422 -> Tích hợp cơ chế đón lỗi bằng `getApiErrorMessage` và hiển thị toast, đồng thời gợi ý nút yêu cầu gửi lại link.
3. **Rủi ro Spam submit**: Người dùng bấm nút gửi liên tục khi mạng chậm -> Vô hiệu hóa nút bấm và hiển thị spinner xoay tròn khi trạng thái `isPending` của mutation là true.
