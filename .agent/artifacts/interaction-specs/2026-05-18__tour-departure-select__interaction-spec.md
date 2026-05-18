# Interaction Specification: Chọn lịch khởi hành

## 1. Feature Summary
- Feature slug: `tour-departure-select`
- Date: `2026-05-18`
- Primary route: `/tours/[slug]/departures`
- Sources used:
  - `.agent/artifacts/analysis/2026-05-18__tour-departure-select__screen-analysis.md`
  - `.agent/artifacts/integration/2026-05-18__tour-departure-select__data-integration.md`
  - `.agent/artifacts/routing/2026-05-18__tour-departure-select__route-plan.md`
  - `src/features/tour/components/DepartureSelectClient.tsx`
  - `src/features/tour/components/ScheduleCalendar.tsx`
  - `src/features/tour/components/QuantityCounter.tsx`
  - `src/features/tour/components/OrderSummaryCard.tsx`

## 2. Main Action Flows

### Flow A. Enter Screen And Load Data
- User opens `/tours/[slug]/departures`.
- Server page resolves the tour by slug and passes core tour data to the client component.
- Client component loads schedules with `useTourSchedules(tour.id)`.
- While schedules are loading, the calendar area shows skeleton UI and the continue CTA stays disabled.

### Flow B. Select Departure Schedule
- User clicks an available date in `ScheduleCalendar`.
- The client stores the selected schedule id locally.
- If the schedule is sold out, closed, or past the booking deadline, the date is not selectable.
- When a valid schedule is selected, the summary panel updates immediately using the selected schedule pricing and local quantity state.

### Flow C. Adjust Passenger Quantities
- User adjusts `adults`, `children`, and `infants` via `QuantityCounter`.
- `adults` must remain `>= 1`.
- `children` and `infants` must remain `>= 0`.
- Total passenger count cannot exceed the remaining allowed capacity for the selected schedule.
- Quantity changes recompute the temporary summary synchronously on the client.

### Flow D. Continue To Booking
- User clicks the primary CTA after selecting a valid schedule and quantities.
- Client performs a final guard:
  - valid selected schedule exists
  - `adults >= 1`
  - requested quantity does not exceed current remaining seats
- On success, the client navigates to `/tours/[slug]/book` using URL params for handoff.
- Query handoff must include the schedule selection and quantities in the repo's current preferred format.

### Flow E. Recover From Bad Or Missing State
- If the slug is invalid, the page-level fetch falls back to `notFound()` or the route error boundary.
- If schedules fail to load, the calendar block shows an error state and the CTA remains disabled.
- If the query state is incomplete after hydration, the page does not auto-redirect; it waits for explicit user selection.

## 3. Client Validation Rules

| Field / State | Rule | User-facing effect |
| --- | --- | --- |
| `selectedScheduleId` | Required before continue | Disable CTA and show inline helper state |
| `adults` | Minimum `1` | Prevent decrement below `1` |
| `children` | Minimum `0` | Prevent decrement below `0` |
| `infants` | Minimum `0` | Prevent decrement below `0` |
| total passengers | Must not exceed remaining seats | Disable increment or block continue with error feedback |
| selected schedule status | Must be selectable | Prevent click and render non-active style |

## 4. URL And State Ownership

| State | Owner | Persistence |
| --- | --- | --- |
| `selectedScheduleId` | Client local state | Serialized into booking route query on continue |
| `adults` | Client local state | Serialized into booking route query on continue |
| `children` | Client local state | Serialized into booking route query on continue |
| `infants` | Client local state | Serialized into booking route query on continue |

- Recommended handoff shape:
  - `schedule_id` or `tour_schedule_id`
  - `adults`
  - `children`
  - `infants`
- [ASSUMPTION] The booking page continues to accept or map legacy `schedule_id` style params even though internal form state uses `tour_schedule_id`. This must stay aligned with the API-contract artifact and current implementation.

## 5. Feedback And Error Handling
- Loading state:
  - calendar skeleton
  - summary placeholder
  - disabled CTA
- Empty state:
  - message that no schedules are available
  - link or button back to tour detail
- Error state:
  - retry affordance for schedule fetch failure
  - toast or inline message if continue is blocked by invalid selection
- Success state:
  - route navigation to booking page with preserved context

## 6. i18n Impact
- The feature requires localized copy under `tour` namespace for:
  - title
  - schedule helper text
  - passenger labels
  - continue CTA
  - empty and error states
  - availability or sold-out messaging
- No raw hardcoded user-facing strings should remain in the final JSX.

## 7. Risks And Open Questions
- [ASSUMPTION] The departure screen remains public while `/tours/[slug]/book` may still require auth via existing middleware.
- Local temporary total is intentionally computed client-side because authenticated-only pricing APIs would otherwise block public usage.
- If backend pricing later adds promotions or per-schedule overrides beyond current client logic, temporary totals may diverge from final checkout totals until the contract is expanded.
