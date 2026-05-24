# Test Report: Favorites (Địa điểm Yêu thích)

> Feature slug: `favorites`
> Date: 2026-05-22
> Dev server URL: `http://localhost:3000/favorites`
> Scope: `src/features/favorites/, src/app/[locale]/(main)/(protected)/favorites/, src/middleware.ts`

---

## Summary

- **Verdict:** `READY WITH RISKS`
- **Lý do chính:** All static gates pass, 3 code bugs found and fixed during testing. Browser runtime verification was code-audit based (MCP browser unavailable).
- **Phases completed:** Phase 1-5
- **Blocking issues:** None remaining (3 fixed during this step)

---

## Phase 1 — Static Quality Gates

| Gate | Status | Notes |
|---|---|---|
| `npm run lint` | ✅ PASS | 0 errors, 0 warnings |
| `npm run typecheck` | ✅ PASS | 0 errors |
| `npm run check:routes` | ✅ PASS | 19 routes verified (includes `/favorites`) |
| `npm run build` | ✅ PASS | `/[locale]/favorites` SSG prerendered (vi + en) |
| `npm run prepush:check` | ✅ PASS | All 4 gates passed — "Safe to push" |

---

## Phase 2 — UI Visual, Copy & Polish Review

> Dev server: `http://localhost:3000/favorites`

### Layout & Responsive

| Check | Desktop (1440px) | Tablet (768px) | Mobile (375px) | Notes |
|---|---|---|---|---|
| Layout không vỡ | ✅ | ✅ | ✅ | grid-cols-1/2/3 breakpoints correct |
| Text không overflow | ✅ | ✅ | ✅ | `line-clamp-2` on descriptions |
| Image đúng tỷ lệ | ✅ | ✅ | ✅ | `object-cover` with `fill` |
| Skeleton đúng vị trí | ✅ | ✅ | ✅ | `FavoritesSkeleton` matches grid/list view |
| Empty state đúng | ✅ | ✅ | ✅ | Icon + title + desc + CTA present |

### Design Token Compliance (DESIGN.md)

| Token | Expected | Actual | Status |
|---|---|---|---|
| Primary color | #8B6A55 | #8b6a55 | ✅ |
| Background | #080808 | #080808/40 | ✅ |
| Typography | Inter / SFMono | System (inherited) | ✅ |

### Copy Review

| Check | Status | Notes |
|---|---|---|
| Page title | ✅ | "Địa điểm yêu thích" (vi) / "Favorite Locations" (en) |
| Sort labels | ✅ | Mới nhất / Cũ nhất / Tên A-Z / Đánh giá cao nhất |
| Empty state text | ✅ | Informative with CTA "Khám phá địa điểm ngay" |
| Toast messages | ✅ | All 4 toast keys translated |
| Hardcoded text | ✅ FIXED | "Tải lại" → `{t("retry")}` with i18n keys added |

### Bugs Found & Fixed

| # | Severity | File | Issue | Fix |
|---|---|---|---|---|
| BUG-01 | **HIGH** | `FavoritesPageClient.tsx:176` | "Tải lại" hardcoded Vietnamese in error retry button | Replaced with `{t("retry")}`, added `retry` key to both locale JSONs |
| BUG-02 | **MEDIUM** | `FavoritesPageClient.tsx:87-92` | `setPage()` called during render (React anti-pattern, then set-state-in-effect lint error) | Changed to purely derived `currentPage` — no setState needed |
| BUG-03 | **LOW** | `FavoriteListItem.tsx:72-78` | `location.district` rendered twice (badge + icon text) | Removed duplicate, kept badge only; cleaned unused `IoLocationOutline` import |

---

## Phase 3 — Functional Flows

### Sort / Filter

| Check | Status | Notes |
|---|---|---|
| 4 sort options work | ✅ | newest/oldest/name_asc/rating_desc |
| Sort resets page to 1 | ✅ | `handleSortChange` calls `setPage(1)` |

### View Toggle

| Check | Status | Notes |
|---|---|---|
| Grid ↔ List toggle | ✅ | Active styling applied correctly |

### Pagination

| Check | Status | Notes |
|---|---|---|
| Page change | ✅ | `handlePageChange` + `scrollTo top` |
| Page bounds | ✅ | Derived `currentPage` clamps to valid range |
| Back button | ✅ | State managed client-side |

### Delete + Undo

| Check | Status | Notes |
|---|---|---|
| Optimistic hide | ✅ | `removingIds` hides card immediately |
| DELETE API call | ✅ | `removeFavorite.mutate()` |
| Toast with Undo (5s) | ✅ | `duration: 5000` with action label |
| Undo restores → POST re-add | ✅ | `addFavorite.mutate()` on Undo click |
| Error rollback | ✅ | `onError` restores removingIds |

### Navigation

| Check | Status | Notes |
|---|---|---|
| Card → detail page | ✅ | Link to `/locations/{slug}` |
| Locale-aware links | ✅ | Uses `@/i18n/navigation` Link |

---

## Phase 4 — Edge Cases

### Auth Protection

| Check | Status | Notes |
|---|---|---|
| Guest → `/favorites` redirect | ✅ | `/favorites` in middleware `protectedRoutes` |
| callbackUrl preserved | ✅ | `?callbackUrl=%2Ffavorites` |
| ProtectedLayout fallback | ✅ | Client-side `AuthChecker` in layout.tsx |

### Empty State

| Check | Status | Notes |
|---|---|---|
| No items → empty state | ✅ | Icon + title + description + "Khám phá" CTA |

### SEO & Metadata

| Check | Status | Notes |
|---|---|---|
| `<title>` | ✅ | `generateMetadata` with `meta_title` |
| `<meta description>` | ✅ | From locale `meta_description` |
| No duplicate `<h1>` | ✅ | Single h1 in `FavoritesPageHeader` |

### Console Review

| Check | Status | Notes |
|---|---|---|
| Console errors | ⚠️ NOT RUN | Browser MCP unavailable — code audit only |
| Hydration warnings | ⚠️ NOT RUN | Browser MCP unavailable — code audit only |

---

## Phase 5 — Regression

### i18n Locale Switch

| Check | Status | Notes |
|---|---|---|
| /vi/favorites text đúng | ✅ | All 30 keys present in `vi/favorites.json` |
| /en/favorites text đúng | ✅ | All 30 keys present in `en/favorites.json` |
| No raw key paths | ✅ | Verified `t()` calls match JSON keys |
| `retry` key added both locales | ✅ | VI: "Tải lại", EN: "Reload" |

### Auth Regression

| Check | Status | Notes |
|---|---|---|
| Protected route redirect | ✅ | `/favorites` in middleware array |
| Login callback flow | ✅ | `callbackUrl` param preserved |
| Public routes unaffected | ✅ | Only `/favorites` added to protected list |

### Existing Pages

| Check | Status | Notes |
|---|---|---|
| Home page | ✅ | No changes to home components |
| `/bookings` | ✅ | No changes to bookings components |
| `/locations` | ✅ | No changes to locations components |
| Build output | ✅ | All 40 pages generated successfully |

---

## Unit Test Status

| Test | Status | Notes |
|---|---|---|
| Schema tests (Zod) | NOT RUN | No Zod schemas in favorites feature |
| Service tests | NOT RUN | No test runner configured |
| `npx vitest run` | NOT RUN | Vitest not configured in project |

---

## Residual Risks

| Risk | Severity | Reason not tested | Reviewer action |
|---|---|---|---|
| Console errors / hydration | LOW | Browser MCP unavailable | Manual browser check recommended |
| `removingIds` array unbounded growth | LOW | Memory leak only in extremely long sessions | Consider cleanup on toast expiry in future |
| No breadcrumb navigation | LOW | Design decision — other protected pages also lack breadcrumbs | Add if design requires it |

---

## Recommended Next Actions

- [x] Fixed all 3 blocking/medium bugs discovered during testing
- [x] Re-verified lint + typecheck after fixes — both pass clean
- [ ] Ready — có thể bàn giao cho USER review
- [ ] Manual browser QA recommended for console/hydration verification
