# STACK SKILLS INDEX — Pipeline tài liệu và triển khai màn hình A→Z

File này là master index cho bộ 10 skill trong `.agent/skills/` của `danangtrip-web`.
Mục tiêu là giúp AI chọn đúng skill, đọc đúng context, và sinh ra **tài liệu chi tiết dùng được cho dự án**.

## Mục tiêu của bộ skill này

- Bám repo thực tế của `danangtrip-web`
- Ưu tiên tài liệu chi tiết trước hoặc song song với code
- Chuẩn hóa output giữa các bước
- Tránh lỗi chữ, lỗi format, và reference sai

## Quy ước chung

### 1) Source of truth

Ưu tiên theo thứ tự:

1. `.agent/rules/PROJECT_RULES.md`
2. Repo thật: `package.json`, `src/`, `next.config.ts`, `vitest.config.ts`, `scripts/`
3. Từng `SKILL.md`

### 2) Artifact naming

```text
.agent/artifacts/<group>/YYYY-MM-DD__<feature-slug>__<artifact-name>.md
```

### 3) Markdown standard

- UTF-8
- 1 H1 duy nhất
- Có metadata: feature slug, date, source
- Nếu chưa chắc: ghi `[ASSUMPTION]`
- Không để lỗi ký tự mã hóa

### 4) Chuẩn mức chi tiết

Một artifact tốt phải trả lời được:

- Đang làm feature nào?
- Dựa vào nguồn nào?
- Những file nào liên quan?
- Rule nghiệp vụ hoặc technical decision là gì?
- Còn rủi ro hoặc câu hỏi mở nào?

## Stack thực tế của dự án

| Hạng mục | Công nghệ |
|---|---|
| Framework | Next.js App Router (latest) |
| React | 19.x |
| Styling | Tailwind CSS v4 |
| Data fetching | TanStack Query v5 |
| State | Zustand v5 |
| Validation | Zod v4 |
| HTTP | Axios v1 |
| i18n | next-intl v4 |
| Forms | react-hook-form + zodResolver |
| Testing | Vitest v4 |
| Deploy | Cloudflare Workers via OpenNext |

## Pipeline 10 Skills

| # | Skill | Khi dùng | Output chính | Có thể bỏ qua khi |
|---|---|---|---|---|
| 01 | `01-screen-analysis` | Có mockup/SRS/màn hình mới | `analysis/...__screen-analysis.md` | Chỉ sửa bug rất nhỏ, không đổi UI/flow |
| 02 | `02-project-setup` | Cần audit base hoặc xác minh cấu hình | `setup/...__project-setup-report.md` | Base vừa audit gần đây và không đổi stack |
| 03 | `03-types-api-contract` | Có contract/type/validator/service mới | `api-contracts/...__api-contract.md` | Chỉ sửa text/style, không chạm data |
| 04 | `04-layout-routing` | Có route/page/layout/metadata/i18n route mới | `routing/...__route-plan.md` | Chỉ sửa component con trong page sẵn có |
| 05 | `05-ui-components` | Cần build hoặc refactor UI components | `ui-specs/...__ui-spec.md` | Chỉ sửa logic không đổi UI structure |
| 06 | `06-data-integration` | Cần nối API thật vào UI | `integration/...__data-integration.md` | UI tĩnh hoặc server-only nhỏ, chưa cần query plan |
| 07 | `07-interactions` | Có form, filter, search, pagination, mutation | `interaction-specs/...__interaction-spec.md` | Page read-only, không có interaction đáng kể |
| 08 | `08-auth-permissions` | Có auth, middleware, role-based UI | `auth/...__auth-permissions-review.md` | Feature hoàn toàn public và không đổi quyền |
| 09 | `09-testing` | Trước khi bàn giao | `test-cases/...__test-report.md` | Không nên bỏ qua |
| 10 | `10-optimization-deploy` | Trước khi handoff/push/deploy | `deploy/...__deploy-report.md`, `review/...__review.md` | Không nên bỏ qua |

## Kích hoạt nhanh theo loại việc

### Nếu đang làm màn hình mới

1. `01-screen-analysis`
2. `03-types-api-contract`
3. `04-layout-routing`
4. `05-ui-components`
5. `06-data-integration`
6. `07-interactions`
7. `08-auth-permissions` nếu cần
8. `09-testing`
9. `10-optimization-deploy`

### Nếu chỉ audit project

1. `02-project-setup`
2. `09-testing` nếu cần ghi validation evidence

### Nếu chỉ sửa UI nhỏ

1. `01-screen-analysis` dạng nhẹ nếu cần làm rõ scope
2. `05-ui-components`
3. `09-testing`

## File nên đọc trước hầu hết task

- `.agent/rules/PROJECT_RULES.md`
- `package.json`
- `src/config/api.ts`
- `src/config/routes.ts`
- `src/lib/axios.ts`
- `src/store/auth.store.ts`
- `src/i18n/routing.ts`
- `src/messages/vi/`
- `src/messages/en/`

## Prompt Kích Hoạt Từng Skill

Mỗi skill có prompt riêng với các trường bắt buộc trong `[...]`.
Copy prompt tương ứng, điền vào các trường `[...]`, rồi gửi cho AI.

---

### Skill 01 — Screen Analysis

```text
Kích hoạt 01-screen-analysis

Context:
- Repo: [d:/DATN/danangtrip-web]
- Feature slug: [tour-list]
- Screen name: [Trang danh sách Tour]
- Figma/Stitch: [https://www.figma.com/... | https://stitch.withgoogle.com/... | NONE]
- Input source: [d:/DATN/DATN_Tài liệu/mockup/tour-list.png | SRS section 2.3 | NONE]
- DESIGN.md: [d:/DATN/danangtrip-web/DESIGN.md]
- API docs: [d:/DATN/DATN_Tài liệu/docs/api/api_list.md]
- Output: [.agent/artifacts/analysis/2026-05-11__tour-list__screen-analysis.md]
```

**Ví dụ thực tế:**
```text
Kích hoạt 01-screen-analysis

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: tour-list
- Screen name: Trang danh sách Tour
- Figma/Stitch: https://www.figma.com/design/xyz789/DanangTrip-Web?node-id=5-20
- Input source: d:/DATN/DATN_Tài liệu/mockup/web-tour-list.png
- DESIGN.md: d:/DATN/danangtrip-web/DESIGN.md
- API docs: d:/DATN/DATN_Tài liệu/docs/api/api_list.md
- Output: .agent/artifacts/analysis/2026-05-11__tour-list__screen-analysis.md
```

**Output mong đợi:** `analysis/2026-05-11__tour-list__screen-analysis.md` với design token audit (đối chiếu DESIGN.md + Figma), bảng component breakdown [REUSE]/[NEW]/[MOD], UI states per section, data/API mapping, server/client ownership, business rules BR-xx, edge cases EC-xx.

---

### Skill 02 — Project Setup Audit

```text
Kích hoạt 02-project-setup

Context:
- Repo: [d:/DATN/danangtrip-web]
- Feature slug: [project-base | tour-list]
- Lý do audit: [Trước feature mới | Nghi ngờ stack drift | Onboarding]
- Output: [.agent/artifacts/setup/2026-05-11__project-base__project-setup-report.md]
```

**Ví dụ thực tế:**
```text
Kích hoạt 02-project-setup

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: project-base
- Lý do audit: Bắt đầu sprint mới, cần verify Next.js config + middleware + Cloudflare setup
- Output: .agent/artifacts/setup/2026-05-11__project-base__project-setup-report.md
```

**Output mong đợi:** `setup/2026-05-11__project-base__project-setup-report.md` với verdict ready/not ready, pass/fail từng nhóm (dependency, config, runtime/middleware, command baseline).

---

### Skill 03 — Types & API Contract

```text
Kích hoạt 03-types-api-contract

Context:
- Repo: [d:/DATN/danangtrip-web]
- Feature slug: [tour-list]
- Analysis file: [.agent/artifacts/analysis/2026-05-11__tour-list__screen-analysis.md]
- API docs: [d:/DATN/DATN_Tài liệu/docs/api/api_list.md]
- Endpoints liên quan: [GET /api/tours, GET /api/tours/:slug, GET /api/categories]
- Output: [.agent/artifacts/api-contracts/2026-05-11__tour-list__api-contract.md]
```

**Ví dụ thực tế:**
```text
Kích hoạt 03-types-api-contract

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: tour-list
- Analysis file: .agent/artifacts/analysis/2026-05-11__tour-list__screen-analysis.md
- API docs: d:/DATN/DATN_Tài liệu/docs/api/api_list.md
- Endpoints liên quan: GET /api/tours (list + filter + pagination), GET /api/tours/:slug (detail), GET /api/categories (lookup)
- Output: .agent/artifacts/api-contracts/2026-05-11__tour-list__api-contract.md
```

**Output mong đợi:** `api-contracts/2026-05-11__tour-list__api-contract.md` với Tour entity type, TourListParams, Zod schema (z.infer export), service contract plan, files expected to change.

---

### Skill 04 — Layout & Routing

```text
Kích hoạt 04-layout-routing

Context:
- Repo: [d:/DATN/danangtrip-web]
- Feature slug: [tour-list]
- Analysis file: [.agent/artifacts/analysis/2026-05-11__tour-list__screen-analysis.md]
- Route path mong muốn: [/tours]
- Route group: [(public) | (auth) | (protected)]
- Có page mới không: [Có — /tours (list), /tours/[slug] (detail) | Không]
- Server hay Client: [Server Component với client filter | Toàn client]
- i18n namespace mới: [tour | NONE]
- Output: [.agent/artifacts/routing/2026-05-11__tour-list__route-plan.md]
```

**Ví dụ thực tế:**
```text
Kích hoạt 04-layout-routing

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: tour-list
- Analysis file: .agent/artifacts/analysis/2026-05-11__tour-list__screen-analysis.md
- Route path mong muốn: /tours
- Route group: (public)
- Có page mới không: Có — /tours (list page), /tours/[slug] (detail page)
- Server hay Client: Server Component prefetch initial data, TourListClient cho filter/search
- i18n namespace mới: tour (src/messages/vi/tour.json + en/tour.json)
- Output: .agent/artifacts/routing/2026-05-11__tour-list__route-plan.md
```

**Output mong đợi:** `routing/2026-05-11__tour-list__route-plan.md` với App Router file structure, generateMetadata plan, server/client boundary per section, i18n keys cần thêm, route config impact.

---

### Skill 05 — UI Components

```text
Kích hoạt 05-ui-components

Context:
- Repo: [d:/DATN/danangtrip-web]
- Feature slug: [tour-list]
- Analysis file: [.agent/artifacts/analysis/2026-05-11__tour-list__screen-analysis.md]
- DESIGN.md: [d:/DATN/danangtrip-web/DESIGN.md]
- Components cần đặc biệt chú ý: [TourCard, TourGrid, TourCategoryFilter | NONE]
- Output: [.agent/artifacts/ui-specs/2026-05-11__tour-list__ui-spec.md]
```

**Ví dụ thực tế:**
```text
Kích hoạt 05-ui-components

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: tour-list
- Analysis file: .agent/artifacts/analysis/2026-05-11__tour-list__screen-analysis.md
- DESIGN.md: d:/DATN/danangtrip-web/DESIGN.md
- Components cần đặc biệt chú ý: TourCard (glass surface theo DESIGN.md), TourGrid (responsive 1→2→3 cols), TourCategoryFilter (pill tabs)
- Output: .agent/artifacts/ui-specs/2026-05-11__tour-list__ui-spec.md
```

**Output mong đợi:** `ui-specs/2026-05-11__tour-list__ui-spec.md` với design token alignment, bảng [REUSE]/[NEW]/[MOD], layer breakdown, UI states per component, placement strategy (shared vs feature-local), build order.

---

### Skill 06 — Data Integration

```text
Kích hoạt 06-data-integration

Context:
- Repo: [d:/DATN/danangtrip-web]
- Feature slug: [tour-list]
- API contract: [.agent/artifacts/api-contracts/2026-05-11__tour-list__api-contract.md]
- UI spec: [.agent/artifacts/ui-specs/2026-05-11__tour-list__ui-spec.md]
- Server prefetch cần không: [Có — initial list cho SEO | Không]
- Queries cần có: [useTourList (client, filter/pagination), useTourDetail (client)]
- Mutations cần có: [NONE | useSubmitBooking]
- Output: [.agent/artifacts/integration/2026-05-11__tour-list__data-integration.md]
```

**Ví dụ thực tế:**
```text
Kích hoạt 06-data-integration

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: tour-list
- API contract: .agent/artifacts/api-contracts/2026-05-11__tour-list__api-contract.md
- UI spec: .agent/artifacts/ui-specs/2026-05-11__tour-list__ui-spec.md
- Server prefetch cần không: Có — prefetch page 1 ở Server Component cho LCP tốt
- Queries cần có: useTourList (client, filter + pagination), useCategoryList (client, lookup)
- Mutations cần có: NONE (trang list chỉ read)
- Output: .agent/artifacts/integration/2026-05-11__tour-list__data-integration.md
```

**Output mong đợi:** `integration/2026-05-11__tour-list__data-integration.md` với server/client ownership per data source, query key hierarchy, HydrationBoundary plan, UI state handling per section (skeleton/empty/error).

---

### Skill 07 — Interactions

```text
Kích hoạt 07-interactions

Context:
- Repo: [d:/DATN/danangtrip-web]
- Feature slug: [tour-list]
- Analysis file: [.agent/artifacts/analysis/2026-05-11__tour-list__screen-analysis.md]
- Data integration: [.agent/artifacts/integration/2026-05-11__tour-list__data-integration.md]
- Actions chính: [search, filter-by-category, filter-by-price, pagination, sort]
- Forms có không: [Có — contact form | Không]
- Destructive actions: [NONE | cancel-booking]
- Output: [.agent/artifacts/interaction-specs/2026-05-11__tour-list__interaction-spec.md]
```

**Ví dụ thực tế:**
```text
Kích hoạt 07-interactions

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: tour-list
- Analysis file: .agent/artifacts/analysis/2026-05-11__tour-list__screen-analysis.md
- Data integration: .agent/artifacts/integration/2026-05-11__tour-list__data-integration.md
- Actions chính: search (debounce + URL sync), filter by category (URL sync), filter by price range, pagination (URL sync), sort by price/rating
- Forms có không: Không (trang list chỉ filter/search)
- Destructive actions: NONE
- Output: .agent/artifacts/interaction-specs/2026-05-11__tour-list__interaction-spec.md
```

**Output mong đợi:** `interaction-specs/2026-05-11__tour-list__interaction-spec.md` với action breakdown, URL-synced state plan, debounce strategy, i18n keys cần thêm vào `vi/en`.

---

### Skill 08 — Auth & Permissions

```text
Kích hoạt 08-auth-permissions

Context:
- Repo: [d:/DATN/danangtrip-web]
- Feature slug: [tour-list]
- Route plan: [.agent/artifacts/routing/2026-05-11__tour-list__route-plan.md]
- Loại feature: [public | authenticated-only | role-based]
- UI nào bị gate: [nút "Đặt tour" chỉ hiện khi đã login | NONE]
- Middleware cần update không: [Có | Không]
- Output: [.agent/artifacts/auth/2026-05-11__tour-list__auth-permissions-review.md]
```

**Ví dụ thực tế:**
```text
Kích hoạt 08-auth-permissions

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: tour-list
- Route plan: .agent/artifacts/routing/2026-05-11__tour-list__route-plan.md
- Loại feature: public (trang list public, nhưng nút "Đặt tour" cần login)
- UI nào bị gate: nút "Đặt tour" — ẩn hoàn toàn khi chưa login, hiện khi đã login
- Middleware cần update không: Không (route /tours là public)
- Output: .agent/artifacts/auth/2026-05-11__tour-list__auth-permissions-review.md
```

**Output mong đợi:** `auth/2026-05-11__tour-list__auth-permissions-review.md` với protected routes (N/A nếu public), guarded UI actions, middleware behavior, redirect flow, risks/assumptions.

---

### Skill 09 — Testing

```text
Kích hoạt 09-testing

Context:
- Repo: [d:/DATN/danangtrip-web]
- Feature slug: [tour-list]
- Dev server URL: [http://localhost:3000/vi/tours | NOT AVAILABLE]
- Code scope: [src/features/tours/, src/services/tour.service.ts, src/app/[locale]/tours/]
- Analysis file: [.agent/artifacts/analysis/2026-05-11__tour-list__screen-analysis.md]
- Interaction spec: [.agent/artifacts/interaction-specs/2026-05-11__tour-list__interaction-spec.md]
- Auth review: [.agent/artifacts/auth/2026-05-11__tour-list__auth-permissions-review.md]
- Output: [.agent/artifacts/test-cases/2026-05-11__tour-list__test-report.md]
```

**Ví dụ thực tế:**
```text
Kích hoạt 09-testing

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: tour-list
- Dev server URL: http://localhost:3000/vi/tours
- Code scope: src/features/tours/, src/services/tour.service.ts, src/app/[locale]/tours/page.tsx
- Analysis file: .agent/artifacts/analysis/2026-05-11__tour-list__screen-analysis.md
- Interaction spec: .agent/artifacts/interaction-specs/2026-05-11__tour-list__interaction-spec.md
- Auth review: .agent/artifacts/auth/2026-05-11__tour-list__auth-permissions-review.md
- Output: .agent/artifacts/test-cases/2026-05-11__tour-list__test-report.md
```

**Output mong đợi:** `test-cases/2026-05-11__tour-list__test-report.md` với 5 phase đầy đủ:
- Phase 1: lint/typecheck/check:routes/build/prepush (PASS/FAIL)
- Phase 2: UI visual — layout responsive, design tokens DESIGN.md, skeleton, empty state
- Phase 3: Functional — search/filter/pagination URL-synced, form submit, locale switch
- Phase 4: Edge cases — boundary values, network errors, SEO metadata check
- Phase 5: Regression — i18n /vi/ ↔ /en/, auth redirect, existing pages
- Verdict: `ready / not ready`

---

### Skill 10 — Optimization & Deploy

```text
Kích hoạt 10-optimization-deploy

Context:
- Repo: [d:/DATN/danangtrip-web]
- Feature slug: [tour-list]
- Test report: [.agent/artifacts/test-cases/2026-05-11__tour-list__test-report.md]
- Test verdict: [READY | READY WITH RISKS | NOT READY]
- Artifacts đã có: [analysis, api-contract, route-plan, ui-spec, data-integration, interaction-spec, auth-review, test-report]
- Branch hiện tại: [main | develop | NONE — chưa tạo nhánh]
- Deploy target: [Cloudflare Workers via OpenNext]
- Output deploy: [.agent/artifacts/deploy/2026-05-11__tour-list__deploy-report.md]
- Output review: [.agent/artifacts/review/2026-05-11__tour-list__review.md]
```

**Ví dụ thực tế:**
```text
Kích hoạt 10-optimization-deploy

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: tour-list
- Test report: .agent/artifacts/test-cases/2026-05-11__tour-list__test-report.md
- Test verdict: READY
- Artifacts đã có: analysis, api-contract, route-plan, ui-spec, data-integration, interaction-spec, auth-review, test-report
- Branch hiện tại: main
- Deploy target: Cloudflare Workers via OpenNext (wrangler.jsonc)
- Output deploy: .agent/artifacts/deploy/2026-05-11__tour-list__deploy-report.md
- Output review: .agent/artifacts/review/2026-05-11__tour-list__review.md
```

**Output mong đợi:**
- `deploy-report.md` — build status, bundle size, Cloudflare notes, smoke test, verdict
- `review.md` — objective, scope, artifact trace, technical decisions, risks
- **Gợi ý tên nhánh**: `feat/tour-list`
- **Gợi ý commit message**: `feat(tours): add tour list page with filter and pagination`
- **Hiển thị lệnh git** và **CHỜ USER xác nhận** trước khi push.

## Những gì mỗi SKILL.md cung cấp

Mỗi SKILL.md trong bộ này có:

- **Overview**: mục tiêu và vai trò trong pipeline
- **Required Input**: file phải đọc trước khi bắt đầu
- **Process**: các bước thực hiện có thứ tự
- **Pattern Chuẩn**: code example thực tế từ repo (không generic)
- **Output Document**: artifact cần tạo và template dùng
- **Strict Rules**: rule không được vi phạm
- **Red Flags**: dấu hiệu đang làm sai — phải dừng và flag
- **Common Rationalizations**: lý do hay dùng để bỏ qua bước — và tại sao sai
- **Verification**: checklist cuối để xác nhận output đủ chất lượng

## Kỳ vọng đầu ra 10/10

Một bộ skill được xem là practical `10/10` cho repo này khi:

- Tất cả skill chỉ tham chiếu file thật
- Mỗi step có artifact rõ ràng
- Tài liệu đủ chi tiết để review mà không phải hỏi lại nhiều
- Không có lỗi encoding/format
- Không giả định Playwright/MSW/workflow nếu repo chưa có
- Code example trong skill bám đúng pattern thật của repo (Zod v4, next-intl v4, TanStack Query v5)
