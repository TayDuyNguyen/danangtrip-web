# Screen Analysis: Tour Departure Select

## 1) Summary And Scope

- **Objective:** Allow users to choose a departure date (schedule), specify the number of guests (adults, children, infants), and verify live availability and price before proceeding to the booking flow.
- **Primary Actor:** Public User (no authentication required at this step).
- **Module/Feature:** Tour Booking Funnel.
- **Screen Type:** Interactive Selection Modal / Page Section (Modal in Tour Detail is preferred based on prototype references, but can fallback to a dedicated page `/tours/{slug}/departures` if modal proves complex).

## 2) Design And Token Audit

This screen adheres to the Bronze/Dark design tokens specified in `DESIGN.md`. 
Although some prototypes use light mode (`#FFFFFF` background, `#1E293B` text, etc.), **repo reality mandates Dark Mode/Glassmorphism**.

- **Background:** Neutral (`#080808`) or Surface (`#030303`).
- **Text:** Primary (`#737373`), Secondary (`#FFFFFF`).
- **Accent/Primary:** Azure equivalent (`#8B6A55` / `#5C3822`).
- **Surface:** Glass effect with thin gradient borders (`#262626`).
- **Radii:** `4px`, `7px`, `8px`, `12px`, `9999px`.
- **Motion:** `reveal-up` entrance animations with staggered delays (`100ms` increments).
- **Conflict:** The provided doc (`user_tour_detail.md`) suggests a Light UI (e.g. `bg white`, `text #1E293B`, `bg #FFE0D4 text #FF6B35`). **[RESOLUTION]**: We will strictly apply the `DESIGN.md` dark mode tokens and glassmorphism UI for all components.

## 3) Component Breakdown

| Component | Type | Layer | Path | Reason |
|---|---|---|---|---|
| `ScheduleCalendar` | [REUSE] | Molecule | `src/features/tour/components/ScheduleCalendar.tsx` | Reuse the existing calendar to pick a departure date. Needs adaptation if it doesn't already support 'full' / 'past' states. |
| `QuantityCounter` | [REUSE] | Molecule | `src/features/tour/components/QuantityCounter.tsx` | Reuse for adult, child, and infant selections. |
| `OrderSummaryCard` | [REUSE] | Molecule | `src/features/tour/components/OrderSummaryCard.tsx` | Reuse for displaying the live calculated price before CTA. |
| `DepartureSelectClient` | [NEW] | Organism | `src/features/tour/components/DepartureSelectClient.tsx` | The main interactive container handling state (selected schedule, quantities) and coordinating API calls. |
| `DepartureAvailabilityBadge` | [NEW] | Atom | `src/features/tour/components/DepartureAvailabilityBadge.tsx` | Displays "Remaining slots: X" or "Sold Out" based on the selected schedule. |
| `DepartureSelectPageShell` | [NEW] | Section | `src/app/[locale]/(main)/(public)/tours/[slug]/departures/page.tsx` | Server component shell to fetch initial tour data (if implemented as a standalone route). |

## 4) Responsive And UI States

| Section | Loading | Empty | Error |
|---|---|---|---|
| Entire Screen | Global loader or skeleton if fetching tour details. | N/A | Full page generic error. |
| Schedule Calendar | Skeleton grid for dates. | "Không có lịch khởi hành nào." | Toast error + Retry button. |
| Selected Schedule Info | Skeleton line. | Hidden until a date is selected. | N/A |
| Quantity Selection | Disabled inputs. | N/A | N/A |
| Price Summary (`/bookings/calculate`) | Skeleton lines for price calculation. | "Vui lòng chọn ngày và số khách." | Inline red text or Toast error. |
| CTA Button ("Đặt ngay") | Disabled + Loading spinner. | Disabled. | Disabled. |

## 5) Data And API Mapping

| Field | Type | Required | Source | Note |
|---|---|---|---|---|
| `slug` | `string` | ✓ | `GET /tours/{slug}` | Path param, needed to get `tour_id`. |
| `tour_id` | `number` | ✓ | `GET /tours/{slug}` | Extracted from the tour detail. |
| `schedules` | `Array` | ✓ | `GET /tours/{id}/schedules?from=&to=` | Loads available dates for the calendar. |
| `schedule_id` | `number` | ✓ | (User Input) | The selected date's ID. **Note:** Needs to be mapped to `tour_schedule_id` for booking API. |
| `quantity_adult` | `number` | ✓ | (User Input) | Min: 1. |
| `quantity_child` | `number` | ✗ | (User Input) | Min: 0. |
| `quantity_infant` | `number` | ✗ | (User Input) | Min: 0. |
| `availability` | `Object` | ✓ | `POST /tours/{id}/check-availability` | Returns remaining slots. Triggered when schedule + quantities change. |
| `price_summary` | `Object` | ✓ | `POST /bookings/calculate` | Returns itemized price. Triggered when schedule + quantities change. |

**[ASSUMPTION]**: The `POST /bookings/calculate` endpoint expects `tour_schedule_id` according to the booking schema context, while some docs refer to it as `schedule_id`. We will use the exact payload expected by the endpoint (likely `tour_schedule_id`).

## 6) Business / Auth / i18n Review

- **Business Rules:**
  - At least 1 Adult is required.
  - Total passengers (`adult + child + infant`) cannot exceed `remaining_slots`.
  - Past schedules or schedules marked `full` cannot be selected.
- **Auth Requirement:** 
  - **Public.** Users do not need to be logged in to select dates, check availability, and calculate prices. 
  - The redirect to `/tours/{slug}/book` might encounter an auth guard at the next step, which is handled by middleware, not this screen.
- **i18n Impact:**
  - Need keys in `tour.json` for: "Chọn ngày khởi hành", "Số lượng", "Người lớn", "Trẻ em", "Em bé", "Còn {count} chỗ", "Hết chỗ", "Đặt ngay", "Tổng cộng".
- **Edge Cases:**
  - User selects a date, then increases passengers beyond remaining capacity -> Should trigger an error and prevent CTA.
  - User changes the month in the calendar -> Needs to refetch `schedules` for the new month.
- **Open Questions:**
  - Is `POST /tours/{id}/check-availability` strictly necessary if the schedule object returned by `GET /tours/{id}/schedules` already contains `max_people` and `booked_people`? We will implement it to ensure real-time accuracy before handing off to the booking page.