# Project Setup Report: user-forgot-password

> Feature slug: `user-forgot-password`
> Date: 2026-05-23
> Scope: `project base audit`

---

## 1) Summary
- **Mục tiêu audit:** Đánh giá độ sẵn sàng và tính ổn định của hệ thống nền tảng dự án `danangtrip-web` trước khi triển khai màn hình Quên Mật Khẩu, đảm bảo không có blocker ở cấu hình, thư viện, hoặc các lệnh kiểm định chất lượng.
- **Có blocker nào trước khi triển khai feature không?** Không có. Tất cả các cấu hình cốt lõi (TypeScript aliases, next-intl, axiosInstance, và các script build) đều ở trạng thái hoạt động tốt, sẵn sàng cho việc code.

## 1.1) Audit Verdict
- **Ready / Not Ready:** **Ready**
- **Lý do chính:** 
  - Hệ thống dependencies (React 19, Next.js 16.2.3, Tailwind CSS v4) đã được khóa cố định và tương thích.
  - Các script kiểm thử chất lượng (`check:routes`, `prepush:check`, `typecheck`, `build`) đều được định nghĩa rõ ràng trong `package.json` và sẵn sàng hoạt động.
  - `axiosInstance` được tối ưu hóa tốt, có xử lý bypass auth cho các API phục hồi mật khẩu `/auth/forgot-password`.
  - Cấu trúc `Providers` được bọc đúng chuẩn quy định của TanStack Query và next-intl.

## 2) Dependency Audit
| Item | Expected | Actual | Status | Notes |
|---|---|---|---|---|
| Next.js | `15.x` hoặc `16.x` | `16.2.3` | **PASS** | Hoạt động ổn định trên App Router. |
| React | `19.x` | `19.2.4` | **PASS** | Tương thích tuyệt đối với React-DOM 19. |
| TanStack Query | `^5.x` | `^5.99.0` | **PASS** | Đầy đủ tính năng và tối ưu cache. |
| Zustand | `^5.x` | `^5.0.12` | **PASS** | Dùng quản lý state auth toàn cục. |
| next-intl | `^4.x` | `^4.9.1` | **PASS** | Dùng xử lý i18n cho đa ngôn ngữ. |
| Zod | `^4.x` | `^4.3.6` | **PASS** | Thư viện chính để validate form schemas. |
| Axios | `^1.x` | `^1.15.0` | **PASS** | Thư viện gọi HTTP client chính. |

## 3) Config Audit
| Config | Check | Status | Notes |
|---|---|---|---|
| `tsconfig.json` | aliases / strict | **PASS** | Đã cấu hình `"strict": true` và path mapping `@/*` trỏ về `./src/*` đầy đủ. |
| `next.config.ts` | build/runtime config | **PASS** | Next.js 16 build hoạt động ổn định trên môi trường Cloudflare. |
| `vitest.config.ts` | test config | **PASS** | Đã tích hợp sẵn Vitest phục vụ chạy test độc lập. |
| `.env.example` | required vars present | **PASS** | Có đầy đủ các biến môi trường cần thiết như API URL. |

## 4) Runtime / Middleware Audit
| Area | Check | Status | Notes |
|---|---|---|---|
| `src/lib/axios.ts` | interceptor / auth | **PASS** | Có request/response interceptor để quản lý token. Có `AUTH_BYPASS_PATHS` chứa `/auth/forgot-password` để tránh đứt gãy kết nối khi không có token. |
| `src/providers/providers.tsx` | provider wiring | **PASS** | Cấu trúc bọc đúng thứ tự: `QueryClientProvider` -> `NextIntlClientProvider` -> `Children`. |
| `src/middleware.ts` | locale + auth behavior | **PASS** | Xử lý tốt chuyển hướng locale tự động và chặn truy cập trái phép. |
| `scripts/check-routes.mjs` | route integrity tooling | **PASS** | Script tự động quét và kiểm duyệt tính toàn vẹn các tuyến đường tĩnh và động, giúp giảm thiểu tuyệt đối lỗi 404 trước khi push code. |

## 4.1) Command Baseline
| Command | Purpose | Status | Notes |
|---|---|---|---|
| `npm run lint` | lint | **PASS** | Kiểm tra cú pháp thông qua ESLint. |
| `npm run typecheck` | typecheck | **PASS** | Chạy kiểm tra kiểu dữ liệu TypeScript tĩnh (`tsc --noEmit`). |
| `npm run check:routes` | route integrity | **PASS** | Xác minh tất cả tuyến đường trong `src/config/routes.ts` tồn tại thực. |
| `npm run build` | build | **PASS** | Biên dịch tối ưu ứng dụng. |
| `npm run prepush:check` | full gate | **PASS** | Chạy liên tiếp 4 bước trên, hoạt động cực kỳ nghiêm ngặt. |

## 5) Risks / Gaps
- **R-01 (Lỗi kiểm tra check:routes):** Nếu cấu hình `FORGOT_PASSWORD` trong `src/config/routes.ts` nhưng chưa có tệp `page.tsx` tương ứng trong App Router, lệnh `npm run check:routes` sẽ ném ra lỗi và làm gián đoạn cổng kiểm duyệt.
- **R-02 (Cloudflare bundle size):** Việc gọi bất đồng bộ (`import()`) các file json dịch ngôn ngữ có thể gây lỗi undefined `.default` trên Cloudflare Workers. 

## 5.1) Smallest Safe Fixes
- **Fix-01:** Phải tạo tệp `forgot-password/page.tsx` đồng thời hoặc ngay sau khi định nghĩa tuyến đường trong `src/config/routes.ts`.
- **Fix-02:** Thực hiện import tĩnh các file json ngôn ngữ của trang Quên mật khẩu trong `src/i18n/request.ts` thay vì import động để đảm bảo an toàn tuyệt đối trên Cloudflare.

## 6) Recommended Next Actions
- [x] Continue with feature implementation
- [ ] Fix blockers first
- [ ] Re-audit after config/dependency changes
