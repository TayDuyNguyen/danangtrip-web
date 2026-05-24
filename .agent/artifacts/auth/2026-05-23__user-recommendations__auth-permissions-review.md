# Auth & Permissions Review Report - user-recommendations

- **Date:** 2026-05-23
- **Feature Slug:** `user-recommendations`
- **Protected Path:** `/recommendations` (locale-aware via Edge middleware)

---

## 1. Edge Middleware Access Control

As mapped in the route plan, guest access must be actively intercepted at the network edge before hitting any Page controllers:

- **Middleware Registry (`src/middleware.ts`):**
  - Path added: `"/recommendations"` successfully included in the `protectedRoutes` array.
  - **Interception logic:** If no `token` cookie is present, redirects guest to `/login` or `/en/login` depending on context.
  - **Redirect target:** Triggers path prefixes matching the requested locale:
    - Vietnamese: `/login?callbackUrl=%2Frecommendations`
    - English: `/en/login?callbackUrl=%2Fen%2Frecommendations`
  - **Verified Behavior:** Seamless return callback URL is appended, enabling users to land back on recommendations after successful login.

---

## 2. API Authorization & Headers

Once authenticated, requests leverage the standard cookie-based JWT strategy:

- **Axios Interceptor (`src/lib/axios.ts`):**
  - Automatically fetches the active access token and appends the standard header: `Authorization: Bearer <token>`.
  - Attaches the selected locale code (`Accept-Language: vi|en`) matching UI paths, guaranteeing localized database error messages on backend.
- **Service Security:** Direct access to `/api/v1/recommendations` is wrapped in Laravel's standard `jwt.auth` routing middleware, preventing data leaks or anonymous scraping.

---

## 3. Session Expiration & Refresh Boundary

- **Refresh token flow:** If a request receives an authenticated expire response (`401 Unauthorized`), the interceptor pauses outgoing requests, hits `/auth/refresh` to refresh the session cookie, and retries the original request with the fresh token seamlessly.
- **Clean Logout:** If the refresh token has expired or is invalid, the interceptor clears client storage, invokes `authStore.logout()`, and redirects the browser back to `/login` immediately.
