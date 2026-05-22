# Phân tích Giao diện: Đổi mật khẩu (user-profile-password)

- **Feature Slug:** `user-profile-password`
- **Ngày thực hiện:** 2026-05-22
- **Nguồn tài liệu:**
  - [user_profile_password.md](file:///D:/DATN/DATN_Tài%20liệu/docs/page/user_profile_password.md) (Tài liệu đặc tả nghiệp vụ)
  - [user_profile.md](file:///D:/DATN/DATN_Tài%20liệu/docs/page/user_profile.md) (Tài liệu layout hồ sơ cá nhân)
  - [api_list.md](file:///D:/DATN/DATN_Tài%20liệu/docs/api/api_list.md) (Định nghĩa API)
  - [profile.service.ts](file:///d:/DATN/danangtrip-web/src/services/profile.service.ts) (Lớp truyền tải dữ liệu frontend)
  - [DESIGN.md](file:///d:/DATN/danangtrip-web/DESIGN.md) (Quy chuẩn thiết kế dự án)

---

## 1) Summary
- **Mục đích:** Cung cấp cho khách hàng đã đăng nhập khả năng thay đổi mật khẩu tài khoản một cách bảo mật. Giao diện bao gồm Sidebar thông tin cá nhân và một Form biểu mẫu đổi mật khẩu tích hợp bộ kiểm tra độ phức tạp thời gian thực (realtime) và thanh đo độ mạnh mật khẩu.
- **Actor chính:** Người dùng đã xác thực (🔐 Protected Route).
- **Feature/Module:** Hồ sơ người dùng / Bảo mật tài khoản (`profile`).
- **Source inputs đã dùng:** `user_profile_password.md`, `user_profile.md`, `api_list.md`, `profile.service.ts`, `DESIGN.md`.

---

## 2) Design Token Audit
Do tài liệu nghiệp vụ gốc mô tả giao diện Light theme (nền trắng, màu nhấn xanh dương), chúng tôi thực hiện ánh xạ sang cấu trúc **Dark Theme** cao cấp chuẩn của ứng dụng theo [DESIGN.md](file:///d:/DATN/danangtrip-web/DESIGN.md):
- **Màu sắc & Trực quan (Glassmorphic surfaces):**
  - Card chính: Sử dụng cấu trúc Glassmorphism với nền tối màu `#080808` kết hợp hiệu ứng kính mờ, viền mỏng `#262626` và bo góc `rounded-lg` (7px theo `DESIGN.md`).
  - Màu nhấn (Accent/Primary): Dùng tông màu Azure/Bronze `#8B6A55` thay cho màu xanh dương `#0066CC` của tài liệu light theme.
  - Các nút bấm:
    - Nút phụ "Hủy": Nền tối `#171717`, chữ màu xám `#737373` hoặc trắng, viền `#262626`.
    - Nút chính "Đổi mật khẩu": Nền `#8B6A55` (hoặc `#171717` viền accent tùy trạng thái), chữ màu trắng `#FFFFFF`, bo góc tròn hoàn toàn (`rounded-full`).
- **Thanh đo độ mạnh mật khẩu (Strength segments):**
  - Yếu (1/4): `bg-[#EF4444]` (Đỏ)
  - Trung bình (2/4): `bg-[#F59E0B]` (Vàng hổ phách)
  - Mạnh (3/4): `bg-[#8B6A55]` (Màu thương hiệu Azure/Bronze)
  - Rất mạnh (4/4): `bg-[#10B981]` (Xanh lá)
- **Hoạt ảnh (Animations):**
  - Transition mượt mà `duration-200` khi toggle hiện/ẩn mật khẩu và khi các chỉ số checklist cập nhật màu sắc.
  - Hiệu ứng xuất hiện: `reveal-up` kết hợp trễ nhịp điệu nhẹ nhàng cho nội dung form.

---

## 3) Component Breakdown

### [REUSE] — Components đã có
| Component | Path | Cần chỉnh sửa? | Note |
|-----------|------|-----------------|------|
| `ProtectedLayout` | `src/app/[locale]/(main)/(protected)/layout.tsx` | ✗ Không | Kiểm tra xác thực ở Edge Middleware và Layout. |
| `Header` | `src/components/layout/Header.tsx` | ✗ Không | Header thanh điều hướng chính. |
| `Footer` | `src/components/layout/Footer.tsx` | ✗ Không | Footer chân trang. |
| `Input` | `src/components/ui/Input.tsx` | ✗ Không | Có hỗ trợ sẵn prop `isPassword` và nút bấm toggle xem/ẩn mật khẩu. |
| `Button` | `src/components/ui/Button.tsx` or basic markup | ✗ Không | Nút tương tác tái sử dụng thiết kế token. |

### [NEW] — Components cần tạo mới
| Component | Mô tả | Thuộc layer (Atom/Molecule/Organism) | Props interface |
|-----------|-------|--------------------------------------|-----------------|
| `ProfileSidebar` | Sidebar điều hướng hồ sơ hiển thị Avatar (chữ cái đầu của tên), Tên, Email, Badge Vai trò (Thành viên), và menu liên kết. | Organism | N/A (Đọc trực tiếp từ `useAuthStore`) |
| `ProfileLayoutWrapper` | Khung Layout chia sẻ cho tất cả các trang hồ sơ (Hồ sơ, Mật khẩu, Đơn hàng, v.v.), bố trí Breadcrumb trên đầu, chia 2 cột (Sidebar bên trái, nội dung bên phải). | Organism | `{ children: React.ReactNode, activeTab: string }` |
| `PasswordChangeForm` | Khối Form quản lý biểu mẫu nhập mật khẩu, tích hợp kiểm tra độ mạnh, checklist realtime và mutation lưu dữ liệu. | Organism | N/A |
| `PasswordStrengthBar` | Thanh đo trực quan độ phức tạp mật khẩu gồm 4 phân đoạn màu sắc. | Molecule | `{ score: number }` (0 đến 4) |
| `RealtimeChecklist` | Danh sách hiển thị các quy tắc mật khẩu kèm icon check xanh (hợp lệ) hoặc dấu nhân đỏ (chưa hợp lệ). | Molecule | `{ checks: { key: string, valid: boolean }[] }` |

### [MOD] — Components cần chỉnh sửa
| Component | Path | Thay đổi gì | Impact |
|-----------|------|-------------|--------|
| `routes.ts` | `src/config/routes.ts` | Thêm `PASSWORD: "/profile/password"` vào danh sách `PROTECTED_ROUTES`. | Đồng bộ hóa hằng số định tuyến. |
| `ProfilePage` | `src/app/[locale]/(main)/(protected)/profile/page.tsx` | Chuyển đổi giao diện trang hồ sơ cá nhân hiện tại từ dạng căn giữa đơn lẻ sang lồng trong `ProfileLayoutWrapper`. | Tạo trải nghiệm giao diện thống nhất khi chuyển tab. |
| `settings.json` (i18n) | `src/messages/vi/settings.json`, `en/settings.json` | Thêm bản dịch mới cho tiêu đề, nhãn input, checklist quy tắc và các toast thành công/lỗi. | Hỗ trợ đa ngôn ngữ đầy đủ. |

---

## 4) Responsive Behavior
- **Desktop (≥ 1024px):** Layout 2 cột rõ ràng. Cột trái Sidebar rộng 240px cố định, cột phải nội dung form đổi mật khẩu có độ rộng giới hạn `max-w-md` (khoảng 480px) để tránh form bị kéo quá rộng.
- **Tablet (768px - 1023px):** Khoảng cách gap giữa các cột thu hẹp. Sidebar và Content vẫn nằm song song.
- **Mobile (< 768px):** Layout chuyển sang 1 cột duy nhất dọc (flex-col). Breadcrumb căn chỉnh thu nhỏ. Sidebar sẽ được xếp chồng lên trên Content (hoặc chuyển thành menu rút gọn/tab cuộn ngang tùy chỉnh để tối ưu diện tích). Nhập liệu form kéo giãn toàn bộ bề rộng màn hình.

---

## 5) UI States

| Component/Section | Loading | Empty | Error | Success | Disabled | Hover/Focus |
|-------------------|---------|-------|-------|---------|----------|-------------|
| **Form Đổi mật khẩu** | Trạng thái button submit hiển thị spinner quay và chữ "Đang lưu..." | N/A | Lỗi API (như sai mật khẩu cũ) hiển thị dòng chữ đỏ dưới trường input hoặc toast | Hiển thị thông báo Toast xanh lá thành công và xóa trắng dữ liệu nhập trên form | Form fields và các nút bấm bị khóa (`disabled`) khi đang gửi yêu cầu | Viền input chuyển sang màu nhấn `#8B6A55` kèm hiệu ứng ring dịu nhẹ |
| **Sidebar Hồ sơ** | Nút bấm và văn bản nhấp nháy skeleton nếu thông tin user chưa tải xong | N/A | N/A | Hiển thị chuẩn thông tin Avatar và Tên | N/A | Các item menu khi di chuột đổi sang màu nền tối nhẹ `#171717` |

---

## 6) Data Fields

Dữ liệu đầu vào cho yêu cầu đổi mật khẩu bám sát interface `ChangePasswordInput`:
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `current_password` | `string` | ✓ | Mật khẩu hiện tại của tài khoản | Bắt buộc nhập |
| `password` | `string` | ✓ | Mật khẩu mới mong muốn | Bắt buộc nhập, tối thiểu 8 ký tự, có chữ hoa, chữ thường và chữ số |
| `password_confirmation` | `string` | ✓ | Xác nhận lại mật khẩu mới | Bắt buộc nhập, phải khớp chính xác với `password` |

---

## 7) API Endpoints

Bản đồ tích hợp API tương ứng với lớp dịch vụ `profileService`:
| Method | Path | Auth | Request Body | Response | Error Codes |
|--------|------|------|--------------|----------|-------------|
| PUT | `/user/password` | 🔐 Có | `{ current_password, password, password_confirmation }` | `ApiResponse<unknown>` | `401 Unauthorized` (Token hết hạn), `422 Unprocessable Entity` (Sai mật khẩu hiện tại hoặc không khớp) |

---

## 8) Business Rules
- **BR-01 (Auth Guard):** Chỉ cho phép khách hàng đăng nhập truy cập trang này. Mọi truy cập trái phép qua URL `/profile/password` sẽ bị Middleware bắt lại và chuyển hướng tới `/login?callbackUrl=...`.
- **BR-02 (Form Validation):** Nút "Đổi mật khẩu" (Submit Button) chỉ được mở khóa khi và chỉ khi:
  - Trường `current_password` không trống.
  - Trường `password` thỏa mãn toàn bộ các điều kiện phức tạp (checklist đều xanh).
  - Trường `password_confirmation` khớp hoàn toàn với `password`.
- **BR-03 (Tự động Xóa trắng Form):** Sau khi gửi yêu cầu PUT thành công và nhận phản hồi OK từ server, form phải được reset về trạng thái trống hoàn toàn để tránh rò rỉ dữ liệu mật khẩu cũ.
- **BR-04 (Xử lý Sai mật khẩu hiện tại):** Nếu API trả về mã lỗi chỉ ra sai mật khẩu hiện tại, ứng dụng phải hiển thị thông báo lỗi rõ ràng `"Mật khẩu hiện tại không đúng"` ngay dưới input Mật khẩu hiện tại, thay vì chỉ hiện toast chung chung.

---

## 9) Edge Cases
- **EC-01 (Mất kết nối mạng hoặc Token hết hạn giữa chừng):** Người dùng bấm đổi mật khẩu nhưng kết nối mạng bị gián đoạn hoặc phiên làm việc đã hết hạn. <br>*Giải pháp:* Hiển thị thông báo Toast cảnh báo lỗi rõ ràng. Nếu mã lỗi trả về là `401`, tự động chuyển hướng người dùng ra trang đăng nhập kèm tham số quay lại.
- **EC-02 (Nhập mật khẩu mới trùng mật khẩu hiện tại):** Người dùng cố tình nhập mật khẩu mới giống hệt mật khẩu cũ. <br>*Giải pháp:* API backend thường sẽ chặn lỗi này. Nếu không, ở client chúng tôi có thể hiển thị cảnh báo phụ nếu nghiệp vụ yêu cầu, hoặc để mặc cho API trả về lỗi xử lý.
- **EC-03 (Bấm Submit liên tiếp nhiều lần):** Người dùng click chuột liên tục vào nút đổi mật khẩu khi kết nối mạng chậm. <br>*Giải pháp:* Khi bắt đầu xử lý gửi request, thuộc tính `disabled` sẽ lập tức được set lên nút bấm cùng trạng thái spinner để ngăn mọi hành vi submit trùng lặp.

---

## 10) Assumptions & Open Questions
### Assumptions
- **[ASSUMPTION] A-01:** Phản hồi thành công từ API `/user/password` trả về mã trạng thái `200` hoặc `204` mà không đi kèm dữ liệu người dùng mới. Chúng tôi sẽ không cần cập nhật lại `user` trong `useAuthStore` khi đổi mật khẩu thành công.
- **[ASSUMPTION] A-02:** Độ phức tạp mật khẩu mới ở client chỉ kiểm tra tối thiểu 8 ký tự, ít nhất 1 chữ hoa, và ít nhất 1 chữ số. Quy tắc này thống nhất với bộ kiểm tra độ mạnh 4 phân đoạn.

### Open Questions
- *Không có câu hỏi mở cần giải đáp.*
