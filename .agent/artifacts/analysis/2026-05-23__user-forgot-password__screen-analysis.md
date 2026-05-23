# Screen Analysis: Quên mật khẩu

> Feature slug: `user-forgot-password`
> Date: 2026-05-23
> Figma: N/A (Phân tích theo tài liệu đặc tả [user_forgot_password.md](file:///D:/DATN/DATN_Document/docs/page/user_forgot_password.md) và thiết kế hệ thống tại [DESIGN.md](file:///D:/DATN/danangtrip-web/DESIGN.md))

---

## 1) Summary
- **Mục đích màn hình:** Cho phép khách truy cập (người dùng chưa đăng nhập) yêu cầu gửi một liên kết khôi phục mật khẩu thông qua địa chỉ email đăng ký của họ.
- **Người dùng chính:** Khách du lịch (User) đã đăng ký tài khoản nhưng quên mật khẩu truy cập.
- **Thuộc feature/module:** `auth` (Xác thực người dùng).
- **Source inputs đã dùng:** 
  - Tài liệu đặc tả màn hình: `D:\DATN\DATN_Document\docs\page\user_forgot_password.md`
  - Code mẫu và thiết kế có sẵn: `src/features/auth/components/login-form.tsx`, `src/features/auth/components/verify-email-form.tsx`
  - Các cấu hình API/Routes hiện tại: `src/config/api.ts`, `src/config/routes.ts`, `src/services/auth.service.ts`

## 2) Design Token Audit
| Token | Figma Value | DESIGN.md Value | Match? | Note |
|-------|-------------|-----------------|--------|------|
| Primary color | `#8B6A55` | `#8B6A55` | Yes | Màu đồng/nâu đất đặc trưng của DanangTrip. |
| Typography | Inter / SFMono-Regular | Inter / SFMono-Regular | Yes | Sử dụng Inter cho các tiêu đề chính và SFMono-Regular cho các nhãn (labels), input, và văn bản hỗ trợ. |
| Spacing | 4px base | 4px base | Yes | Sử dụng các lớp khoảng cách Tailwind chuẩn (p-4, p-6, sm:p-8, space-y-5, space-y-6). |
| Border radius | 7px / 12px / 9999px | 7px / 8px / 12px / 9999px | Yes | 12px cho góc bo viền ngoài container; 7px cho bề mặt bên trong card; 9999px (bo tròn hoàn toàn) cho nút bấm chính và input. |
| Shadow/Blur | Shadow & Blur 12px | Shadow & Glass Blur 12px | Yes | Sử dụng bề mặt kính (Glass surface) với nền mờ `#080808` và border màu `#262626`, kết hợp đổ bóng `shadow-[0_0_40px_rgba(139,106,85,0.12)]`. |

## 3) Component Breakdown
### [REUSE] — Components đã có
| Component | Path | Cần chỉnh sửa? | Note |
|-----------|------|-----------------|------|
| `Input` | `src/components/ui/input.tsx` | Không | Component nhập liệu chuẩn đã được định nghĩa. Đầy đủ các thuộc tính label, leftIcon, error, focus. |
| `AmbientBackground` | `src/components/layout/AmbientBackground.tsx` | Không | Hiệu ứng nền mờ chuyển động mượt mà cho các trang Auth công cộng. |
| `IoMailOutline`, `IoChevronBack` | `src/components/icons/solar` (hoặc react-icons tương ứng) | Không | Các icon Solar dạng nét mảnh (linear) đồng điệu với phong cách tối giản. |

### [NEW] — Components cần tạo mới
| Component | Mô tả | Thuộc layer (Atom/Molecule/Organism) | Props interface |
|-----------|-------|--------------------------------------|-----------------|
| `ForgotPasswordForm` | Component chứa form nhập email, nút bấm khôi phục mật khẩu, các trạng thái loading/thành công/lỗi và nút điều hướng phụ. | Organism | `interface ForgotPasswordFormProps { email?: string; }` |

### [MOD] — Components cần chỉnh sửa
| Component | Path | Thay đổi gì | Impact |
|-----------|------|-------------|--------|
| `LoginForm` | `src/features/auth/components/login-form.tsx` | Thay đổi liên kết Quên mật khẩu từ `ROUTES.CONTACT` thành `ROUTES.FORGOT_PASSWORD` (hoặc `"/forgot-password"`). | Giúp người dùng điều hướng chính xác từ trang Login sang trang Quên Mật Khẩu mới tạo. |
| Routes config | `src/config/routes.ts` | Khai báo hằng số `FORGOT_PASSWORD: "/forgot-password"` trong `AUTH_ROUTES`. | Giúp hệ thống và các liên kết điều hướng sử dụng đúng đường dẫn tĩnh của trang. |
| Middleware | `src/middleware.ts` | Thêm tuyến đường `/forgot-password` vào danh sách `authRoutes`. | Middleware sẽ tự động kiểm tra: nếu người dùng đã đăng nhập (có token trong cookie) truy cập trang quên mật khẩu, họ sẽ bị chuyển hướng về trang chủ (`/` hoặc `/en`). |
| i18n Request Config | `src/i18n/request.ts` | Import tĩnh tệp tin `forgot-password.json` ở cả hai thư mục `vi` và `en`, khai báo vào `messagesByLocale`. | Giúp Next-intl tải đúng dữ liệu dịch cho trang Quên mật khẩu mà không bị lỗi biên dịch tĩnh trên Cloudflare Workers. |

## 4) Responsive Behavior
| Breakpoint | Layout | Thay đổi so với desktop |
|------------|--------|------------------------|
| Desktop (≥1024px) | Bố cục hai cột (Two-panel layout) | Baseline: Một cột bên trái hiển thị hình ảnh/gradient thương hiệu với chữ chào mừng, cột bên phải chứa Form nhập liệu. Hiệu ứng viền xoay gradient conic hoạt động. |
| Tablet (768-1023px) | Bố cục một cột căn giữa | Chỉ hiển thị panel chứa Form nhập liệu. Container thu nhỏ bề rộng tối đa (`max-w-md`). Ẩn bớt hiệu ứng phức tạp nếu cần để tối ưu hiệu năng. |
| Mobile (<768px) | Bố cục toàn màn hình đơn giản | Form dàn trải rộng 100%. Ẩn hoàn toàn viền gradient conic ngoài màn hình để tránh làm che khuất nội dung, tối ưu hóa các khoảng đệm (`p-4` thay vì `p-8`) và kích thước chữ. |

## 5) UI States
| Component/Section | Loading | Empty | Error | Success | Disabled | Hover/Focus |
|-------------------|---------|-------|-------|---------|----------|-------------|
| **Trường Email** | N/A | Trạng thái mặc định rỗng. | Hiện viền đỏ + thông báo lỗi Zod validation ở dưới (ví dụ: "Email không hợp lệ"). | Viền sáng nhẹ khi nhập đúng định dạng. | Thuộc tính `disabled` được bật khi đang gửi API. | Viền đổi màu đồng `#8B6A55` khi được Focus. |
| **Nút Gửi Link** | Biểu tượng Spinner xoay tròn + chữ "Đang xử lý..." (hoặc tương tự). | N/A | N/A | Ẩn form chính, hiển thị màn hình chúc mừng/thành công. | Bị vô hiệu hóa (`disabled`) khi input trống, sai format hoặc đang gọi API. | Hover: Viền đổi sang `#8B6A55`, chữ chuyển màu đồng nhạt `#c59a5f`, tỷ lệ scale nhẹ 1.02. |
| **Nút Gửi Lại (Success State)** | Hiển thị chữ "Đang xử lý..." khi click. | N/A | Hiển thị Toast thông báo lỗi gửi lại thất bại. | Toast thông báo gửi lại thành công. | Bị vô hiệu hóa khi trong thời gian đếm ngược (cooldown 60 giây) kèm đếm ngược dạng "Gửi lại sau 45s". | Hover: Đổi màu chữ sang `#c59a5f` và gạch chân khi có hiệu lực. |
| **Giao diện Thành công** | N/A | N/A | N/A | Hiển thị thẻ card trung lập: "Chúng tôi đã gửi hướng dẫn... Vui lòng kiểm tra hộp thư." màu đồng dịu mắt. | N/A | N/A |

## 6) Data Fields
| Field | Type | Required | Validation | Example | Source API |
|-------|------|----------|------------|---------|------------|
| `email` | `string` | ✓ | Đúng định dạng email biểu thức chính quy (Regex: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`). Bắt buộc, không được để trống. | `taynd@gmail.com` | `POST /auth/forgot-password` (Body) |

## 7) API Endpoints
| Method | Path | Auth | Request | Response | Error codes |
|--------|------|------|---------|----------|-------------|
| `POST` | `/auth/forgot-password` | Public (Không cần Token) | `{ "email": "user@example.com" }` | `{ "success": true, "message": "Reset link sent successfully." }` | `422`: Lỗi định dạng/thiếu email.<br>`429`: Spam gửi quá nhiều yêu cầu.<br>`500`: Lỗi máy chủ hệ thống. |

## 8) Business Rules
- **BR-01 (Bảo mật thông tin):** Để tránh việc dò quét tài khoản (User Enumeration), phản hồi từ API/UI luôn phải ở dạng trung lập khi thành công. Hệ thống không báo "Email không tồn tại trên hệ thống", mà sẽ luôn báo "Nếu địa chỉ email này tồn tại trong hệ thống, chúng tôi đã gửi liên kết khôi phục mật khẩu..."
- **BR-02 (Ngăn chặn spam):** Sau khi yêu cầu gửi email khôi phục thành công, người dùng phải đợi ít nhất **60 giây** (cooldown) trước khi có thể nhấn nút "Gửi lại" yêu cầu mới. Nút bấm gửi lại phải bị disabled và hiển thị số giây đếm ngược.
- **BR-03 (Xử lý đa ngôn ngữ):** Toàn bộ nhãn, thông tin giữ chỗ (placeholder), thông điệp lỗi và nội dung thông báo thành công phải được dịch đầy đủ qua hệ thống next-intl, không được sử dụng chuỗi tiếng Việt hoặc tiếng Anh cứng (hardcoded).

## 9) Actors & Permissions
| Actor/Role | Can do | Cannot do | Notes |
|------------|--------|-----------|-------|
| Khách truy cập (Guest) | Truy cập trang công khai `/forgot-password`, điền form, gửi yêu cầu khôi phục mật khẩu. | Truy cập các tuyến đường cần đăng nhập như `/profile`, `/settings`. | Là actor chính thực hiện chức năng khôi phục này. |
| Người dùng đã đăng nhập (Authenticated User) | N/A | Không thể truy cập trang `/forgot-password` (sẽ bị Middleware tự động chuyển hướng về trang chủ). | Tránh việc người dùng đã có phiên làm việc hợp lệ cố tình hoặc vô tình truy cập lại luồng lấy lại mật khẩu. |

## 10) Edge Cases
- **EC-01 (Mất kết nối mạng/Server lỗi):** Khi người dùng nhấn nút gửi nhưng mất kết nối internet hoặc server phản hồi lỗi 500. UI cần xử lý lỗi qua `catch` hoặc `onError` của TanStack Query và hiển thị Toast thông điệp lỗi thân thiện tiếng Việt/tiếng Anh (ví dụ: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.").
- **EC-02 (Địa chỉ email rác/không tồn tại):** Phải đảm bảo luồng Success hoạt động bình thường, chuyển người dùng sang màn hình báo thành công trung lập (theo BR-01) chứ không quăng lỗi ra ngoài.
- **EC-03 (Chặn truy cập trực tiếp trang thành công):** Trạng thái thành công chỉ là một nhánh hiển thị (state) trong Component `ForgotPasswordForm` dựa trên phản hồi của API, không phải là một tuyến đường riêng biệt (ví dụ `/forgot-password/success`). Tránh trường hợp người dùng cố tình gõ link để vào trực tiếp màn hình thành công mà chưa hề gửi email.

## 11) Assumptions & Open Questions
### Assumptions
- **[ASSUMPTION] A-01:** Backend API `POST /auth/forgot-password` hoạt động độc lập và phản hồi về cấu trúc chuẩn `{ success: boolean, message?: string }`.
- **[ASSUMPTION] A-02:** Người dùng khi bấm nút quay lại đăng nhập sẽ được điều hướng về `/login` của ngôn ngữ hiện tại nhờ hook điều hướng `useRouter` của next-intl.

### Open Questions
- **Q-01:** Bạn có đồng ý đếm ngược 60 giây để gửi lại không? *(Đã được ghi nhận trong kế hoạch triển khai).*
- **Q-02:** Có cần tự động chuyển hướng người dùng về trang Đăng nhập sau một khoảng thời gian (ví dụ 10 giây) sau khi họ gửi yêu cầu khôi phục thành công hay giữ nguyên màn hình để họ tự bấm? *(Khuyên dùng: giữ nguyên màn hình để họ đọc kỹ hướng dẫn kiểm tra email, có nút chủ động click).*

## 12) Implementation Checklist
- [ ] **Types & API contract:** Xác minh `ForgotPasswordRequest` trong `src/types/auth.types.ts` và `authService.forgotPassword` trong `src/services/auth.service.ts` (Bước 03).
- [ ] **Route & layout:**
  - [ ] Khai báo `FORGOT_PASSWORD: "/forgot-password"` trong `src/config/routes.ts` (Bước 04).
  - [ ] Đăng ký `/forgot-password` vào danh sách `authRoutes` trong `src/middleware.ts` (Bước 04).
  - [ ] Sửa liên kết quên mật khẩu trong `src/features/auth/components/login-form.tsx` (Bước 04).
- [ ] **UI components:**
  - [ ] Tạo tệp tin đa ngôn ngữ `src/messages/vi/forgot-password.json` (Bước 05).
  - [ ] Tạo tệp tin đa ngôn ngữ `src/messages/en/forgot-password.json` (Bước 05).
  - [ ] Đăng ký tĩnh hai tệp ngôn ngữ này trong `src/i18n/request.ts` (Bước 05).
  - [ ] Tạo route page `src/app/[locale]/(auth)/forgot-password/page.tsx` hỗ trợ SEO (Bước 04/05).
  - [ ] Tạo component `src/features/auth/components/forgot-password-form.tsx` (Bước 05).
- [ ] **Data integration:**
  - [ ] Gọi API khôi phục mật khẩu thông qua TanStack Query `useMutation` trong `ForgotPasswordForm` (Bước 06).
  - [ ] Quản lý các trạng thái API: `isPending`, `error`, `success` (Bước 06).
- [ ] **Interactions:**
  - [ ] Vô hiệu hóa nút Submit khi form lỗi, trống, hoặc đang gọi API (Bước 07).
  - [ ] Cài đặt đếm ngược Cooldown 60s cho hành động Gửi lại email (Bước 07).
  - [ ] Xử lý sự kiện Enter và Focus chuyên nghiệp (Bước 07).
- [ ] **Auth/permissions:** Rà soát Middleware đảm bảo an toàn truy cập (Bước 08).
- [ ] **Testing:** Kiểm thử chạy linting, typechecking và build sản phẩm (Bước 09).
- [ ] **Optimization:** Tạo báo cáo deploy-report và review hoàn chỉnh (Bước 10).

## 13) Files / Areas Likely To Change
- `src/config/routes.ts`
- `src/middleware.ts`
- `src/features/auth/components/login-form.tsx`
- `src/i18n/request.ts`
- `src/messages/vi/forgot-password.json` [NEW]
- `src/messages/en/forgot-password.json` [NEW]
- `src/app/[locale]/(auth)/forgot-password/page.tsx` [NEW]
- `src/features/auth/components/forgot-password-form.tsx` [NEW]
