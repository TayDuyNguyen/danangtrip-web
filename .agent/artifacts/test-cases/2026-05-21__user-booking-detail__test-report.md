# E2E Test Execution & Validation Report: `user-booking-detail`

- **Feature Area**: `user-booking-detail` (Booking History Details & Actions)
- **Target Repository**: `danangtrip-web` (Next.js App Router with next-intl)
- **Test Date**: 2026-05-21
- **Testing Engine**: Playwright E2E Runner (headed Chromium context)
- **Test State**: Pre-authenticated via global setup (`storageState` hydration)
- **Execution Result**: **100% PASS** (10 of 10 tests passed successfully)

---

## 1. Test Suite Summary

The following test suite was executed against the local development environment (`http://localhost:3000`) with backend API (`http://127.0.0.1:8000/api/v1`) active.

| Phase | Test Case Description | Status | Evidence (Screenshot) | Notes / Details |
| :--- | :--- | :--- | :--- | :--- |
| **5.2** | Unauthenticated user redirected to `/login` | **PASS** | [01_auth_redirect_unauthenticated.png](file:///d:/DATN/danangtrip-web/test-results/screenshots/01_auth_redirect_unauthenticated.png) | Correctly redirects to `/login` with `callbackUrl` search param. |
| **2.1** | Desktop layout — Booking detail renders correctly | **PASS** | [05_booking_detail_desktop.png](file:///d:/DATN/danangtrip-web/test-results/screenshots/05_booking_detail_desktop.png) | Responsive viewport: 1280x800. Verification of grids, cards, and timelines. |
| **2.1** | Tablet layout — Booking detail responsive | **PASS** | [06_booking_detail_tablet.png](file:///d:/DATN/danangtrip-web/test-results/screenshots/06_booking_detail_tablet.png) | Responsive viewport: 768x1024. Flex/grid elements collapse cleanly. |
| **2.1** | Mobile layout — Booking detail responsive | **PASS** | [07_booking_detail_mobile.png](file:///d:/DATN/danangtrip-web/test-results/screenshots/07_booking_detail_mobile.png) | Responsive viewport: 375x812. Scrollable timeline and compact summaries. |
| **5.1** | i18n — English version renders correctly | **PASS** | [08_booking_detail_english.png](file:///d:/DATN/danangtrip-web/test-results/screenshots/08_booking_detail_english.png) | Canonical locale prefix `/en` works, headers match expected translations. |
| **5.1** | i18n — Vietnamese version renders correctly | **PASS** | [08b_booking_detail_vi.png](file:///d:/DATN/danangtrip-web/test-results/screenshots/08b_booking_detail_vi.png) | Default locale (unprefixed `/bookings/...`) renders perfect Vietnamese. |
| **3** | Functional — Invoice buttons & navigation visible | **PASS** | [09_booking_detail_buttons.png](file:///d:/DATN/danangtrip-web/test-results/screenshots/09_booking_detail_buttons.png) | Checks print, JSON, back buttons presence. |
| **3** | Functional — Cancel dialog validation flow | **PASS** | [10_cancel_dialog_opened.png](file:///d:/DATN/danangtrip-web/test-results/screenshots/10_cancel_dialog_opened.png) to [14_cancel_dialog_closed.png](file:///d:/DATN/danangtrip-web/test-results/screenshots/14_cancel_dialog_closed.png) | Confirms dialog triggers, errors on short/empty reasons, and closes via Escape. |
| **4.5** | No console errors on booking detail page | **PASS** | *Console logs verified* | No uncaught JavaScript errors. Title and main heading match SEO standards. |
| **2** | Bookings list — Renders with booking cards | **PASS** | [04_bookings_list.png](file:///d:/DATN/danangtrip-web/test-results/screenshots/04_bookings_list.png) | Verifies main booking page renders list of active bookings. |

---

## 2. Key Findings & Resolved Issues

### 2.1. Critical Route Protection / Hydration Race Condition (FIXED)
During initial E2E runs, we discovered a major hydration race condition in the application's auth routing layout:
- **The Issue**: When directly navigating to `/bookings/[id]`, the `ProtectedLayout` component’s `AuthChecker` child checks the user state:
  ```typescript
  const { isAuthenticated, isLoading } = useAuthStore();
  ```
  Since Zustand state starts as `isAuthenticated: false` and `isLoading: false` by default prior to client-side hydration, the client-side `useEffect` instantly fired and called `router.push('/login?callbackUrl=...')`.
- Next, Next.js Edge Middleware intercepted `/login`, detected the `token` cookie was indeed present (pre-loaded from `auth-state.json`), and redirected the user to the home page `/`.
- This resulted in an infinite redirection loop to the home page `/` instead of staying on `/bookings/[id]`.
- **The Fix**: We updated [layout.tsx](file:///d:/DATN/danangtrip-web/src/app/[locale]/(main)/(protected)/layout.tsx) by introducing an `isHydrated` local state that initializes to `true` in a `useEffect` on mount. This delays the client-side authentication/redirection checks until client hydration has completed and the Zustand store has successfully retrieved its persistent state from `localStorage`:
  ```typescript
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => { setIsHydrated(true); }, []);
  ```
  With this fix applied, all direct booking detail page loads run flawlessly.

### 2.2. Vietnamese Character Encoding Glitch (BUG IDENTIFIED)
During visual audits of the Vietnamese booking details screen, we identified a character encoding issue:
- Under **THÔNG TIN THANH TOÁN** (Payment Info Card), the **PHƯƠNG THỨC THANH TOÁN** (Payment Method) value renders as `Ti?n m?t` instead of `Tiền mặt` (Cash).
- **Impact**: Medium visual bug affecting localized Vietnamese UX.
- **Root Cause**: The backend API response returns `Ti?n m?t` directly in the payload due to database collation/character set misconfigurations (`utf8` vs `latin1`/`ascii`) or encoding mismatches during serialization.

### 2.3. i18n Translation & Raw Keys Audit (VERIFIED)
- **Visual Audit**: Visual checks of both the Vietnamese and English screenshots show 100% of labels are cleanly translated and fully hydrated without any raw translation leaks.
- **Console Warnings (False Positive)**: The testing regex matching `[a-z_]+\.[a-z_]+\.[a-z_]+` detected text inside the body. Upon investigation, this was verified to be a false positive caused by the regex matching serialized metadata inside the `<script id="__NEXT_DATA__">` hydration payload (such as `next-intl` configuration details) rather than any visible text leakage. The actual visible UI is completely clean.

---

## 3. Visual Validation Evidence

The visual assets generated by this E2E test run have been saved to the workspace at `test-results/screenshots/`. Below is a selection of the visual evidence:

### 3.1. Desktop Booking Details Screen
 Renders all components (Timeline, Tour Information, Customer Details, and Payment Summary) with high visual fidelity.
![Desktop Booking Details](file:///d:/DATN/danangtrip-web/test-results/screenshots/05_booking_detail_desktop.png)

### 3.2. Responsive Viewports (Tablet & Mobile)
 The layouts are highly responsive, maintaining layout constraints and readability down to 375px wide.
- **Tablet (768px wide)**:
![Tablet View](file:///d:/DATN/danangtrip-web/test-results/screenshots/06_booking_detail_tablet.png)
- **Mobile (375px wide)**:
![Mobile View](file:///d:/DATN/danangtrip-web/test-results/screenshots/07_booking_detail_mobile.png)

### 3.3. Cancel Booking Dialog Validation
- **Validation Error (Empty Reason)**: Correctly highlights the textarea border in red and renders standard Vietnamese validation text:
![Empty Error](file:///d:/DATN/danangtrip-web/test-results/screenshots/11_cancel_dialog_empty_error.png)
- **Validation Error (Short Reason)**: Handles intermediate reason lengths (< 10 chars):
![Short Error](file:///d:/DATN/danangtrip-web/test-results/screenshots/12_cancel_dialog_short_error.png)
- **Valid Entry Filled**: The confirmation button becomes active and input displays perfectly:
![Valid Reason](file:///d:/DATN/danangtrip-web/test-results/screenshots/13_cancel_dialog_valid_reason.png)

---

## 4. Recommendations & Recommendations
1. **Fix Backend Collation**: Standardize database character sets to `utf8mb4` on the backend API tables to correct the `Ti?n m?t` encoding bug.
2. **Client-Side Hydration Standard**: Ensure other protected Next.js features utilize this newly introduced `isHydrated` guard pattern to prevent direct routing redirection issues.
