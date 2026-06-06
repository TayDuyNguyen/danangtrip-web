# Code Review Report: user-cart

> Feature slug: `user-cart`
> Date: 2026-05-25
> Scope: `Codebase Integrity, Design Systems Compliance, & Technical Audits`

---

## 1) Architectural Compliance Checklist

We conducted a complete codebase review of the implemented files for the user shopping cart screen and backend API, verifying alignment against the repository operating rules in `.agent/rules/PROJECT_RULES.md`:

| Operating Rule | Checked Files | Evaluation Status | Review Findings & Observations |
|---|---|---|---|
| **Feature Isolation** | `src/features/cart` | **PASS** | Cart components, Zustand stores, hooks, services, and routes reside strictly inside the cart feature directory. |
| **Data Fetching Boundaries** | `useCartQueries.ts`, `cart.service.ts` | **PASS** | Queries and mutations are centralized inside `useCartQueries.ts`. All API traffic is routed through Axios clients in `cart.service.ts`. |
| **TypeScript Strictness** | All added TSX/TS files | **PASS** | All components, state stores, and validation schemas are fully typed. Semicolon/bracket errors resolved, zero raw TypeScript compiler errors (`tsc --noEmit` passed). |
| **i18n & Localizations** | `cart.json` (vi & en) | **PASS** | Zero hardcoded user-facing strings in UI code. Custom translations for cart items, alerts, checkout buttons, and warnings were added and registered in `src/i18n/request.ts` (resolving next-intl missing message warning). |
| **Aesthetic Design Tokens** | `CartContainer.tsx`, `CartItemRow.tsx`, `CartSummary.tsx` | **PASS** | Azure color palette styling (`#8B6A55`), glassmorphism surfaces (`glass-surface`), proper spacing, standard rounded corners, and staggered animations matching `DESIGN.md`. |
| **Edge / Middleware Compliance** | `src/middleware.ts` | **PASS** | Checked that `/cart` runs correctly under locale subpath routing. Guest cart store uses local Zustand persistence to bypass server constraints. |

---

## 2) Code Walkthrough & Auditing Details

### A) Database Migration & Backend Schema (`danangtrip-api`)
- **Review**: Created the `cart_items` migration mapping `user_id`, `tour_id`, `tour_schedule_id`, and booking passenger quantities (`quantity_adult`, `quantity_child`, `quantity_infant`).
- Added compound unique index `[user_id, tour_schedule_id]` to enforce single entry per schedule for a user.
- Handled quantity validators (`AddToCartRequest`, `UpdateCartRequest`) and capacity constraints inside `CartController.php` using backend database checks (`booked_people` vs `max_people`).
- Created a robust merging endpoint (`POST /api/cart/merge`) which takes a guest cart payload, inserts/updates items in the database, and deletes expired schedule entries.

### B) Frontend Hybrid Cart State & Persisted Zustand Store (`danangtrip-web`)
- **Review**: Implemented hybrid cart system. When the user is a guest, items are stored in browser local storage via Zustand persistence (`src/store/cart.store.ts`).
- When the user logs in, `<CartSync />` detects the state transition and calls the merge API mutation. Upon success, local storage is cleared, and React Query refetches database-driven items.
- Implemented quantity counters using `<QuantityCounter />` components, passing down updated availability ranges and disabled states.

### C) Seat Capacity Safety & Expiry Warnings
- **Review**: Cart items are marked with proper warnings if the departure schedule is sold out, expired, or has fewer seats remaining than requested.
- Quantity adjustment buttons are dynamically disabled if the selected options exceed the current departure schedule capacity limits.

---

## 3) Quality Gate Outcomes

- **ESLint**: Passed with 0 errors. Fixed a React setState synchronous call inside an effect within `BookingForm.tsx` by wrapping it in `setTimeout`.
- **TypeScript**: Passed with 0 errors. Addressed price parsing types, missing Tour thumbnail variables, and schedule departure codes.
- **Next.js Production Build**: Passed. Generated all static and dynamic pages with 0 warnings/missing localization files.
