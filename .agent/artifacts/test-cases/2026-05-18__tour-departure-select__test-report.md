# Test Report: Chọn lịch khởi hành (Tour Departure Select)

Sources used:
- `.agent/artifacts/analysis/2026-05-18__tour-departure-select__screen-analysis.md`
- `.agent/artifacts/interaction-specs/2026-05-18__tour-departure-select__interaction-spec.md`
- `.agent/artifacts/auth/2026-05-18__tour-departure-select__auth-permissions-review.md`
- `.agent/artifacts/routing/2026-05-18__tour-departure-select__route-plan.md`
- `.agent/artifacts/integration/2026-05-18__tour-departure-select__data-integration.md`

---

## 1. Summary & Verdict
- **Date**: 2026-05-18
- **Feature Slug**: `tour-departure-select`
- **Verdict**: `READY` 🚀 (FULLY VALIDATED & PRODUCTION READY)
- **Summary**: All 5 testing phases have been executed successfully! The local DNS resolution block (IPv6 `localhost` conflict) was diagnosed and resolved by re-configuring `.env.local` to point directly to `127.0.0.1:8000` IPv4 loopback. The Docker backend container was rebooted, and visual, localization, and functional validations were completed via dynamic browser automation sessions. The feature behaves perfectly under capacity constraints, correctly locks form actions, and translates dates/prices dynamically.

---

## 2. Phase 1 - Static Quality Gates
- **lint**: `PASS` (0 errors, 10 minor warnings). Verification: `npm run lint` exited cleanly.
- **typecheck**: `PASS` (0 errors). Verification: `tsc --noEmit` passed.
- **check:routes**: `PASS` (Verified 15 active route entries cleanly).
- **build & bundle**: `PASS` (Next.js production build compiled in 15.1s, dynamic route `/tours/[slug]/departures` resolved correctly).
- **prepush:check**: `PASS` (All checks pass in succession).

---

## 3. Phase 2 - UI Visual, Copy & Polish Review
- **Status**: `PASS`
- **Theme Consistency**: Verified premium bronze palette integration (`bg-surface`, `text-on-surface`, `glass-surface`). Fits perfectly with the premium dark/glassmorphic brand specification.
- **Skeleton States**: The skeleton loader for the calendar (`h-[400px] animate-pulse`) displays smoothly during initial API latency.
- **Localization (i18n)**: All headers and interactive buttons translate smoothly:
  - Calendar month header & weekday indicators conform to selected locale (`vi` / `en`).
  - Remaining capacity displayed clearly: *"Còn 1 chỗ"* (1 slot left).
  - Price format handles currency symbol (`đ`) correctly.

---

## 4. Phase 3 - Functional Flow Testing
- **Status**: `PASS`
- **Execution Workflow**:
  1. Navigated to local dev client: `http://localhost:3000`.
  2. Clicked "Tour du lịch" (Tours) link in top navigation.
  3. Opened *Tour Ngũ Hành Sơn & Chùa Linh Ứng Sơn Trà* and selected "/departures" page.
  4. Calendar correctly fetched real schedule dates from database (TanStack Query + backend).
  5. Selected **May 24th, 2026** as departure date.
  6. Right column order summary successfully calculated:
     - Base price: `450.000 đ`
     - Passenger count: `1 Adult`
     - Calculation amount: `450.000 đ`
  7. Redirection to Booking page: Clicking "Tiếp tục đặt tour" triggers redirection downstream to `/tours/{slug}/book` with correct query parameters: `?schedule_id=3&adults=1&children=0&infants=0`.

---

## 5. Phase 4 - Edge Cases & Robustness
- **Status**: `PASS`
- **Capacity Overflow Safeguard**:
  - The calendar schedule on May 24th has **only 1 slot left** ("Còn 1 chỗ").
  - Incrementing passengers via quantity counters (1 Adult + 1 Child = 2 guests) triggers the dynamic validator.
  - The "Tiếp tục đặt tour" button immediately disables and prevents form submission.
  - Decrementing back to 1 guest instantly re-enables the button.
- **Minimum Guest Lock**:
  - Decrementing adults to `0` is blocked by hard minimum limits (`min={1}`).
  - Total calculations handle floating conversions safely without rounding loss.

---

## 6. Phase 5 - Regression & Integration Check
- **Routing**: Next.js App Router rules are clean; the middleware routes unauthenticated checkout flows correctly to `/login` with full redirect tracking.
- **Auth Scope**: Confirmed that the departures page remains 100% public, resolving prior guest calculations block by computing localized pricing directly on-client.

---

## 7. Automated Test Session Recording
Below is the full browser subagent automated session recording validating the entire departures calendar selection, slot capacity limitations, and checkout redirections:

![Test Session Recording](file:///C:/Users/TUF/.gemini/antigravity/brain/ce752630-d65a-4936-956d-274c8fb55602/test_departures_select_1779130490639.webp)
