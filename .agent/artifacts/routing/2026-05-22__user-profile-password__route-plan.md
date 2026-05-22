# Route Plan: Đổi mật khẩu (user-profile-password)

> Feature slug: `user-profile-password`
> Date: 2026-05-22
> Route scope: `/profile/password`

---

## 1) Summary
- Feature này thêm trang Đổi mật khẩu (`/profile/password`) cho khách hàng đã đăng nhập.
- Route thuộc nhóm `(protected)` group (yêu cầu xác thực người dùng thông qua Middleware kiểm tra JWT cookie).

## 1.1) Route Decision
- **Route type**: `new`
- **Server-first or client-heavy**: Server-first page entry, Client-heavy form rendering.
- **Why**: Trang chính `/profile/password/page.tsx` được xây dựng như một Server Component để tận dụng `generateMetadata` và thiết lập locale tĩnh (`setRequestLocale`), bảo đảm SEO. Phần lõi giao diện chứa form, đo độ mạnh mật khẩu và checklist được đẩy vào Client Component `PasswordChangeForm.tsx` để xử lý tương tác trực tiếp.

## 2) Route Files
| Route Path | File | Layout | Server / Client Notes | Metadata |
|---|---|---|---|---|
| `/profile/password` | `src/app/[locale]/(main)/(protected)/profile/password/page.tsx` | `ProfileLayoutWrapper` | **Server Component** bọc Client Form | Dynamic (`generateMetadata`) sử dụng `settings.json` |

## 3) Route Config Impact
| File | Change Needed | Notes |
|---|---|---|
| `src/config/routes.ts` | Thêm `PASSWORD: "/profile/password"` vào `PROTECTED_ROUTES` | Giúp đồng bộ hóa định nghĩa URL tĩnh trong toàn bộ dự án |

## 3.1) Server / Client Boundary Notes
| Area | Server or Client | Reason |
|---|---|---|
| `/profile/password/page.tsx` | Server | Xử lý metadata, thiết lập tĩnh locale bằng `setRequestLocale(locale)` của `next-intl`. |
| `PasswordChangeForm.tsx` | Client | Quản lý form state, tương tác ẩn/hiện mật khẩu, tính toán độ mạnh mật khẩu theo thời gian thực và gọi API mutation. |
| `ProfileSidebar.tsx` | Client | Cần truy cập `useAuthStore` để lấy thông tin người dùng đang đăng nhập và `usePathname` từ `next-intl` để xác định trạng thái active của menu items. |
| `ProfileLayoutWrapper.tsx` | Server | Chứa cấu trúc bao bọc 2 cột (sidebar + children) và breadcrumb. |

## 4) Locale / Navigation Impact
| Item | Locale Keys | Notes |
|---|---|---|
| `settings.json` (vi/en) | Thêm các key cho form đổi mật khẩu, checklist validation, toast và sidebar navigation | Đồng bộ hóa toàn bộ nhãn biểu mẫu, độ mạnh mật khẩu và thông báo lỗi. |

## 5) Files Expected To Change
- `src/app/[locale]/(main)/(protected)/profile/password/page.tsx` [NEW]
- `src/config/routes.ts` [MODIFY]
- `src/messages/vi/settings.json` [MODIFY]
- `src/messages/en/settings.json` [MODIFY]

## 6) Risks / Open Questions
- **R-01**: Cần đảm bảo rằng route `/profile/password` trùng khớp với cơ chế loại trừ trong `middleware.ts`. Vì `/profile` đã được đăng ký protected và middleware dùng `pathname.startsWith(route)` để check, nên `/profile/password` được tự động bảo vệ đúng chuẩn.
- **Q-01**: Để sidebar hoạt động nhất quán, nút click trên sidebar sẽ sử dụng `Link` từ `@/i18n/navigation` để chuyển trang kèm locale prefix tự động.
