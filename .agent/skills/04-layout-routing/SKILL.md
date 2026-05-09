# Skill: 04-layout-routing (Xây dựng Layout & Route)

## 0) Tuyên bố tự mô tả
Skill này chịu trách nhiệm tạo route, layout wrapper, và phân chia Server/Client Component cho 1 màn hình.

## 1) Goal
- Tạo **route** hoạt động dưới App Router
- Setup **layout wrapper** (nếu cần sidebar, header riêng)
- Phân tích và phân chia **Server Component vs Client Component**
- Cập nhật **route registry** và **i18n namespaces**

## 2) Persona (mandatory)
Đóng vai: **Senior Software Engineer (SSE)**. Đọc `persona.md` trước khi làm.

## 3) Input & Context (must read first)
- `persona.md`
- `.agent/rules/PROJECT_RULES.md` (Sections 6, 7, 8)
- Screen analysis: `.agent/artifacts/analysis/`
- Existing routes: `src/app/[locale]/`
- Route config: `src/config/routes.ts`
- i18n config: `src/i18n/`, `src/messages/`

## 4) Workflow

### 4.1 Tạo Route
1. Xác định route path: `src/app/[locale]/<route>/page.tsx`
2. Dynamic routes nếu cần: `src/app/[locale]/<route>/[id]/page.tsx`
3. Page metadata: set `generateMetadata` ở route level.
4. Cập nhật `src/config/routes.ts` với route mới.

### 4.2 Layout Wrapper
5. Nếu route cần layout riêng (sidebar, sub-header):
   - Tạo `src/app/[locale]/<route>/layout.tsx`
   - Compose với existing layout components từ `src/components/layout/`
6. Nếu dùng layout chung: verify layout chain từ root → page.

### 4.3 Server/Client Boundary
7. **Phân tích** mỗi phần của page:
   - **Server Component** (default): static content, SEO metadata, initial data fetch
   - **Client Component** (`"use client"`): forms, interactive tables, modals, search, state-dependent UI
8. **Pattern**: Page (Server) → import Client sections with `"use client"` boundary rõ ràng.
9. **Không** đánh `"use client"` cho toàn bộ page trừ khi thật sự cần.

### 4.4 i18n Setup
10. Tạo namespace trong `src/messages/vi/<feature>.json` và `src/messages/en/<feature>.json`.
11. Đăng ký namespace nếu cần.
12. Verify pattern: scoped `useTranslations("<namespace>")` là default.

### 4.5 Skeleton Layout
13. Tạo layout skeleton (placeholder structure) để verify:
    - Route navigable
    - Layout renders
    - i18n loads
    - Metadata correct

## 5) Strict Rules
- Route PHẢI tồn tại trước khi có visible link.
- `src/config/routes.ts` PHẢI cập nhật khi thêm route.
- i18n: vi/en PHẢI đồng bộ.
- Không dùng `"use client"` cho toàn route tree.
- Metadata ở route level, không scatter vào components.

## 6) Output specification
Files tạo/sửa:
- `src/app/[locale]/<route>/page.tsx`
- `src/app/[locale]/<route>/layout.tsx` (nếu cần)
- `src/config/routes.ts` (cập nhật)
- `src/messages/vi/<feature>.json` + `src/messages/en/<feature>.json`

Validation:
- `npm run check:routes`
- `npm run typecheck`

## 7) Control
Đối chiếu `checklist.md` và report Pass/Fail.
