# Project Setup Report: user-search-hardening

> Feature slug: `user-search-hardening`
> Date: 2026-05-28
> Scope: `project base audit`

---

## 1) Summary
- **Mục tiêu**: Xác thực toàn bộ nền tảng mã nguồn (dependencies, config, middleware, scripts) của dự án `danangtrip-web` trước khi triển khai chi tiết tính năng tìm kiếm `user-search-hardening`.
- **Verdict**: **Ready** — Các dependency cốt lõi, tập lệnh cấu hình, bí danh đường dẫn và các cấu hình middleware/axios đều hoạt động ổn định và sẵn sàng cho việc code.

## 1.1) Audit Verdict
- **Ready / Not Ready**: Ready
- **Lý do chính**: Stack của dự án đáp ứng đầy đủ yêu cầu (Next.js v16, React v19, Tailwind v4, Zustand v5, Zod v4). Các scripts kiểm tra chất lượng mã nguồn quan trọng (`lint`, `typecheck`, `check:routes`, `prepush:check`) đều đã được tích hợp đầy đủ trong `package.json`.

## 2) Dependency Audit
| Item | Expected | Actual | Status | Notes |
|---|---|---|---|---|
| Next.js | ^15 hoặc ^16 | `16.2.3` | PASS | |
| React | ^19 | `19.2.4` | PASS | |
| TanStack Query | ^5 | `5.99.0` | PASS | |
| Zustand | ^5 | `5.0.12` | PASS | |
| next-intl | ^4 | `4.9.1` | PASS | |
| Zod | ^4 | `4.3.6` | PASS | |
| Tailwind CSS | ^4 | `^4` | PASS | Sử dụng Tailwind CSS v4 |
| Axios | ^1 | `1.15.0` | PASS | |

## 3) Config Audit
| Config | Check | Status | Notes |
|---|---|---|---|
| `tsconfig.json` | aliases / strict | PASS | Định nghĩa đầy đủ các đường dẫn alias `@/*` và thiết lập `"strict": true` |
| `next.config.ts` | build/runtime config | PASS | Cấu hình webpack dev server ổn định |
| `.env.example` | required vars present | PASS | Cung cấp đầy đủ `NEXT_PUBLIC_API_URL` |

## 4) Runtime / Middleware Audit
| Area | Check | Status | Notes |
|---|---|---|---|
| `src/lib/axios.ts` | interceptor / auth | PASS | Có interceptor để gắn Bearer Token tự động từ cookie và xử lý lỗi 401 |
| `src/providers/providers.tsx` | provider wiring | PASS | QueryClientProvider và NextIntlClientProvider được tích hợp chính xác |
| `src/middleware.ts` | locale + auth behavior | PASS | Xử lý next-intl routing kết hợp kiểm tra xác thực người dùng |
| `scripts/check-routes.mjs` | route integrity tooling | PASS | Sử dụng script để kiểm tra tính toàn vẹn của các tuyến đường |

## 4.1) Command Baseline
| Command | Purpose | Status | Notes |
|---|---|---|---|
| `npm run lint` | lint | PASS | Chạy trình linter ESLint |
| `npm run typecheck` | typecheck | PASS | Kiểm tra kiểu TypeScript (`tsc --noEmit`) |
| `npm run check:routes` | route integrity | PASS | Kiểm tra file cấu hình route khớp với cây thư mục |
| `npm run build` | build | PASS | Build bản sản phẩm Next.js |
| `npm run prepush:check` | full gate | PASS | Tích hợp tất cả các kiểm tra trên để chạy trước khi đẩy mã nguồn |

## 5) Risks / Gaps
- **R-01**: Cổng kiểm tra trước khi đẩy code (`npm run prepush:check`) có thể tốn thời gian chạy trên các môi trường máy tính cá nhân yếu do Next.js tối ưu hóa build.
- **R-02**: Không chạy lệnh Vitest nếu chưa có test suite cụ thể cho search page.

## 5.1) Smallest Safe Fixes
- **Fix-01**: Luôn chạy `npm run prepush:check` sau cùng khi hoàn thiện code để kiểm tra toàn bộ.

## 6) Recommended Next Actions
- [x] Continue with feature implementation
