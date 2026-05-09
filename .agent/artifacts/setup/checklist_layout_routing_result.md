# Checklist: 04-layout-routing

- [x] Route files tạo đúng path: `src/app/[locale]/(main)/(public)/blog/[slug]/page.tsx`: **Pass**
- [x] `src/config/routes.ts` đã cập nhật route mới (`BLOG_DETAIL`): **Pass**
- [x] `generateMetadata` đã set ở route level (dynamic theo post slug): **Pass**
- [x] Layout wrapper sử dụng đúng với existing layouts: **Pass**
- [x] Server/Client boundary rõ ràng — `"use client"` chỉ ở components cần thiết: **Pass**
- [x] Không đánh `"use client"` cho toàn bộ page/route tree: **Pass**
- [x] i18n namespace đã sẵn sàng (`blog` namespace): **Pass**
- [x] vi/en i18n files đồng bộ: **Pass**
- [x] Skeleton layout renders — route navigable: **Pass**
- [x] `npm run check:routes` pass: **Pass**
- [x] `npm run typecheck` pass: **Pass**

---
**Kết quả: 11/11 Pass**
