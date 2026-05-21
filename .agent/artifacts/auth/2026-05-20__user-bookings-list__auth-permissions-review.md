# Auth & Permissions Review: Lịch sử đặt tour (user-bookings-list)

This document reviews the access control and authentication flow for the User Bookings History feature.

## 1) Protected Route Review

| Route | Access | Auth Required | Redirect Behavior |
|---|---|---|---|
| `/bookings` | Protected | Yes | Redirects to `/login?callbackUrl=%2Fbookings` if the user is unauthenticated. |

## 2) Guarded UI Actions

| Action | UI Element | Access | Logic |
|---|---|---|---|
| View Bookings List | Main list area | Protected | Complete page is gated behind authentication. |
| Request Cancellation | "Hủy đơn" Button | Protected | Requires booking owner authentication. Gated by route guard and validated server-side. |
| View Details | "Xem chi tiết" Button | Protected | Redirects to `/payment/result?booking_code=...` (which is also protected). |

## 3) Middleware Behavior

The `src/middleware.ts` has been secured for this feature:
- `/bookings` is explicitly added to the `protectedRoutes` array.
- Edge middleware checks if `token` cookie is missing.
- If missing, it redirects to `/login` (with localization path `/en/login` if applicable) and appends `?callbackUrl=/bookings`.

## 4) Redirect Flow

1. **Access Attempt**: User attempts to visit `/bookings` (or `/en/bookings`) directly.
2. **Edge Interception**: Middleware detects that `/bookings` is in the `protectedRoutes` list and checks for the existence of the `token` cookie.
3. **Redirection to Login**: If no token cookie exists, the user is redirected to `/login?callbackUrl=/bookings`.
4. **Successful Authentication**: Upon successful login, the application redirects the user back to `/bookings`.
5. **Session Expiry**: If a session expires during page view, the client-side `ProtectedLayout` `AuthChecker` detects that `isAuthenticated` is false and pushes the user back to the login page.

## 5) Risks and Assumptions

- **[RISK] Cookie Invalidation**: If the client-side Zustand store thinks the user is authenticated but the cookie is missing, the edge middleware will redirect. 
  - *Mitigation*: The project rules enforce token synchronization where Zustand token changes are immediately written to cookies via `js-cookie`.
- **[ASSUMPTION]**: Access to other users' bookings is blocked at the API layer. The `/user/bookings` API endpoint resolves the user identification directly from the authorization bearer token.
