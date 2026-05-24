# Auth & Permissions Review: Tour theo Danh mục (user-tours-by-category)

- **Date**: 2026-05-24
- **Active Feature**: `user-tours-by-category`

---

## 1. Edge Middleware Audit
We audited `src/middleware.ts` to verify security boundaries for the newly introduced route `/tour-categories/{slug}/tours`:
- **Protected routes registry**: Confirmed that the new route is not matching protected segments (`/profile`, `/settings`, `/dashboard`, etc.) nor booking steps (`/tours/{slug}/book`).
- **Auth redirect bypass**: As expected, requests are successfully processed by `next-intl` localization logic and safely bypassed the login redirect conditions.
- **Public Accessibility**: Users do not need an active JWT token or local cookies to access this category tours screen.

---

## 2. API Endpoint Protection Verification
We audited the API controller and route configurations in `danangtrip-api`:
- **API Group**: The route `GET /v1/tour-categories/{slug}/tours` is declared under the **1. PUBLIC ROUTES** block in `routes/api.php` on line 136.
- **Access protection**: Does not utilize `jwt.auth` middleware, keeping it edge-accessible for all public clients.
- **State Leakage**: The controller logic strictly retrieves active public tours and categorizations without leaking database credentials or user session tokens.
- **Booking Redirection**: When clicking booking CTA actions inside the results cards, the frontend is safely intercepted and sent to the auth page through normal pathways.
