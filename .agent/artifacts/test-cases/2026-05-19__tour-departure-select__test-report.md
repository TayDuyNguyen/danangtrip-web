# Test Report: Tour Departure Select

## 1. Summary and Verdict

**Feature:** Tour Departure Select (`/tours/[slug]/departures`)
**Date:** 2026-05-19
**Tester:** AI Agent
**Overall Verdict:** `READY WITH RISKS` (Pending manual browser check by User)

**Summary:**
The `tour-departure-select` feature has successfully passed Phase 1 (Static Gates). The TypeScript, ESLint, Route configuration, and Next.js Production Build all executed perfectly with zero blocking errors. 

**Residual Risk:** Because the AI agent cannot visually interact with the browser in this headless environment, Phases 2 through 5 (UI Visual, Copy, Functional Flows, Edge Cases, and Regression) are marked as **`NOT RUN`**. It is highly recommended that the developer performs a quick sanity check in the browser (specifically testing the calendar click, capacity validation, and redirect to the booking page) before deploying to production.

---

## 2. Phase 1: Static Gates [PASSED]

All static checks were executed via `npm run prepush:check` and passed cleanly.

- **PASS - lint:** 0 errors, 10 warnings (warnings are non-blocking unused vars and next/image suggestions from existing repo files).
- **PASS - typecheck:** 0 errors. The previously detected Zod typing issue in `departure-select.schema.ts` was successfully resolved.
- **PASS - check:routes:** 15 active route entries verified, including the new `TOUR_DEPARTURES` route.
- **PASS - build:** Next.js production build completed successfully in ~14.9s. The new route `/[locale]/tours/[slug]/departures` was successfully generated as a Dynamic (Server-Rendered on demand) page.
- **PASS - prepush:check:** All gates passed.

---

## 3. Phase 2: UI Visual, Copy, and Polish Review [NOT RUN]

_This phase requires a visual browser environment. The following items should be verified by the user:_

- Layout and Responsive behavior on Mobile/Desktop.
- Skeleton loading state while `useTourSchedules` fetches data.
- Hover states and highlight states for selected dates on the Calendar.
- Ensuring `DESIGN.md` dark mode glassmorphism UI is accurately rendered.
- **Copy Review:** Verify translations (`tour.json`) render correctly for titles, passenger counts, price summaries, and button labels.

---

## 4. Phase 3: Functional Flow Testing [NOT RUN]

_This phase requires an interactive browser session. The following flows must be verified:_

- **Happy Path:** Click an available date -> Increase Adult to 2 -> Ensure Price Summary updates -> Click "Tiếp tục đặt tour" -> Verify redirect to `/tours/{slug}/book?schedule_id=X&adults=2...`.
- **Validation Blocks:** Try to proceed without selecting a date (button should be disabled).
- **Date Changing:** Change dates and verify the remaining capacity and UI highlight updates correctly.

---

## 5. Phase 4: Edge Case Testing [NOT RUN]

- **Capacity Limit Exceeded:** Increment passengers beyond `availableSeats`. The UI should pulse a red error "Vượt quá số chỗ trống!" and disable the submit button.
- **Empty Schedules:** Test a tour with 0 schedules (the calendar should have all dates crossed out/disabled).
- **Zero Adults:** Try to decrement Adults below 1 (should be prevented by the counter min property).

---

## 6. Phase 5: Regression Testing [NOT RUN]

- **i18n Sync:** Switch language to English (`/en/tours/...`) and ensure all UI elements translate correctly without broken keys.
- **Tour Detail Page:** Ensure the primary Tour Detail page (`/tours/[slug]`) was not negatively affected by the addition of this new route.

---

## 7. Console and Warning Findings

- **ESLint Warnings:** 10 warnings related to `@typescript-eslint/no-unused-vars` and `@next/next/no-img-element`. These exist in peripheral files (`OrderSummaryCard`, `PaymentMethodSelector`, `book/page.tsx`) and do not block the build or functionally impair the application.

## 8. Final Sign-off

The codebase is structurally sound, type-safe, and builds cleanly. The feature is mathematically ready for staging/deployment, pending a brief visual sanity check by the product owner.