# Authentication & Permissions Review: Tour Payment

This review outlines the security protocols, route middleware guards, user role access matrix, and client-side UI gating rules for the **Tour Payment / Checkout Screen** in `danangtrip-web` (Screen: `Thanh toán / Kết quả đặt tour`).

---

## 1. Protected Routes & Redirect Behavior

The checkout/payment module is restricted exclusively to authenticated users.

| Route Path Pattern | Access Requirement | Guard Mechanism | Unauthorized Behavior |
|:---|:---|:---|:---|
| `/[locale]/payment` | Authenticated Only | Edge Middleware & Client-Side Store Guard | Redirects to `/login?callbackUrl=%2Fpayment` |

### A. Edge Middleware Guard
- Configured in [middleware.ts](file:///d:/DATN/danangtrip-web/src/middleware.ts):
  ```typescript
  const protectedRoutes = [
    "/dashboard", 
    "/profile", 
    "/settings", 
    "/tours/[slug]/book", 
    "/payment" // Added
  ];
  ```
- Evaluates request cookie `token`. If absent, automatically generates a `307 Temporary Redirect` response pointing to the Login route.

### B. Client-Side Layout Wrapper Guard
- Implemented in [layout.tsx](file:///d:/DATN/danangtrip-web/src/app/[locale]/(main)/(protected)/layout.tsx):
  - Uses state management library Zustand (`useAuthStore`) as the ultimate source of truth.
  - If Zustand store evaluates `isLoading` as `true`, halts layout mounting and renders a beautiful, structural **Loading Skeleton** instead of standard spinner indicators.
  - If `isAuthenticated` evaluates to `false`, triggers router transition to the `/login` route with a `callbackUrl` URL parameter to enable redirection upon successful authentication.

---

## 2. User Role Access Matrix

Since payment processing relates directly to the account that placed the booking order:

| Role Identifier | Read Access (View Status) | Write Access (Retry Payment) | Delete/Cancel Access |
|:---|:---|:---|:---|
| `user` (Registered) | **Allowed** (Only own bookings) | **Allowed** (Only own bookings) | **N/A** (No cancellation from checkout screen) |
| `admin` (Administrator) | **Allowed** | **Allowed** | **N/A** (No cancellation from checkout screen) |
| `guest` (Unauthenticated) | **Blocked** (Forced redirect) | **Blocked** | **Blocked** |

- `[ASSUMPTION]`: Only the actual user who created the booking (identified by `user_id` matching `booking.user_id`) is allowed to view or retry the payment status of that booking. This is validated on the backend API layer.

---

## 3. UI Gating Strategy

We enforce strict **conditional rendering** patterns instead of client-side hidden classes (`display: none` / CSS hides) to block unauthorized elements from mounting in the DOM tree.

| Element Trigger | Action Type | Condition Rule | Visual Behavior |
|:---|:---|:---|:---|
| `PaymentRetryPanel` | Trigger Mutation | `status === "failed" \|\| status === "pending"` | Renders inline. |
| "Retry Payment" Button | Call Mutation | `booking.payment_status !== "success" && !isExpired` | Renders inline. Locked (disabled) if time diff exceeds 15-minute expiration threshold. |
| "View Booking" Button | Routing Navigation | `status === "success"` | Displays inline. Leads to `/user/bookings/{booking.id}` details view. |

---

## 4. Auth Integrity Flow & Token Sync

- **Token Synchronization:** Axio client instance automatically attaches the active authentication token to outgoing requests in an interceptor request handler.
- **Session Expiry (401 Unauthorized):**
  - If the backend returns a `401 Unauthorized` response, the interceptor clears Zustand state (`clearAuth()`) and redirects the client viewport directly to the `/login` screen.
- **Double Authentication Checks:**
  - Standard edge middleware validates cookies at the network level.
  - Client-side state store confirms application memory alignment to prevent stale states or UI inconsistencies.

---

## 5. Security Risks & Recommendations

- **Risk:** If a user logs out in another browser tab, the active page might retain stale state and allow the user to click "Retry".
- **Mitigation:** The custom hook queries ensure requests include proper Authorization headers. If the API returns a `401`, the application will instantly trigger a redirect, ensuring complete data security.
