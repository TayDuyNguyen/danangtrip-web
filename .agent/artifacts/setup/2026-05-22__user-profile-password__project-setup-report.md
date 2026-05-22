# Project Setup Report: Đổi mật khẩu (user-profile-password)

> Feature slug: `user-profile-password`
> Date: 2026-05-22
> Scope: `project base audit`

---

## 1) Summary
- Audit này phục vụ mục tiêu đánh giá hiện trạng dự án trước khi triển khai tính năng Đổi mật khẩu (`/profile/password`), bảo đảm các quality gates hoạt động bình thường, không gây blocker cho luồng tích hợp.
- Không có blocker nào trước khi triển khai feature.

## 1.1) Audit Verdict
- **Ready**
- Lý do chính: Tất cả các kiểm tra tĩnh (ESLint, TypeScript compile, Route check) và production build đều vượt qua thành công với 0 lỗi. Cấu trúc thư mục của dự án và các thiết lập axios, providers, middleware hoạt động khớp với đặc tả của dự án.

## 2) Dependency Audit
| Item | Expected | Actual | Status | Notes |
|---|---|---|---|---|
| Next.js | `latest` / `16.x` | `16.2.3` | **PASS** | Hoạt động tốt |
| React | `19.x` | `19.2.4` | **PASS** | Bản chính thức |
| TanStack Query | `v5` | `^5.99.0` | **PASS** | Hỗ trợ caching và deduplication |
| Zustand | `v5` | `^5.0.12` | **PASS** | Quản lý auth state |
| next-intl | `v4` | `^4.9.1` | **PASS** | Đa ngôn ngữ |
| Zod | `v4` | `^4.3.6` | **PASS** | Dùng cho validation schema |
| Axios | `v1` | `^1.15.0` | **PASS** | HTTP Client chính |

## 3) Config Audit
| Config | Check | Status | Notes |
|---|---|---|---|
| `tsconfig.json` | aliases / strict | **PASS** | `strict: true` được bật, aliases `@/*` trỏ tới `./src/*` hoạt động chuẩn. |
| `next.config.ts` | build/runtime config | **PASS** | Sử dụng wrapper `withNextIntl`, config bảo mật header tốt. |
| `vitest.config.ts` | test config | **PASS** | Cấu hình cho vitest sẵn sàng chạy. |
| `.env.example` | required vars present | **PASS** | Có đầy đủ các biến môi trường cần thiết như `NEXT_PUBLIC_API_URL` và `API_BASE_URL`. |

## 4) Runtime / Middleware Audit
| Area | Check | Status | Notes |
|---|---|---|---|
| `src/lib/axios.ts` | interceptor / auth | **PASS** | Tự động đính kèm `Bearer token` từ helper, tự động refresh token và có cơ chế fallback sang API dự phòng khi server chính lỗi. |
| `src/providers/providers.tsx` | provider wiring | **PASS** | `QueryClientProvider` bọc ngoài `NextIntlClientProvider` đúng thứ tự theo rule. |
| `src/middleware.ts` | locale + auth behavior | **PASS** | Edge middleware hoạt động ổn định, bảo vệ các route con của `/profile`, `/bookings`, `/favorites`, `/notifications` và redirect kèm `callbackUrl`. |
| `scripts/check-routes.mjs` | route integrity tooling | **PASS** | Phát hiện các route bị lệch giữa code và khai báo config. |

## 4.1) Command Baseline
| Command | Purpose | Status | Notes |
|---|---|---|---|
| `npm run lint` | lint | **PASS** | 0 warning / 0 error. |
| `npm run typecheck` | typecheck | **PASS** | Biên dịch TypeScript thành công. |
| `npm run check:routes` | route integrity | **PASS** | Đã xác minh 20 active routes hợp lệ. |
| `npm run build` | build | **PASS** | Next.js production build hoàn tất thành công. |
| `npm run prepush:check` | full gate | **PASS** | Đã chạy và kiểm chứng độc lập tất cả các step của gate thành công. |

## 5) Risks / Gaps
- **R-01**: Thiết kế giao diện đổi mật khẩu sử dụng Dark Theme (`bg-[#080808]/40 border border-[#262626] backdrop-blur-md`) trong khi spec ban đầu mô tả Light Theme.
  - *Đánh giá*: Đã có giải pháp ánh xạ giao diện theo [DESIGN.md](file:///d:/DATN/danangtrip-web/DESIGN.md) trong Kế hoạch triển khai.
- **R-02**: Sự đồng bộ của phần Sidebar chung giữa các màn hình trong phân hệ profile (`/profile`, `/profile/password`, `/favorites`, `/notifications`, `/bookings`).
  - *Đánh giá*: Cần tạo layout bọc dùng chung để tránh trùng lặp code và đảm bảo giao diện đồng bộ.

## 5.1) Smallest Safe Fixes
- **Fix-01**: Tách riêng component `ProfileSidebar.tsx` và `ProfileLayoutWrapper.tsx` dưới `src/features/profile/components`.
- **Fix-02**: Bọc các trang `/profile` và `/profile/password` bên trong layout dùng chung này.

## 6) Recommended Next Actions
- [x] Continue with feature implementation (Chuyển sang Bước 4: Layout & Routing)
- [ ] Fix blockers first
- [ ] Re-audit after config/dependency changes
