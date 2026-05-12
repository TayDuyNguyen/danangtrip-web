# Test Report: <Feature Name>

> Feature slug: `<feature-slug>`
> Date: YYYY-MM-DD
> Dev server URL: `<http://localhost:3000/vi/tours | NOT AVAILABLE>`
> Scope: `<src/features/tours/, src/app/[locale]/tours/, ...>`

---

## Summary

- **Verdict:** `Ready / Not Ready`
- **Lý do chính:**
- **Phases completed:** Phase 1 / Phase 1-2 / Phase 1-3 / Phase 1-4 / Phase 1-5
- **Blocking issues:**

---

## Phase 1 — Static Quality Gates

| Gate | Status | Notes |
|---|---|---|
| `npm run lint` | | |
| `npm run typecheck` | | |
| `npm run check:routes` | | |
| `npm run build` | | |
| `npm run prepush:check` | | |

---

## Phase 2 — UI Visual

> Dev server: `<URL>`

### Layout & Responsive

| Check | Desktop (1440px) | Tablet (768px) | Mobile (375px) | Notes |
|---|---|---|---|---|
| Layout không vỡ | | | | |
| Text không overflow | | | | |
| Image đúng tỷ lệ | | | | |
| Skeleton đúng vị trí | | | | |
| Empty state đúng | | | | |

### Design Token Compliance (DESIGN.md)

| Token | Expected | Actual | Status |
|---|---|---|---|
| Primary color | #8B6A55 | | |
| Background | #080808 | | |
| Typography | Inter / SFMono | | |

### Console & Performance

| Check | Status | Notes |
|---|---|---|
| Không có `console.error` khi load | | |
| Không có network request fail | | |
| Không có layout shift (CLS) | | |

---

## Phase 3 — Functional Flows

### Search / Filter

| Check | Status | Notes |
|---|---|---|
| Search debounce đúng (400ms) | | |
| URL params cập nhật khi search | | |
| Filter URL-synced | | |
| Refresh giữ nguyên filter | | |
| Reset filter hoạt động | | |

### Pagination

| Check | Status | Notes |
|---|---|---|
| Chuyển trang đúng | | |
| URL params cập nhật | | |
| Refresh giữ nguyên trang | | |
| Back button về trang trước | | |

### Form Submit (nếu có)

| Check | Status | Notes |
|---|---|---|
| Required fields hiển thị error | | |
| Format sai hiển thị error | | |
| Submit loading state | | |
| Success feedback | | |

### Navigation & Links

| Check | Status | Notes |
|---|---|---|
| Không có 404 | | |
| Locale prefix đúng (/vi/ hoặc /en/) | | |
| Locale switch giữ nguyên trang | | |

---

## Phase 4 — Edge Cases

### Boundary Values

| Case | Expected | Status | Notes |
|---|---|---|---|
| Input rỗng | Validation fail | | |
| Input max length | Pass | | |
| Input max+1 length | Fail | | |

### Network & Error States

| Case | Expected | Status | Notes |
|---|---|---|---|
| API timeout / offline | Error state, không crash | | |
| 500 error | Error feedback, không expose raw | | |
| Double-click submit | Chỉ 1 request | | |

### SEO & Metadata

| Check | Status | Notes |
|---|---|---|
| `<title>` có nội dung đúng | | |
| `<meta description>` có nội dung | | |
| `<og:title>` có nội dung | | |
| Không có duplicate `<h1>` | | |

---

## Phase 5 — Regression

### i18n Locale Switch

| Check | Status | Notes |
|---|---|---|
| Switch /vi/ → /en/: text đổi đúng | | |
| Switch /en/: không có key thiếu | | |
| Switch lại /vi/: text đúng | | |
| Validation messages đúng ngôn ngữ | | |
| URL locale prefix đúng | | |

### Auth

| Check | Status | Notes |
|---|---|---|
| Protected route khi chưa login → redirect | | |
| Sau login → redirect về URL ban đầu | | |
| Public route không bị redirect sai | | |

### Existing Pages

| Check | Status | Notes |
|---|---|---|
| Home page vẫn load đúng | | |
| Các trang cùng module vẫn hoạt động | | |
| Không có console.error mới | | |

---

## Unit Test Status

| Test | Status | Notes |
|---|---|---|
| Schema tests (Zod) | PASS / FAIL / NOT RUN | |
| Service tests | PASS / FAIL / NOT RUN | |
| `npx vitest run` | PASS / FAIL / NOT RUN | |

---

## Residual Risks

| Risk | Severity | Reason not tested | Reviewer action |
|---|---|---|---|
| | | | |

---

## Recommended Next Actions

- [ ] Ready — có thể bàn giao cho USER review
- [ ] Cần fix blocking issues trước khi bàn giao
- [ ] Cần chạy lại Phase ___ sau khi fix
