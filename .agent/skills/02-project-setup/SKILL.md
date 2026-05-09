# Skill: 02-project-setup (Khởi tạo/Chuẩn bị Project Base)

## 0) Tuyên bố tự mô tả
Skill này dùng khi cần setup hoặc verify project base trước khi triển khai màn hình. Chỉ chạy 1 lần cho project mới, hoặc khi cần audit lại setup.

## 1) Goal
Đảm bảo project base **chạy được, cấu hình đúng, folder structure rõ ràng** trước khi bắt tay vào triển khai màn hình cụ thể.

## 2) Persona (mandatory)
Đóng vai: **DevOps Engineer**. Đọc `persona.md` trước khi làm.

## 3) Input & Context (must read first)
- `persona.md`
- `.agent/rules/PROJECT_RULES.md` (kiến trúc mục tiêu)
- `DESIGN.md` (design tokens)
- `package.json` (dependencies hiện tại)
- `tsconfig.json`, `next.config.ts`, `tailwind.config.ts/postcss.config.mjs`

## 4) Workflow

### 4.1 Project mới (chưa có repo)
1. `npx create-next-app@latest ./` với App Router, TypeScript strict, Tailwind CSS.
2. Cài dependencies core:
   - `@tanstack/react-query` — client data fetching
   - `zustand` — global client state
   - `next-intl` — i18n
   - `zod` — validation
   - `axios` — HTTP client
   - `sonner` — toast notifications
   - `clsx` + `tailwind-merge` — class utilities
   - `lucide-react` — icon set (Solar)
3. Setup folder structure theo `PROJECT_RULES.md` Section 3.
4. Setup API client: `src/lib/api-client.ts` (axios instance + interceptors).
5. Setup TanStack Query Provider: `src/providers/query-provider.tsx`.
6. Setup Zustand store base: `src/store/`.
7. Setup i18n: `src/i18n/`, `src/messages/vi/`, `src/messages/en/`.

### 4.2 Project đã có (audit & fix)
1. Verify folder structure match `PROJECT_RULES.md`.
2. Verify dependencies đã cài đủ.
3. Verify config files: `tsconfig.json` strict mode, path aliases.
4. Verify providers: QueryProvider, next-intl wrapping.
5. Verify API client: interceptors, error handling.
6. Verify `.env.example` có đầy đủ biến.

### 4.3 Validation
7. `npm run dev` — project chạy không lỗi.
8. `npm run typecheck` — TypeScript pass.
9. `npm run lint` — linting pass.

## 5) Strict Rules
- Không thêm dependency không cần thiết.
- TypeScript strict mode bắt buộc.
- Folder structure phải match `PROJECT_RULES.md` — không tự ý thêm top-level dirs.
- `.env.example` luôn cập nhật khi thêm env vars.

## 6) Output specification
- Project chạy được với `npm run dev`
- Tất cả quality gates pass: lint, typecheck
- Report kết quả setup tại:
  - `.agent/artifacts/setup/YYYY-MM-DD__project-setup-report.md` (nếu là lần đầu)

## 7) Control
Đối chiếu `checklist.md` và report Pass/Fail.
