# Interaction Specification: Tour Departure Select

## 1) Action Breakdown

- **Select Schedule:** User clicks on an available date in the `ScheduleCalendar` to select a departure date.
- **Adjust Passengers:** User clicks +/- on `QuantityCounter` to change the number of adults, children, and infants.
- **Submit (Continue to Booking):** User clicks the "Tiếp tục đặt tour" button to proceed to the booking checkout step with their selections.

## 2) Form Flow Review

- **Form Architecture:** 
  - Managed by `react-hook-form` and `zodResolver`.
  - Schema: `departureSelectSchema` (requires positive `schedule_id`, at least 1 `quantity_adult`).
- **Submit Flow:**
  - `onSubmit` reads validated data, checks `isOverCapacity`, and if valid, generates a URL query string (`?schedule_id=X&adults=Y&children=Z&infants=W`).
  - Redirects user to `/tours/{slug}/book?{params}` via `next-intl`'s `useRouter`.
- **Validation & Guard Clauses:**
  - Real-time capacity check (`totalPassengers > availableSeats`). If exceeded, an inline error ("Vượt quá số chỗ trống!") pulses, and the submit button is disabled.
  - Submit button is also disabled if no date is selected or if `adults < 1`.

## 3) URL-Synced State Review

- **Local State:** 
  - The form state (`schedule_id`, quantities) is kept **local** to the component (`DepartureSelectClient`) and watched via `react-hook-form`'s `useWatch`.
- **URL-Synced State:**
  - The state is **not** synced to the URL during selection to keep the URL clean.
  - It is only pushed to the URL parameters upon successful form submission when navigating to the next page (`/book`).

## 4) Destructive And Feedback Review

- **Destructive Actions:** None. This is a purely additive selection screen.
- **Feedback:**
  - **Selected Date:** Highlighted with primary color ring/bg in the calendar.
  - **Availability:** Displayed immediately under the calendar upon date selection (e.g., "Còn X chỗ" or "Hết chỗ").
  - **Capacity Error:** Real-time red text ("Vượt quá số chỗ trống!") appears if the user increments passengers beyond the available seats.
  - **Loading:** Skeleton pulses while schedules are being fetched initially.

## 5) Handoff To Implementation

- **Components:** `DepartureSelectClient` handles the main interactions, form wiring, and navigation.
- **Locale Keys:** All text keys (`departures.title`, `departures.select_date`, `departures.passengers`, `departures.continue`, etc.) have already been verified in `tour.json`.
- **Status:** The implementation was successfully completed during the `05-ui-components` step, closely following this specified interaction model to avoid architectural drift.