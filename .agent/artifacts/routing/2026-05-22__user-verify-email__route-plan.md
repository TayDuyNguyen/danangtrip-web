# Route Plan: User Email Verification

> Feature slug: `user-verify-email`
> Date: 2026-05-22
> Route scope: `/verify-email`

---

## 1) Summary
- Feature này thêm trang xác thực email `/verify-email`.
- Route thuộc nhóm định tuyến công khai/auth group `(auth)` để chia sẻ giao diện layout đăng nhập/đăng ký (logo minimal header, background tối sang trọng).

## 1.1) Route Decision
- Route type: `new` (Tạo mới trang `/verify-email`)
- Server-first or client-heavy: **Server component** đóng vai trò lấy các searchParams (`token` và `email`) từ URL, sau đó render một **Client component** (`VerifyEmailForm`) quản lý logic tương tác động (gọi API mutation, input OTP, countdown, resend email).
- Why: Phù hợp với App Router của Next.js, giữ cho file trang page mỏng, thu thập tham số ở Server rồi truyền xuống Client component.

## 2) Route Files
| Route Path | File | Layout | Server / Client Notes | Metadata |
|---|---|---|---|---|
| `/[locale]/verify-email` | `src/app/[locale]/(auth)/verify-email/page.tsx` | Kế thừa layout từ nhóm `(auth)` (nếu có layout dùng chung cho auth) | Server Component (Hứng params) render Client Component | Tiêu đề: "Xác thực Email | DaNangTrip", Hỗ trợ đa ngôn ngữ thông qua `generateMetadata` |

## 3) Route Config Impact
| File | Change Needed | Notes |
|---|---|---|
| `src/config/routes.ts` | Thêm `VERIFY_EMAIL: "/verify-email"` vào `AUTH_ROUTES` và update `ROUTES` | Tránh hardcode URL trong source code |

## 3.1) Server / Client Boundary Notes
| Area | Server or Client | Reason |
|---|---|---|
| `page.tsx` | Server | Thu thập tham số tìm kiếm (`token`, `email`) trên server để truyền props sạch cho Form. Hỗ trợ SEO tốt hơn qua generateMetadata. |
| `VerifyEmailForm` | Client | Yêu cầu quản lý trạng thái state của React, gọi React Query mutation, xử lý countdown đếm ngược và di chuyển con trỏ trong các ô OTP. |
| `OtpInputGroup` | Client | Yêu cầu bắt sự kiện bàn phím (onKeyDown, onPaste) và quản lý ref focus của từng input. |

## 4) Locale / Navigation Impact
| Item | Locale Keys | Notes |
|---|---|---|
| `verify-email` namespace | Toàn bộ nhãn, thông báo và trạng thái dịch (EN/VI) | Tải tĩnh tại `src/i18n/request.ts` |

## 5) Files Expected To Change
- `src/config/routes.ts` (Sửa đổi)
- `src/i18n/request.ts` (Sửa đổi)
- `src/messages/vi/verify-email.json` (Tạo mới)
- `src/messages/en/verify-email.json` (Tạo mới)
- `src/app/[locale]/(auth)/verify-email/page.tsx` (Tạo mới)

## 6) Risks / Open Questions
- **R-01 (Middleware block)**: Middleware có thể chặn `/verify-email` hoặc tự động redirect về login do chưa xác thực đăng nhập.
  - *Giải pháp*: Cần nới lỏng middleware ở bước 08, cho phép `/verify-email` bỏ qua kiểm tra session hoặc chấp nhận truy cập tự do.
