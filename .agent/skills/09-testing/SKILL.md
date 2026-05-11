---
name: 09-testing
description: Execute structured testing phases like a professional QA tester — from static gates to UI visual, functional flows, edge cases, and regression. Use before handoff.
---

# Skill: 09-testing

## Overview

Skill này thực hiện kiểm thử có cấu trúc theo **5 phase** như một tester chuyên nghiệp.

**QUAN TRỌNG — Gate cứng giữa các phase:**

```
Phase 1 PHẢI PASS 100% → mới được chạy Phase 2
Phase 2 không có crash/blank → mới được chạy Phase 3
Phase 3 PHẢI PASS happy path → mới được chạy Phase 4
Phase 4 + Phase 5 → tổng hợp verdict cuối
```

**Nếu Phase 1 có bất kỳ FAIL nào → DỪNG NGAY. Không chạy Phase 2-5. Báo cáo lỗi và yêu cầu fix trước.**

```
Phase 1: Static Gates      → lint / typecheck / check:routes / build  [BLOCKING]
Phase 2: UI Visual         → layout, responsive, design tokens, states [BLOCKING nếu crash]
Phase 3: Functional Flows  → happy path, form, search, filter, pagination [BLOCKING]
Phase 4: Edge Cases        → boundary, network failure, concurrent actions
Phase 5: Regression        → i18n locale switch, auth, existing pages
```

## Required Input

- `persona.md`
- `.agent/rules/PROJECT_RULES.md`
- Analysis / acceptance criteria từ `01-screen-analysis`
- Interaction spec từ `07-interactions`
- Auth review từ `08-auth-permissions` nếu có
- `vitest.config.ts`, `package.json`
- **Dev server URL** — bắt buộc để chạy Phase 2-5

## Dev Server URL

Truyền URL vào khi kích hoạt skill:

```
Dev server URL: http://localhost:3000
Feature URL:    http://localhost:3000/vi/tours
```

Nếu không có URL → Phase 2-5 ghi `NOT RUN` với lý do cụ thể.

---

## GATE LOGIC — Bắt buộc tuân thủ

```
┌─────────────────────────────────────────────────────┐
│  Phase 1: Static Gates                              │
│  lint + typecheck + check:routes + build + prepush  │
└──────────────┬──────────────────────────────────────┘
               │
        Có FAIL nào không?
               │
        YES ───┼──→ DỪNG. Báo lỗi cụ thể.
               │    Yêu cầu fix trước khi tiếp tục.
               │    Verdict: NOT READY — blocked by Phase 1
               │
        NO  ───┼──→ Tiếp tục Phase 2
               │
┌──────────────▼──────────────────────────────────────┐
│  Phase 2: UI Visual                                 │
│  Layout, responsive, design tokens, skeleton, empty │
└──────────────┬──────────────────────────────────────┘
               │
        App có crash / blank screen không?
               │
        YES ───┼──→ DỪNG. Báo lỗi cụ thể.
               │    Verdict: NOT READY — blocked by Phase 2
               │
        NO  ───┼──→ Ghi nhận issues (non-blocking), tiếp tục Phase 3
               │
┌──────────────▼──────────────────────────────────────┐
│  Phase 3: Functional Flows                          │
│  Happy path: search, filter, pagination, form       │
└──────────────┬──────────────────────────────────────┘
               │
        Happy path có FAIL không?
               │
        YES ───┼──→ DỪNG. Báo flow nào fail.
               │    Verdict: NOT READY — blocked by Phase 3
               │
        NO  ───┼──→ Tiếp tục Phase 4 + 5
               │
┌──────────────▼──────────────────────────────────────┐
│  Phase 4: Edge Cases + Phase 5: Regression          │
│  Boundary, network errors, i18n, auth               │
└──────────────┬──────────────────────────────────────┘
               │
        Tổng hợp tất cả issues
               │
        ┌──────▼──────┐
        │   VERDICT   │
        │ ready /     │
        │ not ready / │
        │ ready with  │
        │ risks       │
        └─────────────┘
```

---

## Phase 1 — Static Quality Gates [BLOCKING]

Chạy tuần tự. **Dừng ngay nếu có FAIL — không chạy Phase tiếp theo.**

```bash
npm run lint
npm run typecheck
npm run check:routes
npm run build
npm run prepush:check
```

**Ghi kết quả:**
```
PASS  - lint: 0 errors, 0 warnings
PASS  - typecheck: no errors
PASS  - check:routes: all routes valid
PASS  - build: completed, bundle 245KB gzipped
PASS  - prepush:check: all gates passed
```

**Nếu FAIL:**
```
FAIL  - typecheck: 2 errors tại src/features/tours/TourCard.tsx:23
        → Type 'string | null' is not assignable to type 'string'
        → BLOCKING: không thể tiếp tục Phase 2-5
        → Yêu cầu fix trước khi chạy lại skill 09
```

---

## Phase 2 — UI Visual Testing [BLOCKING nếu crash]

Mở URL feature trong browser. **Nếu app crash hoặc blank screen → dừng ngay.**

### 2.1) Layout & Responsive

| Check | Desktop (1440px) | Tablet (768px) | Mobile (375px) |
|---|---|---|---|
| Layout không bị vỡ | | | |
| Text không bị overflow/truncate sai | | | |
| Image đúng tỷ lệ, không bị stretch | | | |
| Navigation/header đúng | | | |
| Footer đúng | | | |

### 2.2) Design Token Compliance

Đối chiếu với `DESIGN.md`:

- Màu sắc đúng token (`primary: #8B6A55`, `background: #080808`, v.v.)
- Typography đúng font Inter/SFMono, size, weight
- Spacing nhất quán theo scale
- Glass surfaces / gradient border đúng nếu có
- Motion / reveal animation đúng nếu có

### 2.3) Loading States

Reload trang, quan sát:

- Skeleton hiển thị đúng vị trí (không phải spinner toàn trang)
- Skeleton đúng số lượng cards/rows
- Không có layout shift (CLS) khi data load xong

### 2.4) Empty States

Dùng filter không có kết quả:

- Empty state component hiển thị (không phải blank)
- Message rõ ràng, có CTA nếu cần
- Không có lỗi console khi empty

**Blocking issues Phase 2:** App crash, blank screen, console.error khi load.
**Non-blocking issues Phase 2:** Minor visual misalignment — ghi nhận, tiếp tục.

---

## Phase 3 — Functional Flow Testing [BLOCKING]

**Nếu happy path của bất kỳ flow nào FAIL → dừng, báo cáo, yêu cầu fix.**

### 3.1) Search & Filter

```
1. Nhập từ khóa vào search box
✓ Không gửi request ngay — chờ debounce (400ms)
✓ Kết quả cập nhật đúng
✓ URL params cập nhật (?search=...)
2. Xóa từ khóa
✓ Kết quả trở về default
✓ URL params được clear

Filter theo category:
1. Chọn category
✓ URL params cập nhật (?categoryId=...)
2. Refresh trang
✓ Filter vẫn giữ nguyên (URL-synced)
3. Click "Reset filter"
✓ Tất cả filter clear, list về default
```

### 3.2) Pagination

```
1. Chuyển sang trang 2
✓ URL params: ?page=2
✓ Data đúng trang 2
2. Refresh trang
✓ Vẫn ở trang 2
3. Back button
✓ Về trang 1
```

### 3.3) Form Submit (nếu có)

```
Submit form rỗng:
✓ Required fields hiển thị error message
✓ Error message đúng ngôn ngữ hiện tại
✓ Form không submit

Nhập sai format:
✓ Field-level error sau blur
✓ Message cụ thể

Submit hợp lệ:
✓ Loading state trên button
✓ Success feedback (toast hoặc redirect)
✓ Không có console.error
```

### 3.4) Navigation & Links

```
- Click tất cả link trong feature
  ✓ Không có 404
  ✓ Locale prefix đúng (/vi/... hoặc /en/...)
  ✓ Back button hoạt động đúng

- Locale switch (vi ↔ en)
  ✓ URL thay đổi locale prefix
  ✓ Trang hiện tại giữ nguyên (không về home)
```

---

## Phase 4 — Edge Case Testing

### 4.1) Boundary Values

```
- Input có 1 ký tự → fail nếu min > 1
- Input có đúng max length → pass
- Input có max+1 ký tự → fail
- Số âm → fail nếu min = 0
```

### 4.2) Network & Error States

Dùng DevTools → Network → Block request hoặc Throttle:

```
Simulate API timeout / offline:
✓ Loading skeleton không stuck vô hạn
✓ Error state hiển thị
✓ Retry button hoạt động (nếu có)
✓ App không crash

Simulate 500 error:
✓ Toast error hoặc inline error hiển thị
✓ Message không expose raw server error
✓ App không crash
```

### 4.3) Concurrent Actions

```
- Double-click submit button nhanh
  ✓ Chỉ gửi 1 request

- Search trong khi đang load
  ✓ Request cũ bị cancel, dùng request mới nhất
```

### 4.4) SEO & Metadata (Next.js specific)

```
View Page Source (Ctrl+U):
✓ <title> đúng nội dung
✓ <meta name="description"> có nội dung
✓ <meta property="og:title"> có nội dung
✓ Không có duplicate <h1>
```

---

## Phase 5 — Regression Testing

### 5.1) i18n Regression

```
Switch sang tiếng Anh (/en/...):
✓ Tất cả text chuyển sang English
✓ Không có key bị thiếu (không hiển thị dạng "tour.pageTitle")
✓ Validation messages đúng ngôn ngữ
✓ Date/number format đúng locale

Switch lại tiếng Việt (/vi/...):
✓ Tất cả text trở về tiếng Việt
```

### 5.2) Auth Regression

```
Truy cập protected route khi chưa login:
✓ Redirect về /login?redirect=<current-path>
✓ Sau login, redirect về URL ban đầu

Token hết hạn (xóa cookie):
✓ Redirect về login
✓ Không có infinite redirect loop
```

### 5.3) Existing Page Regression

```
- Home page vẫn load đúng
- Các trang cùng module vẫn hoạt động
- Navigation vẫn đúng
- Không có console.error mới ở các trang khác
```

---

## Unit Test Automation

Chạy song song với browser testing:

```bash
npx vitest run
```

### Schema test pattern (Zod v4)

```ts
describe('contactFormSchema', () => {
  it('validates valid input', () => {
    const result = contactFormSchema.safeParse({ name: 'Test', email: 'a@b.com', message: 'Hello world' });
    expect(result.success).toBe(true);
  });
  it('rejects empty name', () => {
    const result = contactFormSchema.safeParse({ name: '', email: 'a@b.com', message: 'Hello' });
    expect(result.success).toBe(false);
  });
});
```

---

## Verdict Logic

```
Phase 1 có FAIL            → NOT READY (blocked by Phase 1)
Phase 2 có crash/blank     → NOT READY (blocked by Phase 2)
Phase 3 có happy path FAIL → NOT READY (blocked by Phase 3)
Phase 4-5 có issues nhỏ   → READY WITH RISKS (liệt kê rõ)
Tất cả pass                → READY
```

**READY WITH RISKS** — dùng khi:
- Phase 4-5 có issues không block core flow
- Phải liệt kê rõ risks và reviewer phải acknowledge trước khi push

---

## Output Document

Tạo file:

- `.agent/artifacts/test-cases/YYYY-MM-DD__<feature-slug>__test-report.md`

Template:

- `template_test_report.md`

### Cấu trúc report

```
1. Summary & Verdict (ready / not ready / ready with risks)
2. Phase 1 — Static Gates [BLOCKING]
3. Phase 2 — UI Visual [BLOCKING nếu crash]
4. Phase 3 — Functional Flows [BLOCKING]
5. Phase 4 — Edge Cases
6. Phase 5 — Regression
7. Unit Test Status
8. Residual Risks
```

---

## Strict Rules

- **Phase 1 FAIL → DỪNG NGAY. Không chạy Phase 2-5.**
- **Phase 2 crash/blank → DỪNG NGAY. Không chạy Phase 3-5.**
- **Phase 3 happy path FAIL → DỪNG NGAY. Không chạy Phase 4-5.**
- Không claim Playwright nếu `playwright.config.ts` chưa tồn tại
- Mọi check phải có status: `PASS` / `FAIL` / `NOT RUN` / `N/A`
- Không ghi "đã test ổn" — phải có evidence cụ thể
- Verdict "READY" chỉ được dùng khi Phase 1-3 đều PASS

## Red Flags

- Phase 2 bị bỏ qua → UI có thể vỡ layout mà không ai biết
- Phase 4 không có network error test → không biết app xử lý lỗi thế nào
- Phase 5 không có i18n locale switch test → language switch có thể broken
- Verdict "READY" khi Phase 3 chưa pass → sai hoàn toàn
- Không có SEO check cho Next.js page → metadata có thể sai

## Verification

- Đối chiếu `checklist.md`
- Report phải cover đủ 5 phase
- Verdict phải có lý do cụ thể
- Nếu dừng sớm vì blocking issue, phải ghi rõ phase nào block và lỗi gì


## Required Input

- `persona.md`
- `.agent/rules/PROJECT_RULES.md`
- Analysis / acceptance criteria từ `01-screen-analysis`
- Interaction spec từ `07-interactions`
- Auth review từ `08-auth-permissions` nếu có
- `vitest.config.ts`, `package.json`
- **Dev server URL** — bắt buộc để chạy Phase 2-5

## Dev Server URL

Truyền URL vào khi kích hoạt skill:

```
Dev server URL: http://localhost:3000
Feature URL:    http://localhost:3000/vi/tours
```

Nếu không có URL → Phase 2-5 ghi `NOT RUN` với lý do cụ thể.

---

## Phase 1 — Static Quality Gates

Chạy tuần tự, dừng ngay nếu có FAIL:

```bash
npm run lint
npm run typecheck
npm run check:routes
npm run build
npm run prepush:check
```

**Ghi kết quả:**
```
PASS  - lint: 0 errors, 0 warnings
PASS  - typecheck: no errors
PASS  - check:routes: all routes valid
PASS  - build: completed, bundle 245KB gzipped
PASS  - prepush:check: all gates passed
```

Nếu FAIL → ghi rõ file lỗi, dòng lỗi, loại lỗi, có block release không.

---

## Phase 2 — UI Visual Testing

Mở URL feature trong browser, kiểm tra từng mục:

### 2.1) Layout & Responsive

| Check | Desktop (1440px) | Tablet (768px) | Mobile (375px) |
|---|---|---|---|
| Layout không bị vỡ | | | |
| Text không bị overflow/truncate sai | | | |
| Image đúng tỷ lệ, không bị stretch | | | |
| Navigation/header đúng | | | |
| Footer đúng | | | |

### 2.2) Design Token Compliance

Đối chiếu với `DESIGN.md`:

- Màu sắc đúng token (`primary: #8B6A55`, `background: #080808`, v.v.)
- Typography đúng font Inter/SFMono, size, weight
- Spacing nhất quán theo scale
- Glass surfaces / gradient border đúng nếu có
- Motion / reveal animation đúng nếu có

### 2.3) Loading States

Reload trang, quan sát:

- Skeleton hiển thị đúng vị trí (không phải spinner toàn trang)
- Skeleton đúng số lượng cards/rows
- Không có layout shift (CLS) khi data load xong
- LCP element load nhanh (hero image, main heading)

### 2.4) Empty States

Dùng filter không có kết quả:

- Empty state component hiển thị (không phải blank)
- Message rõ ràng, có CTA nếu cần
- Không có lỗi console khi empty

---

## Phase 3 — Functional Flow Testing

Test từng flow theo interaction spec từ `07-interactions`.

### 3.1) Search & Filter (nếu có)

```
1. Nhập từ khóa vào search box
2. ✓ Không gửi request ngay — chờ debounce (400ms)
3. ✓ Kết quả cập nhật đúng
4. ✓ URL params cập nhật (?search=...)
5. Xóa từ khóa
6. ✓ Kết quả trở về default
7. ✓ URL params được clear

Filter theo category:
1. Chọn category
2. ✓ URL params cập nhật (?categoryId=...)
3. Refresh trang
4. ✓ Filter vẫn giữ nguyên (URL-synced)
```

### 3.2) Pagination

```
1. Chuyển sang trang 2
2. ✓ URL params: ?page=2
3. ✓ Data đúng trang 2
4. Refresh trang
5. ✓ Vẫn ở trang 2
6. Back button
7. ✓ Về trang 1
```

### 3.3) Form Submit (nếu có)

```
Submit form rỗng:
✓ Required fields hiển thị error message
✓ Error message đúng ngôn ngữ hiện tại
✓ Form không submit

Nhập sai format:
✓ Field-level error sau blur
✓ Message cụ thể

Submit hợp lệ:
✓ Loading state trên button
✓ Success feedback (toast hoặc redirect)
✓ Không có console.error
```

### 3.4) Navigation & Links

```
- Click tất cả link trong feature
  ✓ Không có 404
  ✓ Locale prefix đúng (/vi/... hoặc /en/...)
  ✓ Back button hoạt động đúng

- Locale switch (vi ↔ en)
  ✓ URL thay đổi locale prefix
  ✓ Trang hiện tại giữ nguyên (không về home)
```

---

## Phase 4 — Edge Case Testing

### 4.1) Boundary Values

```
- Input có 1 ký tự → fail nếu min > 1
- Input có đúng max length → pass
- Input có max+1 ký tự → fail
- Số âm → fail nếu min = 0
```

### 4.2) Network & Error States

Dùng DevTools → Network → Block request hoặc Throttle:

```
Simulate API timeout / offline:
✓ Loading skeleton không stuck vô hạn
✓ Error state hiển thị
✓ Retry button hoạt động (nếu có)
✓ App không crash

Simulate 500 error:
✓ Toast error hoặc inline error hiển thị
✓ Message không expose raw server error
✓ App không crash

Simulate 404:
✓ Empty state hoặc redirect đúng
```

### 4.3) Concurrent Actions

```
- Double-click submit button nhanh
  ✓ Chỉ gửi 1 request

- Search trong khi đang load
  ✓ Request cũ bị cancel, dùng request mới nhất
```

### 4.4) SEO & Metadata (Next.js specific)

```
View Page Source (Ctrl+U):
✓ <title> đúng nội dung
✓ <meta name="description"> có nội dung
✓ <meta property="og:title"> có nội dung
✓ Không có duplicate <h1>
✓ Structured data đúng nếu có
```

---

## Phase 5 — Regression Testing

### 5.1) i18n Regression

```
Switch sang tiếng Anh (/en/...):
✓ Tất cả text chuyển sang English
✓ Không có key bị thiếu (không hiển thị dạng "tour.pageTitle")
✓ Validation messages đúng ngôn ngữ
✓ Date/number format đúng locale
✓ URL locale prefix đúng

Switch lại tiếng Việt (/vi/...):
✓ Tất cả text trở về tiếng Việt
✓ Không có flash of wrong language
```

### 5.2) Auth Regression

```
Truy cập protected route khi chưa login:
✓ Redirect về /login?redirect=<current-path>
✓ Sau login, redirect về URL ban đầu

Truy cập public route khi đã login:
✓ Không bị redirect sai

Token hết hạn (xóa cookie):
✓ Redirect về login
✓ Không có infinite redirect loop
```

### 5.3) Existing Page Regression

Kiểm tra các trang liên quan không bị ảnh hưởng:

```
- Home page vẫn load đúng
- Các trang cùng module vẫn hoạt động
- Navigation vẫn đúng
- Không có console.error mới ở các trang khác
```

---

## Unit Test Automation

Chạy song song với browser testing:

```bash
npx vitest run
```

### Schema test pattern (Zod v4)

```ts
describe('contactFormSchema', () => {
  it('validates valid input', () => {
    const result = contactFormSchema.safeParse({ name: 'Test', email: 'a@b.com', message: 'Hello world' });
    expect(result.success).toBe(true);
  });
  it('rejects empty name', () => {
    const result = contactFormSchema.safeParse({ name: '', email: 'a@b.com', message: 'Hello' });
    expect(result.success).toBe(false);
  });
});
```

### Service test pattern

```ts
describe('tourService.getList', () => {
  it('calls correct endpoint with params', async () => {
    const mockGet = vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockResponse });
    await tourService.getList({ page: 1 });
    expect(mockGet).toHaveBeenCalledWith('/api/tours', { params: { page: 1 } });
  });
});
```

---

## Output Document

Tạo file:

- `.agent/artifacts/test-cases/YYYY-MM-DD__<feature-slug>__test-report.md`

Template:

- `template_test_report.md`

### Cấu trúc report

```
1. Summary & Verdict (ready / not ready)
2. Phase 1 — Static Gates
3. Phase 2 — UI Visual
4. Phase 3 — Functional Flows
5. Phase 4 — Edge Cases
6. Phase 5 — Regression
7. Unit Test Status
8. Residual Risks
```

---

## Strict Rules

- Không gọi done nếu Phase 1 chưa pass
- Không bỏ qua Phase 2 nếu có URL — UI visual là phase đầu tiên sau static gates
- Không claim Playwright nếu `playwright.config.ts` chưa tồn tại
- Mọi check phải có status: `PASS` / `FAIL` / `NOT RUN` / `N/A`
- Không ghi "đã test ổn" — phải có evidence cụ thể
- Nếu FAIL: ghi file/dòng lỗi, severity, có block release không
- Nếu NOT RUN: ghi lý do và residual risk

## Red Flags

- Phase 2 bị bỏ qua → UI có thể vỡ layout mà không ai biết
- Phase 4 không có network error test → không biết app xử lý lỗi thế nào
- Phase 5 không có i18n locale switch test → language switch có thể broken
- Report chỉ có Phase 1 → không đủ để bàn giao
- Không có SEO check cho Next.js page → metadata có thể sai

## Verification

- Đối chiếu `checklist.md`
- Report phải cover đủ 5 phase
- Verdict `ready / not ready` phải có lý do cụ thể
- Residual risks phải liệt kê rõ phần nào chưa test và tại sao
