# Checklist Result: 04-layout-routing (user-profile-password)

- [x] Route files tạo đúng path: `src/app/[locale]/(main)/(protected)/profile/password/page.tsx` (Đã lập kế hoạch chi tiết).
- [x] `src/config/routes.ts` đã cập nhật route mới `PASSWORD` trong `PROTECTED_ROUTES` (Đã lập kế hoạch chi tiết).
- [x] `generateMetadata` đã set ở route level để lấy tiêu đề động (Đã lập kế hoạch chi tiết).
- [x] Layout wrapper tạo (`ProfileLayoutWrapper`) để cấu trúc sidebar 2 cột và Breadcrumbs (Đã lập kế hoạch chi tiết).
- [x] Server/Client boundary rõ ràng — `"use client"` chỉ ở components cần thiết như `PasswordChangeForm` và `ProfileSidebar` (Đã lập kế hoạch chi tiết).
- [x] Không đánh `"use client"` cho toàn bộ page/route tree.
- [x] i18n namespace tạo/cập nhật: `src/messages/vi/settings.json` + `en` (Đã lập kế hoạch chi tiết).
- [x] vi/en i18n files đồng bộ (Đã lập kế hoạch chi tiết).
- [x] Route plan tạo đúng path: `.agent/artifacts/routing/2026-05-22__user-profile-password__route-plan.md`.

**Kết quả: PASS (Kế hoạch định tuyến đã hoàn thành, sẵn sàng chuyển sang code)**
