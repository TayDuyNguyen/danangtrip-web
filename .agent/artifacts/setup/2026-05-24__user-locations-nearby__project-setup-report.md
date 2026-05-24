# Project Setup Report: user-locations-nearby

> Feature slug: `user-locations-nearby`
> Date: 2026-05-24
> Scope: `project base audit`

---

## 1) Summary
- **Mục tiêu**: Audit cơ sở hạ tầng, các thư viện phụ thuộc, cấu hình định tuyến, và công cụ build/deploy của dự án `danangtrip-web` trước khi viết code tính năng Địa điểm lân cận (GPS).
- **Blocker**: Không tìm thấy bất kỳ blocker nào. Môi trường dự án cực kỳ đồng bộ và sạch sẽ.

## 1.1) Audit Verdict
- **Verdict**: **Ready (Sẵn sàng)**
- **Lý do chính**: Gói npm chứa đầy đủ thư viện hiện đại (Next.js 16 + React 19 + TanStack Query 5 + Zustand 5 + next-intl 4), hệ thống TSConfig alias chính xác, Axios client có token refresh queue tự động, và các lệnh kiểm tra chất lượng trước khi commit hoạt động hoàn hảo.

---

## 2) Dependency Audit

| Item | Expected | Actual | Status | Notes |
|---|---|---|---|---|
| Next.js | 16.x | `16.2.3` | **PASS** | App Router ổn định. |
| React | 19.x | `19.2.4` | **PASS** | Tương thích đầy đủ Next.js 16. |
| TanStack Query | v5 | `^5.99.0` | **PASS** | Dành cho fetch/cache phía client. |
| Zustand | v5 | `^5.0.12` | **PASS** | Quản lý state toàn cục (Auth). |
| next-intl | v4 | `^4.9.1` | **PASS** | Hỗ trợ đa ngôn ngữ tuyệt đối. |
| Zod | v4 | `^4.3.6` | **PASS** | Validate schemas ở boundary. |
| Axios | v1 | `^1.15.0` | **PASS** | Thư viện HTTP Client chính. |

---

## 3) Config Audit

| Config | Check | Status | Notes |
|---|---|---|---|
| `tsconfig.json` | aliases / strict | **PASS** | Khai báo alias `@/*` -> `./src/*` và các layer app, components, features đầy đủ. Bật `strict: true`. |
| `next.config.ts` | build/runtime config | **PASS** | Sử dụng Webpack config, wrap bằng `withNextIntl`, tương thích hoàn hảo. |
| `vitest.config.ts` | test config | **PASS** | Đã cấu hình Vitest chạy unit test phía client. |
| `.env.example` | required vars present | **PASS** | Khai báo `NEXT_PUBLIC_API_URL` đầy đủ cho môi trường API backend. |

---

## 4) Runtime / Middleware Audit

| Area | Check | Status | Notes |
|---|---|---|---|
| `src/lib/axios.ts` | interceptor / auth | **PASS** | Axios client có `Authorization` interceptor, cookie fallback, và refresh token automatic queue cực kỳ cao cấp. |
| `src/providers/providers.tsx` | provider wiring | **PASS** | `QueryClientProvider` bọc ngoài `NextIntlClientProvider`, cung cấp data cache và đa ngôn ngữ ổn định. |
| `src/middleware.ts` | locale + auth behavior | **PASS** | Middleware Edge runtime quản lý chuyển hướng trang bảo vệ và đồng bộ hóa ngôn ngữ an toàn. |
| `scripts/check-routes.mjs` | route integrity tooling | **PASS** | Script kiểm tra định tuyến tự động tồn tại và sẵn sàng hoạt động. |

---

## 4.1) Command Baseline

| Command | Purpose | Status | Notes |
|---|---|---|---|
| `npm run lint` | Linter | **PASS** | Kiểm tra cú pháp và code style của dự án. |
| `npm run typecheck` | Type check | **PASS** | Biên dịch TypeScript không xuất file để check kiểu. |
| `npm run check:routes` | Route integrity | **PASS** | Kiểm tra tính nhất quán của file config routes với các page thực tế. |
| `npm run build` | Next build | **PASS** | Tạo bundle production thành công. |
| `npm run prepush:check` | Full gate check | **PASS** | Chạy liên hoàn lint + typecheck + check:routes + build trước khi đẩy code. |

---

## 5) Risks / Gaps
- **R-01 (Map Provider Key/Library)**: Dự án không cài đặt sẵn Google Maps hay Leaflet. Tự ý cài đặt gói ngoài có thể gây xung đột với React 19.
  * *Hạn chế rủi ro*: Sử dụng Map Simulator trực quan cao cấp bằng SVG/CSS, giữ cho component hoàn toàn cô lập để dễ nâng cấp về sau.

---

## 5.1) Smallest Safe Fixes
- **Fix-01**: Giữ kiến trúc Map Simulator hoàn toàn tách biệt trong thư mục feature `nearby`, không ảnh hưởng đến các components dùng chung khác của dự án.

---

## 6) Recommended Next Actions
- [x] Continue with feature implementation (Tiến hành triển khai các bước API Contract và định tuyến định dạng tiếp theo).
