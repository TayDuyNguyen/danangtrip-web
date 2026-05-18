# Authentication And Permissions Review: Chọn lịch khởi hành

## 1. Feature Summary
- Feature slug: `tour-departure-select`
- Date: `2026-05-18`
- Primary route: `/tours/[slug]/departures`
- Sources used:
  - `.agent/artifacts/routing/2026-05-18__tour-departure-select__route-plan.md`
  - `.agent/artifacts/analysis/2026-05-18__tour-departure-select__screen-analysis.md`
  - `src/app/[locale]/(main)/(public)/tours/[slug]/departures/page.tsx`
  - `src/app/[locale]/(main)/(protected)/tours/[slug]/book/page.tsx`
  - `src/middleware.ts`
  - `src/store/auth.store.ts`

## 2. Route Access Review

| Route | Access level | Expected behavior |
| --- | --- | --- |
| `/[locale]/tours/[slug]/departures` | Public | Guest users may browse schedules and configure passenger quantities |
| `/[locale]/tours/[slug]/book` | Protected by existing booking flow rules | User may be redirected to login if booking page remains authenticated-only |

- The departure-selection step should not add new auth barriers unless repo reality changes.
- This route exists to improve the funnel before checkout, so blocking it behind login would conflict with the selected product direction.

## 3. UI Gating Rules

| Element / action | Gate | Behavior |
| --- | --- | --- |
| Schedule list and quantity selectors | Public | Always visible when route data loads successfully |
| Continue CTA | Functional gate, not auth gate | Enabled only when schedule and quantity rules are satisfied |
| Booking handoff | Downstream auth may apply | Client may navigate to booking route; middleware decides whether login is required |

- No admin-only or role-based branches are expected on this screen.
- No destructive actions are exposed on this screen.

## 4. Middleware And Redirect Considerations
- The current middleware already protects booking-related routes in the protected flow.
- If a guest user continues from the departure screen to a protected booking route, the expected behavior is:
  - middleware redirects to login
  - callback URL preserves the intended booking route when supported by the existing auth flow
- This means the departure screen itself should remain shareable and indexable as a public route, while checkout identity enforcement happens later.

## 5. Data-Safety Notes
- The screen intentionally avoids relying on authenticated-only pricing APIs for its main interactive summary.
- Temporary summary values are computed client-side from already visible schedule or tour data, which is acceptable for a public pre-booking step.
- Any final price commitment still happens downstream in the authenticated booking flow or server-side booking validation.

## 6. Risks And Assumptions
- [ASSUMPTION] `/tours/[slug]/book` remains the first route that truly requires authentication in this flow.
- [ASSUMPTION] Callback forwarding after login is already handled by the current auth implementation used in booking.
- If backend later changes `POST /bookings/calculate` to support guests safely, this review can stay unchanged because auth scope would only become less restrictive for the departure step.
