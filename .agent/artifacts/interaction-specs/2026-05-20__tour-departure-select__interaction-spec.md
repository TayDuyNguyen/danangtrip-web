# Interaction Specification: Tour Departure Select

This document specifies the interactive behavior for the Tour Departure Selection screen, ensuring a premium, responsive, and validated user experience.

## 1) Action Breakdown

| Action | Type | Trigger | Feedback |
|---|---|---|---|
| **Choose Schedule** | Selection | Click on a date in `ScheduleCalendar` | Highlight date, trigger `useCheckTourAvailability` and `useBookingCalculate`. |
| **Adjust Quantities** | Form Input | Click +/- in `QuantityCounter` | Trigger debounced `useCheckTourAvailability` and `useBookingCalculate`. |
| **Check Availability** | API Check | Change in schedule or quantities | `POST /check-availability`. Show remaining seats or error. |
| **Calculate Price** | API Computation | Change in quantities | `POST /bookings/calculate`. Show itemized total. |
| **Proceed to Booking** | Navigation | Click "Tiếp tục" (CTA) | Redirect to `/tours/[slug]/book?tour_schedule_id=...&adult=...` |

## 2) URL-Synced State Plan

| State | Storage | Sync Logic |
|---|---|---|
| `tour_schedule_id` | URL Param | `?tour_schedule_id={id}` - Persists selection. |
| `adult` | URL Param | `?adult={count}` - Syncs with state. |
| `child` | URL Param | `?child={count}` - Syncs with state. |
| `infant` | URL Param | `?infant={count}` - Syncs with state. |

## 3) Debounce Strategy

- **API Queries**: 400ms debounce on `adult`, `child`, `infant` changes before triggering `/check-availability` and `/calculate` to save bandwidth.
- **Navigation**: 300ms throttle on the CTA button.

## 4) Form Flow (Validation)

### Validator: `departureSelectSchema` (Zod)
- **Path**: `src/features/tour/validators/departure-select.schema.ts`
- **Rules**:
    - `tour_schedule_id`: required, positive integer.
    - `quantity_adult`: min 1.
    - `quantity_child`: min 0.
    - `quantity_infant`: min 0.
    - **Refine**: `totalPassengers` <= `remaining_slots` of the selected schedule.

### Submit Flow
1. User clicks "Tiếp tục".
2. Run Zod validation.
3. If valid: Construct URL with params and `router.push`.
4. If invalid: Display error toasts via `sonner` and highlight offending fields.

## 5) i18n Keys to Add

| Key | vi | en |
|---|---|---|
| `tour.departures.no_schedules` | Không có lịch khởi hành nào khả dụng. | No departure schedules available. |
| `tour.departures.over_capacity` | Vượt quá số chỗ trống! | Over capacity! |
| `tour.departures.calc_error` | Lỗi khi cập nhật giá hoặc chỗ trống. | Error updating price or availability. |
| `tour.departures.select_date` | Chọn lịch khởi hành | Select departure date |
| `tour.departures.passengers` | Số lượng khách | Number of guests |

## 6) Component & Hook Mapping

- **Main Component**: `DepartureSelectClient` (`src/features/tour/components/DepartureSelectClient.tsx`)
- **Validation Hook**: `useForm` with `zodResolver(departureSelectSchema)`.
- **Data Hook**: `useTourSchedules(tourId)` for date list.
- **Navigation Hook**: `useRouter` and `useSearchParams` from `next/navigation`.
