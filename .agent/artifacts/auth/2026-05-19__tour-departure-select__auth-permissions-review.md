# Auth & Permissions Review: Tour Departure Select

## 1) Route Protection Review

- **Target Route:** `/tours/{slug}/departures`
- **Protection Required:** None. This screen is public.
- **Middleware Check:** 
  - `src/middleware.ts` currently protects `/profile`, `/settings`, `/dashboard`, `/payment`, and `/tours/[slug]/book`.
  - The regex `/^\/tours\/[^/]+\/book\/?$/` matches the checkout/booking step, but does **not** match `/tours/[slug]/departures`.
  - This is correct. The departure selection step is open to all users (public) to maximize funnel entry. Users will only be challenged for authentication when they click "Tiếp tục" and hit the `/book` route.
- **Redirect Behavior:** 
  - If a public user selects a date and clicks "Tiếp tục", they navigate to `/tours/{slug}/book?schedule_id=...`.
  - The middleware will catch this, redirect to `/login?callbackUrl=/tours/{slug}/book?schedule_id=...`.
  - Upon successful login, the user is redirected back to the `/book` page with their selections intact.

## 2) Role Matrix Review

- **Public (Unauthenticated):** Can view schedules, adjust passengers, see local price calculations, and click "Continue".
- **User (Authenticated):** Can do the same, plus proceed directly to the `/book` page without interception.
- **Admin/Staff:** Same as User.

## 3) UI Gating Review

- **Hidden/Disabled Elements:** 
  - There are no role-based or auth-based UI hidden elements on this page.
  - The "Tiếp tục" button is disabled based on *validation state* (e.g., no date selected, capacity exceeded), not *authentication state*.
- **Rationale:** We want to encourage users to explore pricing and dates before forcing a sign-up wall.

## 4) Auth Flow Integrity Review

- **Cookie/Store Sync:** Not directly applicable to the rendering of this page, as it fetches public endpoints (`GET /tours/{id}/schedules`).
- **Interceptor Attach:** By bypassing the `POST /bookings/calculate` endpoint and calculating prices locally on this screen, we completely avoid the risk of throwing a `401 Unauthorized` error for public users exploring dates. The Axios interceptor remains untouched and correctly handles 401s on protected endpoints elsewhere.
- **Token Loop Risk:** None. The redirect flows naturally forward to the login challenge and back to the booking target.

## 5) Verification

- `src/middleware.ts` was reviewed and correctly excludes `/departures` while protecting `/book`.
- `src/config/routes.ts` already lists `TOUR_DEPARTURES` under `PUBLIC_ROUTES`.
- The UX gracefully handles anonymous users up to the point of hard commitment (booking).

**Status:** PASS. No code changes required in middleware or auth stores for this feature.