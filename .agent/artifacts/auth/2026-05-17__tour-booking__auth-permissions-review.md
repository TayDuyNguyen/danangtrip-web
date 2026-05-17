# Auth And Permissions Review: Tour Booking

- **Feature Slug:** `tour-booking`
- **Date:** 2026-05-17
- **Scope:** protected booking route `/tours/{slug}/book`, login redirect flow, gated booking actions
- **Sources Used:**
  - `.agent/artifacts/analysis/2026-05-16__tour-booking__screen-analysis.md`
  - `.agent/artifacts/routing/2026-05-16__tour-booking__route-plan.md`
  - `.agent/artifacts/interaction-specs/2026-05-16__tour-booking__interaction-spec.md`
  - `src/middleware.ts`
  - `src/app/[locale]/(main)/(protected)/layout.tsx`
  - `src/app/[locale]/(main)/(protected)/tours/[slug]/book/page.tsx`
  - `src/app/[locale]/(auth)/login/page.tsx`
  - `src/app/[locale]/(auth)/register/page.tsx`
  - `src/features/auth/components/login-form.tsx`
  - `src/features/auth/hooks/use-auth.ts`
  - `src/store/auth.store.ts`
  - `src/utils/auth.helper.ts`
  - `src/lib/axios.ts`
  - `src/config/routes.ts`
  - `src/features/tour/components/BookingForm.tsx`

## 1. Verdict

- `PASS` Protected booking route now has middleware coverage and protected-layout coverage.
- `PASS` Auth state ownership is consistent: Zustand store is the app-level source of truth, with cookie sync handled through auth helpers.
- `PASS` Booking create/calculate requests rely on the shared axios interceptor for token attach; no duplicate auth header logic was found in the feature service layer.
- `PASS WITH ASSUMPTION` Role model for this feature appears to be authenticated-user only; no admin/staff matrix was found or required by current booking UX.

## 2. Route Protection Review

### Routes Reviewed

- `/tours/[slug]/book`
- `/login`
- `/register`
- repo-wide protected prefixes already present in middleware: `/profile`, `/settings`, `/dashboard`

### Findings

- `PASS` Middleware now treats `/tours/{slug}/book` as a protected route.
  - Evidence: `src/middleware.ts` now marks routes matching `/tours/<slug>/book` as protected.
- `PASS` Client protected layout also redirects unauthenticated users from the `(protected)` route group.
  - Evidence: `src/app/[locale]/(main)/(protected)/layout.tsx` checks `isAuthenticated` and redirects to `/login?callbackUrl=...`.
- `PASS` Auth routes redirect away from `/login` and `/register` when a token is already present.
  - Evidence: `src/middleware.ts`

### Redirect Behavior

- Unauthenticated user visiting `/tours/{slug}/book`
  - Middleware redirect to localized login page with `callbackUrl`
- Authenticated user visiting `/login` or `/register`
  - Middleware redirect to localized home page
- User completes login/register with `callbackUrl`
  - Auth pages now pass the callback through to the form component and return the user to the intended route

## 3. Role Matrix Review

| Action | Guest | Authenticated User | Admin/Staff |
|---|---|---|---|
| View public tour detail | Yes | Yes | Yes |
| Access booking page `/tours/{slug}/book` | No | Yes | Yes |
| Calculate booking price | No | Yes | Yes |
| Create booking | No | Yes | Yes |
| Continue to payment | No | Yes | Yes |

- `[ASSUMPTION]` This feature is user-booking only and does not require role-based differentiation beyond “must be authenticated”.
- No evidence was found that this screen should be restricted to admin/staff roles.

## 4. UI Gating Review

- `PASS` Booking page is gated at route level rather than hidden by CSS.
- `PASS` Booking form uses `useAuthStore()` to prefill user info, not direct cookie access.
  - Evidence: `src/features/tour/components/BookingForm.tsx`
- `PASS` No feature action in the booking flow is gated via `display: none` or similar CSS-only hiding.
- `PASS` Booking submit is effectively hidden from guests because the entire route is protected.

## 5. Auth Flow Integrity Review

### Store / Cookie Sync

- `PASS` Login writes token through `setAccessToken(token)` and updates Zustand store in one flow.
  - Evidence: `src/store/auth.store.ts`
- `PASS` Logout clears both cookies/localStorage and Zustand state.
  - Evidence: `src/store/auth.store.ts`, `src/utils/auth.helper.ts`, `src/features/auth/hooks/use-auth.ts`

### Interceptor / Token Attach

- `PASS` Shared axios interceptor attaches `Authorization` using `getAccessToken()`.
  - Evidence: `src/lib/axios.ts`
- `PASS` Booking feature services do not duplicate token attach logic.
  - Evidence: `src/services/booking.service.ts`, `src/features/tour/hooks/useBookingQueries.ts`

### Expired Token Handling

- `PASS` Shared axios client attempts refresh on eligible `401` responses, then logs out on refresh failure.
  - Evidence: `src/lib/axios.ts`

### Callback / Return URL

- `FAIL` before fix: login/register pages ignored `callbackUrl`, which broke return-to-booking behavior after auth.
- `PASS` after fix: login and register pages now read `callbackUrl` from search params and pass it to their form components.
  - Evidence: `src/app/[locale]/(auth)/login/page.tsx`, `src/app/[locale]/(auth)/register/page.tsx`

## 6. Files Changed During This Review

- `src/middleware.ts`
- `src/app/[locale]/(auth)/login/page.tsx`
- `src/app/[locale]/(auth)/register/page.tsx`

## 7. Risks And Assumptions

- `[ASSUMPTION]` The booking feature is intended for any authenticated user, not a narrower role bucket.
- The protected layout is a client component, so middleware remains important to prevent unauthenticated users from reaching the booking route before client redirect runs.
- No live browser validation was performed in this step; redirect behavior was verified by source inspection and typecheck only.

## 8. Final Review Notes

- The auth model for `tour-booking` is now coherent enough to proceed to `09-testing`.
- The main gap found in this step was real and has been fixed: protected route coverage and callback return flow.
