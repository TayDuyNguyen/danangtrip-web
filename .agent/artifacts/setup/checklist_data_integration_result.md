# Checklist: 06-data-integration — Blog Detail Result

- [x] Data flow đúng: service → hook (TanStack Query) → UI: **Pass**
- [x] Custom hooks tạo tại `src/features/blog/hooks/`: **Pass** (`useBlogDetail`, `useBlogSidebar`, `useRelatedPosts`)
- [x] Query keys hierarchical: `["blog", "post", slug]`, `["blog", "sidebar"]`: **Pass**
- [x] `staleTime` set hợp lý (10-30 min cho blog data): **Pass**
- [x] Loading state: Skeleton screens: **Pass** (Created `BlogDetailSkeleton`)
- [x] Error state: normalize errors + toast notification (`sonner`): **Pass**
- [x] Empty state: hide decorative sections (Related Posts): **Pass**
- [x] Không có HTTP logic trực tiếp trong UI components: **Pass**
- [x] Không có fake/mock data trong production components: **Pass**
- [x] User-facing messages dùng i18n keys: **Pass**
- [x] Sibling components dùng chung query key → chỉ 1 request: **Pass**
- [x] `npm run typecheck` pass: **Pass**
- [x] `npm run lint` pass: **Pass**

---
**Kết quả: 13/13 Pass**
