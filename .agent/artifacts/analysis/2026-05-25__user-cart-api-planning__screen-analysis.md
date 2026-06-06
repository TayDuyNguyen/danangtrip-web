# Screen Analysis: User - Giỏ hàng tour (user-cart)

- **Feature Slug**: `user-cart-api-planning`
- **Screen Name**: Giỏ hàng Tour (User Cart)
- **Proposed Route**: `/cart` (Publicly accessible, behavior adapts based on auth state)
- **Target Page Path**: `src/app/[locale]/(main)/(public)/cart/page.tsx`
- **Target Feature Folder**: `src/features/cart`
- **Primary Document**: `D:\DATN\DATN_Document\docs\page\user_cart.md`

---

## 1. Purpose of the Screen
The User Cart page allows users to save one or more tours with specific departure schedules, travel dates, and guest counts (adults, children, infants) before proceeding to checkout. It acts as a staging area that validates pricing, availability, and active schedules to avoid booking stale or sold-out tours.

---

## 2. Design & Token Audit
Aligned with `DESIGN.md` guidelines, the cart screen must implement the following design tokens:
- **Foundations**: Background uses `#080808` (neutral dark), surfaces use `#030303` (glassmorphic surfaces).
- **Accents**: Primary color is `#8B6A55` (Azure/warm bronze) for active selections, CTA buttons, and highlighted text.
- **Glassmorphism**: Border treatments with `1px border-white/5` (or `#262626`) and `backdrop-blur-xl (12px)` for panel framing.
- **Gradient Shells**: Outer borders for summary cards wrapped in `linear-gradient(to right bottom, rgba(92, 56, 34, 0.4), rgba(46, 58, 47, 0.1))` to add visual depth.
- **Rhythm**: Spacing aligned to a `4px` grid (gaps of `16px`, `24px` for layout padding).
- **Motion**: Component loading reveals must use staggered CSS animations (`reveal-up` with increments of `100ms`).

---

## 3. Component Breakdown

| Component | Type | Layer | Path / Target Path | Reason / Description |
|---|---|---|---|---|
| `CartIcon` | [NEW] | Atom | `src/features/cart/components/CartIcon.tsx` | Cart icon with item-count badge for the global header. |
| `CartItemRow` | [NEW] | Molecule | `src/features/cart/components/CartItemRow.tsx` | Individual item display. Shows tour title, selected schedule date, quantity controls, subtotal, and availability/expiration alerts. |
| `CartList` | [NEW] | Organism | `src/features/cart/components/CartList.tsx` | Container for list of items. Manages item list mapping and rendering empty state. |
| `CartSummary` | [NEW] | Molecule | `src/features/cart/components/CartSummary.tsx` | Displays subtotal, discount, final amount, promotion code inputs, and Checkout CTA. |
| `QuantityCounter` | [REUSE] | Molecule | `src/features/tour/components/QuantityCounter.tsx` | Reuses the passenger count adjustment design for adults, children, and infants. |
| `Button` | [REUSE] | Atom | `src/components/ui/Button.tsx` | Primary action button styled with `#171717` and round edges. |

---

## 4. Responsive & UI States

| Section / Component | Mobile (< 768px) | Tablet (768px - 1024px) | Desktop (> 1024px) |
|---|---|---|---|
| **Overall Layout** | Stacked vertically: Items on top, Summary card at the bottom. | Stacked vertically or side-by-side if portrait. | Side-by-side: Items (flex-1) left, Summary card (width: 380px) sticky right. |
| **Cart Item Row** | Compact stacked columns (Title -> meta/schedules -> quantity controls & price stacked). | Row layout: horizontal alignment of image, details, quantities, subtotal. | Row layout: horizontal alignment with hover indicators and smooth deletion animations. |

### Component States

| Component / Section | Loading | Empty | Error | Success / Active |
|---|---|---|---|---|
| **Cart List** | Skeleton loader block simulating 2 items. | "Giỏ hàng trống" with illustrative icon and CTA pointing to `/tours`. | Inline alert card with retry button. | Active items with entry animations (`reveal-up`). |
| **Cart Summary** | Shimmer lines for subtotal, discount, total. | Disabled Checkout button, calculations read `0đ`. | Inline error indicator below promo code. | Active summary showing breakdown, recalculating state during count changes. |

---

## 5. Data & API Mapping

The cart page retrieves data differently based on authentication:
- **Guest mode**: Read from LocalStorage.
- **User mode**: Read from backend API `/v1/cart`.

### Field Schema (Cart Item)

| Field | Type | Required | Source | Note |
|---|---|---|---|---|
| `id` | `number` | Yes | LocalStorage / Database | Primary Key of the item |
| `tour_id` | `number` | Yes | LocalStorage / Database | Foreign key to `tours` |
| `tour.name` | `string` | Yes | LocalStorage / Database | Tour title |
| `tour.slug` | `string` | Yes | LocalStorage / Database | Tour slug for routing |
| `tour.image_url` | `string` | No | LocalStorage / Database | Thumbnail image |
| `tour_schedule_id` | `number` | Yes | LocalStorage / Database | Foreign key to `tour_schedules` |
| `tour_schedule.start_date`| `string` | Yes | LocalStorage / Database | Selected travel date (formatted `Y-m-d`) |
| `tour_schedule.booking_availability` | `string` | Yes | LocalStorage / Database | Target capacity check: `open`, `few_seats`, `sold_out` |
| `quantity_adult` | `number` | Yes | LocalStorage / Database | Minimum 1 |
| `quantity_child` | `number` | Yes | LocalStorage / Database | Default 0 |
| `quantity_infant` | `number` | Yes | LocalStorage / Database | Default 0 |

---

## 6. Business, Auth & i18n Rules

### Business Rules
1. **Seat Availability Check**: When quantities are updated, the frontend must recalculate prices and verify schedule seat limits (`tour_schedule.max_people - tour_schedule.booked_people >= adults + children`). If exceeded, show a validation warning and disable checkout.
2. **Expired Schedule**: If a schedule's `start_date` is in the past, or its status is not `open`/`few_seats` (e.g. sold out or cancelled), mark the item as **Expired**. Excluded from checkout final sum, and displays select replacement date option.
3. **Cart-to-Booking Checkout Conversion**: On Checkout click:
   - Redirect to booking page. If multiple items are selected, we support multi-item checkout, but since the existing `/tours/[slug]/book` flow handles single tours, the initial launch will check out **one cart item at a time** (clicking "Checkout" on a specific cart item redirects to `/tours/[slug]/book?schedule_id=X&adults=Y&children=Z`). This provides 100% backward compatibility with the existing single-tour booking and payment flow.

### Auth Rules
- **Hybrid Storage (Option A Approved)**: 
  - On page load, if user is logged in, use `useQuery` to fetch items from `/v1/cart`.
  - If guest, read from `localStorage` under key `danangtrip_cart`.
  - On login, a synchronization service reads `danangtrip_cart` array and POSTs it to `POST /v1/cart/merge` to write to the database, then clears `danangtrip_cart`.

### i18n Impact
- Messages must be synchronized in:
  - `src/messages/vi.json` -> namespace `"cart"`
  - `src/messages/en.json` -> namespace `"cart"`
- Text variables: page titles, empty states, quantity labels, checkout actions, warnings (sold out, expired), subtotal labels.

---

## 7. Open Issues & Assumptions
- **[ASSUMPTION]**: We assume that guest items are merged immediately upon login. If the same tour schedule is already in the database user's cart, we merge counts up to the capacity limit.
- **[ASSUMPTION]**: Checkout redirects to the existing `/tours/[slug]/book` booking form with parameters passed in query parameters (`?schedule_id=X&adults=Y...`). This avoids writing a second booking form page.
