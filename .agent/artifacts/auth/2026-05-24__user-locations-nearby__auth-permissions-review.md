# Auth & Permissions Report: user-locations-nearby

> Feature slug: `user-locations-nearby`
> Date: 2026-05-24
> Scope: `Route access control, Auth integrations, & Guest Leakage Audits`

---

## 1) Route Access Strategy

The new dynamic path `/nearby` is registered as a fully public route.

### `src/config/routes.ts`
- Added `NEARBY: "/nearby"` inside `PUBLIC_ROUTES`.
- Verified that `isPublicRoute("/nearby")` evaluates to `true`, bypassing authentication redirect triggers inside Edge middleware.

### `src/middleware.ts`
- Verified that the Edge boundary does not redirect guest visitors to `/login` when fetching `/nearby`, allowing universal public search discovery.

---

## 2) Guest-Leakage Safeguard Audit

We conducted a thorough code audit to ensure guest users cannot accidentally trigger authenticated-only endpoints, preventing terminal console or API contract failures:

### A) Geolocation Data Loading
- **Endpoint**: `GET /locations/nearby`
- **Audit**: Publicly accessible on Laravel backend (`LocationController@nearby`). Does not require Bearer token authorization headers. Guest visitors can search freely.

### B) Category Pills Loading
- **Endpoint**: `GET /categories`
- **Audit**: Publicly accessible on Laravel backend (`CategoryController@index`). Guest visitors can search freely.

### C) Favorites Integration Safeguard
- **Endpoint**: `POST /user/favorites` & `DELETE /user/favorites` & `GET /user/favorites/check`
- **Audit**: Authenticated-only. Inside [LocationCardCompact.tsx](file:///d:/DATN/danangtrip-web/src/features/locations/nearby/components/LocationCardCompact.tsx), we implement strict safeguards:
  - If a user is not authenticated (`isAuthenticated === false`), checking favorite status is skipped completely.
  - Clicking the heart icon triggers a warning toast informing guests to sign in first, rather than executing HTTP requests.
  - Saves are only triggered for verified logged-in users.

---

## 3) User Actions Matrix

| Feature Action | Guests (Unauthenticated) | Users (Authenticated) | Implementation Safeguard |
|----------------|--------------------------|-----------------------|-------------------------|
| Browse nearby places | ✅ Allowed | ✅ Allowed | Fully public client coordinate query. |
| Scan GPS radius | ✅ Allowed | ✅ Allowed | Geolocation API trigger. |
| Category filtration | ✅ Allowed | ✅ Allowed | Client-side memory search filters. |
| View on Map | ✅ Allowed | ✅ Allowed | Full coordinate plotting. |
| Save Location | ✗ Blocked | ✅ Allowed | Triggers warning Toast prompt for guests. |
