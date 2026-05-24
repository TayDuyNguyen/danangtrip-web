# Route Plan: user-forgot-password

> Feature slug: `user-forgot-password`
> Date: 2026-05-23
> Route scope: `/forgot-password`

---

## 1) Summary
- **Mô tả tuyến đường:** Feature này sẽ thêm mới tuyến đường công cộng phục hồi mật khẩu `/forgot-password` cho trang web.
- **Phân nhóm định tuyến:** Tuyến đường thuộc nhóm **Auth Group (`(auth)`)**, là trang công khai nhưng có hành động phân quyền đặc biệt (Middleware sẽ tự động chuyển hướng người dùng đã có phiên đăng nhập hợp lệ về trang chủ).

## 1.1) Route Decision
- **Route type:** `new`
- **Server-first or client-heavy:** **Server-first shell + Client-heavy form**
- **Why:**
  - **Server-first shell:** Trang định tuyến `page.tsx` sẽ hoạt động ở Server Component để thực thi việc lấy dịch thuật đa ngôn ngữ động động từ Next-intl thông qua `getTranslations` và thiết lập SEO Metadata động cực kỳ tối ưu.
  - **Client-heavy form:** Form xử lý tương tác nhập email, validate Zod client-side và kết nối API TanStack Query cần có tính tương tác cao nên component con `ForgotPasswordForm` sẽ được khai báo `"use client"`.

---

## 2) Route Files
| Route Path | File | Layout | Server / Client Notes | Metadata |
|---|---|---|---|---|
| `/forgot-password` | `src/app/[locale]/(auth)/forgot-password/page.tsx` | Kế thừa layout chung của nhóm `(auth)`. | Server Component. Thực hiện parse query params, render component client `ForgotPasswordForm` và tiêm SEO metadata động. | Tự động tạo bằng `generateMetadata` sử dụng `getTranslations` từ next-intl. |

---

## 3) Route Config Impact
| File | Change Needed | Notes |
|---|---|---|
| `src/config/routes.ts` | Thêm `FORGOT_PASSWORD: "/forgot-password"` vào hằng số `AUTH_ROUTES`. | Giúp toàn hệ thống tham chiếu đường dẫn tĩnh chuẩn hóa thay vì hardcode. |
| `src/middleware.ts` | Thêm `/forgot-password` vào danh sách `authRoutes`. | Chặn người dùng có cookie `token` truy cập luồng phục hồi mật khẩu, chuyển hướng họ về trang chủ an toàn. |

## 3.1) Server / Client Boundary Notes
| Area | Server or Client | Reason |
|---|---|---|
| `page.tsx` | Server Component | Lấy locale, lấy bản dịch để sinh SEO metadata tĩnh và truyền properties ban đầu xuống form. |
| `ForgotPasswordForm` | Client Component | Cần `"use client"` vì có React state, các hook của react-query, sự kiện onSubmit, và quản lý focus/keyboard input. |

---

## 4) Locale / Navigation Impact
| Item | Locale Keys | Notes |
|---|---|---|
| Breadcrumb | `forgotPassword.meta_title` | Hỗ trợ nhãn breadcrumb chuẩn khi cần hiển thị cấu trúc. |
| Menu / CTA | `login.forgot_password` | Sửa liên kết "Quên mật khẩu?" trên trang Login dẫn về `/forgot-password`. |

---

## 5) Files Expected To Change
- `src/config/routes.ts`
- `src/middleware.ts`
- `src/features/auth/components/login-form.tsx`
- `src/i18n/request.ts`
- `src/messages/vi/forgot-password.json` [NEW]
- `src/messages/en/forgot-password.json` [NEW]
- `src/app/[locale]/(auth)/forgot-password/page.tsx` [NEW]

---

## 6) Risks / Open Questions
- **R-01 (Kẹt cổng kiểm tra check:routes):** Nếu chúng ta cập nhật file `routes.ts` trước mà chưa tạo tệp `forgot-password/page.tsx`, script check:routes sẽ báo lỗi đỏ. Do đó, chúng ta phải tạo file page shell đồng thời ngay trong bước 4 này để duy trì tính nhất quán.
- **Q-01 (Metadata dynamic key):** Metadata tiêu đề trang sẽ dùng key `meta_title` trong file `forgot-password.json`. Cần đồng bộ tệp json này ngay ở Bước 04/05 để tránh build lỗi.
