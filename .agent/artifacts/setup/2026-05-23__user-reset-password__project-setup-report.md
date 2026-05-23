# Project Setup Audit: Đặt lại mật khẩu (user-reset-password)

- **Feature Slug**: `user-reset-password`
- **Ngày kiểm tra**: 2026-05-23
- **Trạng thái thiết lập**: **Sẵn sàng triển khai** (Ready)

---

## 1. Stack Validation (Kiểm tra thư viện cốt lõi)

Dựa trên kết quả rà soát cấu hình thực tế của repository, các công nghệ nền tảng cần thiết cho màn hình Đặt lại mật khẩu đều có trạng thái hoạt động tốt:

| Thư viện / Công cụ | Phiên bản thực tế | Trạng thái kiểm tra | Ghi chú |
|---|---|---|---|
| **Next.js** | 16.x App Router | Hoạt động tốt | Hỗ trợ cấu hình `params` / `searchParams` bất đồng bộ ở dạng Promise. |
| **React** | 19.x | Hoạt động tốt | Hỗ trợ các hook mới và cải tiến hiệu năng render. |
| **Tailwind CSS** | v4.x | Hoạt động tốt | Sử dụng các tiện ích CSS v4 tiên tiến, kế thừa các class tùy biến từ `globals.css`. |
| **Zod** | v4.x | Hoạt động tốt | Sẵn sàng cho việc validate dữ liệu biểu mẫu động tại client. |
| **TanStack Query** | v5.x | Hoạt động tốt | Sử dụng `useMutation` cho các thao tác ghi dữ liệu (POST request) bất đồng bộ. |
| **Axios** | v1.x | Hoạt động tốt | `axiosInstance` đã được thiết lập tích hợp các interceptor xử lý token và lỗi API. |
| **next-intl** | v4.x | Hoạt động tốt | Quản lý đa ngôn ngữ dạng tĩnh ổn định, thích ứng tốt trên Edge Runtime. |

---

## 2. Directory Shape Validation (Kiểm tra cấu trúc thư mục)

Cấu trúc các thư mục liên quan tới tính năng Auth hoàn toàn ăn khớp với Operating Contract của dự án:
- **Routes concern**: `src/app/[locale]/(auth)/` là thư mục chứa các trang đăng nhập, đăng ký, quên mật khẩu. Chúng ta sẽ đặt trang đặt lại mật khẩu tại `src/app/[locale]/(auth)/reset-password/page.tsx`.
- **Feature concern**: `src/features/auth/components/` là nơi chứa các form UI. Chúng ta sẽ tạo mới `reset-password-form.tsx` tại đây.
- **Service concern**: `src/services/auth.service.ts` đã khai báo sẵn phương thức `resetPassword(data)` để kết nối API.
- **Types concern**: `src/types/auth.types.ts` chứa interface `ResetPasswordRequest` định dạng đúng payload gửi lên API.
- **i18n Messages**: Thư mục `src/messages/` chứa các file json dịch đa ngôn ngữ.

---

## 3. Configuration & Registry Verification (Kiểm tra cấu hình tích hợp)

1. **API Endpoints (`src/config/api.ts`)**:
   - Trường `API_ENDPOINTS.AUTH.RESET_PASSWORD` đã được định nghĩa là `"/auth/reset-password"`. Cấu hình này hoàn toàn chính xác và sẵn sàng sử dụng.
2. **Dynamic i18n Loader (`src/i18n/request.ts`)**:
   - Hệ thống đang dùng cơ chế tĩnh nạp trước các file dịch (static import) và đăng ký qua đối tượng `messagesByLocale`.
   - **Hành động bắt buộc**: Phải sửa đổi file này để import tĩnh `reset-password.json` mới tạo nhằm vượt qua bài kiểm tra biên dịch Edge Workers.
3. **Edge Middleware (`src/middleware.ts`)**:
   - `authRoutes` đang chứa `"/login"`, `"/register"`, `"/forgot-password"`.
   - **Hành động bắt buộc**: Phải thêm `"/reset-password"` vào danh sách này để kích hoạt Edge-level redirect cho các phiên đăng nhập hợp lệ.

---

## 4. Build & Verification Gates (Kiểm tra các cửa ngõ kiểm tra)

Dự án sử dụng bộ script kiểm soát chất lượng nghiêm ngặt trước khi push code:
- `npm run lint`: Chạy ESLint rà soát cảnh báo/lỗi code.
- `npm run typecheck`: Chạy tsc kiểm tra kiểu dữ liệu TypeScript.
- `npm run check:routes`: Xác thực tính đúng đắn của các liên kết trang Next.js.
- `npm run build`: Đóng gói ứng dụng để xác thực tương thích Edge Runtime.
- **Lệnh tổng hợp**: `npm run prepush:check` là bắt buộc và phải chạy thành công trước khi bàn giao.

---

## 5. Kết luận Audit

Dự án đã được thiết lập hoàn hảo. Không có rào cản kỹ thuật hay xung đột cấu hình nào ngăn cản việc triển khai màn hình `/reset-password`. Chúng tôi bắt đầu tiến sang **Bước 03: Thiết lập API & Types**.
