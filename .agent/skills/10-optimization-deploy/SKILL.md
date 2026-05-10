# Skill: 10-optimization-deploy (Optimization & Build/Deploy)

## 0) Tuyên bố tự mô tả
Skill này chịu trách nhiệm optimization (performance, SEO, accessibility) và build/deploy lên production.

## 1) Goal
- **Performance**: Lighthouse score > 90
- **SEO**: metadata, Open Graph
- **Accessibility**: aria-labels, keyboard navigation, color contrast
- **Build**: `next build` pass, không lỗi
- **Deploy**: deploy thành công, smoke test OK

## 2) Persona (mandatory)
Đóng vai: **Performance Engineer + DevOps Engineer**. Đọc `persona.md` trước khi làm.

## 3) Input & Context (must read first)
- `persona.md`
- `.agent/rules/PROJECT_RULES.md` (Sections 6, 12, 14, 17, 21)
- `DESIGN.md` (motion tokens, animation rules)
- `next.config.ts`, `package.json` (build config)
- `wrangler.jsonc` / deploy config (Cloudflare)
- `.env.example` (env vars)

## 4) Workflow

### 4.1 Performance Optimization
1. **React optimization**:
   - `React.memo` cho expensive components.
   - `useMemo` cho expensive computations.
   - `useCallback` cho stable callback references.
   - Chỉ optimize khi có performance issue thật — không premature optimize.
2. **Code splitting**:
   - `dynamic(() => import(...))` cho modals, heavy components, charts.
   - Lazy load components không visible on first render.
3. **Images**:
   - `next/image` cho tất cả images.
   - `priority` cho above-the-fold images.
   - Responsive `sizes` prop.
   - `loading="lazy"` cho below-the-fold.
4. **Data fetching**:
   - Verify `staleTime` hợp lý.
   - Prefetch critical data.
   - Parallel requests (không waterfall).
5. **Bundle analysis**: verify no unnecessary large dependencies.

### 4.2 SEO
6. **Metadata** ở route level:
   ```tsx
   export const metadata: Metadata = {
     title: '...',
     description: '...',
     openGraph: { ... },
   };
   ```
   Hoặc `generateMetadata` cho dynamic pages.
7. **Heading hierarchy**: 1 `<h1>` per page, đúng thứ tự h1→h2→h3.
8. **Semantic HTML**: `<main>`, `<nav>`, `<article>`, `<section>`, `<aside>`.
9. **Structured data**: JSON-LD nếu applicable (tours, locations).

### 4.3 Accessibility
10. **aria-labels**: cho interactive elements (buttons, links, inputs).
11. **Keyboard navigation**: Tab order logic, focus management.
12. **Color contrast**: WCAG AA (4.5:1 for text, 3:1 for large text).
13. **Screen reader**: semantic HTML + aria roles.
14. **Focus states**: visible focus indicators.
15. **Alt text**: cho images.

16. Run mandatory quality gate:
    ```bash
    npm run prepush:check
    ```
17. Fix tất cả build errors.
18. Verify `.env` đúng cho target environment (dev/staging/prod).

### 4.5 Deploy
19. **Cloudflare (primary)**:
    ```bash
    npm run build:cloudflare
    npm run deploy:cloudflare
    ```
20. **Docker (alternative)**:
    - `docker build -t danangtrip-web .`
    - Push to registry
    - Deploy to K8s/VPS
21. **Vercel (alternative)**:
    - `vercel deploy --prod`

### 4.6 Smoke Test
22. Post-deploy verification:
    - Navigate to deployed URL → page loads.
    - Test critical user flows (CRUD, search, auth).
    - Verify API connections work.
    - Verify i18n (switch locale).
    - Check browser console for errors.
    - Mobile responsiveness.

## 5) Strict Rules
- **Không premature optimize**: chỉ optimize khi có evidence.
- **Build PHẢI pass**: không deploy với build errors.
- **`.env` đúng môi trường**: dev ≠ staging ≠ prod.
- **Smoke test bắt buộc**: không declare done mà chưa smoke test.
- **No console.log**: remove debug logs trước deploy.
- **Entrance animations**: `reveal-up` classes theo PROJECT_RULES.
- **Bắt buộc review trước khi push**: Phải sinh ra file `review.md` và trình USER duyệt. TUYỆT ĐỐI KHÔNG TỰ Ý `git push`.
- **Quy tắc tên nhánh (Branch Naming)**: Phải dùng format `<viết tắt chức năng>/DATN-<số thứ tự>/<nội dung ngắn gọn>` (ví dụ: `feat/DATN-54/api-align-location`).

## 6) Output specification
- Performance report (Lighthouse scores)
- Build logs (success confirmation)
- Deploy confirmation (URL)
- Smoke test report (Pass/Fail)
- Deploy Report: `.agent/artifacts/deploy/YYYY-MM-DD__<feature-slug>__deploy-report.md` (Phải bao gồm: Tên nhánh, Commit message, và bảng trạng thái các Quality Gates).
- **Feature Review/Walkthrough**: `.agent/artifacts/review/YYYY-MM-DD__<feature-slug>__review.md` (Bản tổng kết cực kỳ chi tiết toàn bộ quá trình thực hiện từ Bước 1 đến Bước 10:
  1. Phân tích yêu cầu/SRS.
  2. Thiết kế cấu trúc dữ liệu/Zod Schema.
  3. Xây dựng Service & Mock API (nếu có).
  4. Xây dựng Hooks & State logic.
  5. Phát triển UI Components & Layout.
  6. Tích hợp i18n (đa ngôn ngữ).
  7. Viết Unit Tests & Integration Tests.
  8. Kiểm thử E2E bằng Browser Subagent.
  9. Tối ưu Performance, SEO & Accessibility.
  10. Fix bugs phát sinh & Build Verification).
  Mỗi bước phải mô tả rõ các file đã thay đổi và lý do thực hiện.

## 7) Control
Đối chiếu `checklist.md` và report Pass/Fail. Đảm bảo file `review.md` đã được tạo để lưu vết toàn bộ quá trình.
