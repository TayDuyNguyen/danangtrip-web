# Auth & Permissions Review: user-profile

> Feature slug: `web_route_api_next_screen_review`
> Date: 2026-05-27
> Target screen: **user-profile**

---

## 1) Auth Protection Verification

We reviewed the auth state checks, route configuration, and redirect workflows:

- **Route Location:** `/profile` is stored inside the dynamic router group `(protected)` at `src/app/[locale]/(main)/(protected)/profile/`.
- **Inherited Boundary Guard:** The parent `layout.tsx` of the `(protected)` group runs the `AuthChecker` component.
  - Checks if user status `isAuthenticated` is true, or if `getAccessToken()` fetches a valid JWT token.
  - If unauthenticated, extracts `pathname` and `searchParams` to construct the `callbackUrl`.
  - Redirects via `router.push('/login?callbackUrl=...')` so that the user is immediately returned to `/profile` upon signing in.
- **API Boundary Guard:** Endpoints `GET /user/profile`, `PUT /user/profile`, and `POST /user/profile/avatar` in Laravel api routes list are enclosed inside the `jwt.auth` middleware group. They will refuse any requests lacking a valid JWT token.
- **Cross-user Access Prevention:** Users are restricted to editing only their own profiles because the backend retrieves the user ID directly from the authenticated request instance `$request->user()->id`, rather than accepting a user ID path parameter.
