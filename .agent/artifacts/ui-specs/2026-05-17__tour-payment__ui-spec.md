# UI Specification: Tour Payment Screen

This specification covers the component model, responsive behaviors, visual tokens, state transition matrices, and alignment strategies for the **Tour Payment / Checkout Screen** in `danangtrip-web` (Screen: `Thanh toán / Kết quả đặt tour`).

## 1. Design Token Alignment

All styling is anchored directly to the values defined in [DESIGN.md](file:///d:/DATN/danangtrip-web/DESIGN.md).

- **Colors:**
  - Neutral Base: `#080808` (Dark theme background)
  - Accent color: `#8B6A55` (Accent primary)
  - Secondary Accent: `#5C3822` (Warm brown gradient nodes)
  - Borders: `1px solid #262626`
- **Typography:**
  - Standard headers: Inter font family, bold, white (`#FFFFFF`).
  - Technical / tabular values: SFMono-Regular (`font-mono`) to highlight transaction identifiers and prices with monospace precision.
- **Glassmorphic Material Recipe:**
  - Background: `#171717/60` (Translucent dark overlay)
  - Borders: `1px solid #262626`
  - Backdrop Blur: `12px` (`backdrop-blur-xl`)
- **Shapes & Corners:**
  - Core containers: `16px` (`rounded-2xl`) for premium smooth contours.
  - Buttons / Controls: `9999px` (`rounded-full`) to implement pill-shaped design tokens from the design system.

---

## 2. Component Placement Strategy

Following the standard Triple-Layer component mapping pattern:

```
src/components/ui/           --> Primitive Atoms (Button, Badge, Loading spinner)
src/components/              --> Shared Organisms (Navbar, Footer, Layout shells)
src/features/payment/comps/  --> Local Organisms/Molecules (PaymentStatusCard, PaymentSummaryCard, etc.)
```

---

## 3. Reuse / New / Modify Matrix

| Action | Component Name | Path | Layer | Rationale |
|:---|:---|:---|:---|:---|
| **[REUSE]** | `Loading` | `src/components/ui/loading.tsx` | Atom | Standard pulse placeholder to avoid layouts shifting (CLS). |
| **[REUSE]** | `Link` | `src/i18n/navigation.ts` | Nav Primitive | Native Next-intl translated routing shell. |
| **[MOD]** | `PaymentClient` | `src/features/payment/components/PaymentClient.tsx` | Organism (Feature) | Coordinates subcomponents and ties polling state mutations. |
| **[NEW]** | `PaymentStatusCard` | `src/features/payment/components/PaymentStatusCard.tsx` | Molecule (Feature) | Premium card representing payment states with solar visual indicators. |
| **[NEW]** | `PaymentSummaryCard` | `src/features/payment/components/PaymentSummaryCard.tsx` | Molecule (Feature) | Visual container highlighting transaction info, payment method and final total. |
| **[NEW]** | `PaymentRetryPanel` | `src/features/payment/components/PaymentRetryPanel.tsx` | Organism (Feature) | Houses the 15-minute countdown clock logic, retry state handlers and CTA. |
| **[NEW]** | `PaymentActions` | `src/features/payment/components/PaymentActions.tsx` | Molecule (Feature) | Clean, responsive container for navigation triggers (Cancel, View Booking details). |

---

## 4. Component Interface & State Contracts

### A. `PaymentStatusCard`
Handles semantic display state for all workflow conditions.
- **Props Definition:**
  ```typescript
  interface Props {
    status: "pending" | "success" | "failed" | "redirecting";
    message?: string;
  }
  ```
- **State Visuals:**
  - `success`: Deep emerald check ring, displays congratulations.
  - `failed`: Rubine crimson cross, alerts payment failure.
  - `pending`: Amber circular loader, prompts to complete payment.
  - `redirecting`: Dynamic spinning accent ring, signals active API session retry.

### B. `PaymentSummaryCard`
Aggregates and formats essential transactional data.
- **Props Definition:**
  ```typescript
  interface Props {
    booking: Booking;
  }
  ```
- **Data Rendering:**
  - `booking.booking_code`: Rendered with SFMono-Regular, forced uppercase, extra character tracking.
  - `booking.payment_method`: Dynamic switch mapping to localized Vietnamese strings (e.g. `momo` -> `"MoMo E-Wallet"`).
  - `booking.total_amount`: Formatted via `formatCurrency()` using the accent theme color.

### C. `PaymentRetryPanel`
Ensures checkout timing and recovery flows remain clear.
- **Props Definition:**
  ```typescript
  interface Props {
    bookedAt: string;
    onRetry: () => void;
    isRetrying: boolean;
    disabled?: boolean;
  }
  ```
- **Countdown Timing Spec:**
  - Active duration: `15 minutes` starting from `bookedAt` timestamp.
  - **Expiry Handler:** When `diff <= 0`, disables the "Retry" button and prints a helpful recovery error text.

### D. `PaymentActions`
Bottom dashboard navigation panel.
- **Props Definition:**
  ```typescript
  interface Props {
    status: "pending" | "success" | "failed" | "redirecting";
    booking: Booking;
  }
  ```

---

## 5. Responsive & Layout Alignment

- **Layout Structure:** Center-aligned grid shell `(design-container)` with max-width `4xl`.
- **Spacing:** Py-12 (Mobile) scaling to Py-20 (Desktop) for comfortable vertical breathing room.
- **Actions Row:** Stacked vertically on mobile screens for finger-friendly button tapping, transforming to side-by-side row display on `sm:` breakpoints (640px+).

---

## 6. Verification Steps

1. **Production Build Integrity:** Run `npm run build` to confirm static code compilation is clear of warnings.
2. **Typescript Check:** Validate compiler safety via `npx tsc --noEmit`.
3. **i18n Fallback Check:** Confirm all labels resolve cleanly through `next-intl` without missing messages.
