# UI Specification: Tour Departure Select

## 1) Design Token Alignment

- **Colors:** Primary (`#8B6A55`), Neutral (`#080808`), Surface (`#030303`), Text (`#737373`, `#FFFFFF`).
- **Typography:** `Inter` for Display/Headings (`font-black`, `uppercase`, `tracking-tight`), `SFMono-Regular` or standard sans for body.
- **Spacing:** Base `4px` rhythm. Gaps of `16px`, `24px` for section spacing.
- **Motion:** `reveal-up` class for section entrances with staggered `animationDelay` (`100ms`, `200ms`, `300ms`).
- **Elevation:** Glassmorphism utilizing `glass-shell`, `glass-inner`, `bg-surface-container-low`, and `border-border/30`.

## 2) Reuse Audit

| Component | Layer | Path | Reason |
|---|---|---|---|
| `ScheduleCalendar` | Molecule | `src/features/tour/components/ScheduleCalendar.tsx` | [REUSE] Handles date selection, showing full/available statuses. |
| `QuantityCounter` | Molecule | `src/features/tour/components/QuantityCounter.tsx` | [REUSE] Handles the plus/minus stepper for passengers. |
| `OrderSummaryCard` | Organism | `src/features/tour/components/OrderSummaryCard.tsx` | [REUSE] Displays dynamic pricing based on selections. |
| `Button` | Atom | `src/components/ui/button.tsx` | [REUSE] Standard CTA button. |

## 3) Component Decomposition

| Component | Layer | Path | Type |
|---|---|---|---|
| `DepartureSelectClient` | Page Section / Feature Organism | `src/features/tour/components/DepartureSelectClient.tsx` | [MOD] Needs refactoring from `useState` to `react-hook-form` + `zod` to align with booking architecture standards. |

## 4) State Contract

- **Loading:** 
  - `ScheduleCalendar` section shows a block skeleton `animate-pulse` while `useTourSchedules` fetches.
  - `OrderSummaryCard` shows an inline spinner and reduces opacity while `bookingService.calculate` (or local calculation) runs.
- **Empty:** 
  - If no schedules exist, `ScheduleCalendar` renders an empty calendar with no selectable dates.
- **Disabled:** 
  - The "Tiếp tục" (Continue) CTA is disabled if no `schedule_id` is selected or if `adults < 1`.
  - `QuantityCounter` for Adults disables the minus button at `1`. Children/Infants at `0`.
- **Validation Error:**
  - Handled by React Hook Form. Form submission is blocked, and input validation messages (if any) could be shown, though for this UI, the "Continue" button is simply disabled until the form is valid.

## 5) Placement Strategy

- `DepartureSelectClient` is strictly **Feature-local** (`src/features/tour/components/`).
- The Route Shell `src/app/[locale]/(main)/(public)/tours/[slug]/departures/page.tsx` simply renders the client component.

## 6) Refactoring Plan for `DepartureSelectClient.tsx`

We will update the existing `DepartureSelectClient` to:
1. Initialize `useForm<DepartureSelectFormValues>` with `zodResolver(departureSelectSchema)`.
2. Use `Controller` or direct `setValue` / `watch` for the Calendar and QuantityCounters.
3. Call `checkAvailability` via React Query (or local check against schedule object) to validate total slots.
4. Pass the form values into the URL query parameters on valid submit and navigate to `/book`.