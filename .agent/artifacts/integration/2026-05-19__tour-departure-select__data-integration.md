# Data Integration Plan: Tour Departure Select

## 1) Data Source Breakdown

| Source | Purpose | Ownership |
|---|---|---|
| `GET /tours/{slug}` | Fetch base tour details (name, prices) | **Server Component** (`page.tsx`) |
| `GET /tours/{id}/schedules` | Fetch available dates and capacity | **Client Query** (`DepartureSelectClient`) |
| `POST /tours/{id}/check-availability` | (Optional/Real-time) Check final capacity | **Client Mutation** (Only if strictly needed beyond local check) |
| Local Calculation | Calculate itemized total price | **Client State** (Bypasses `/bookings/calculate` to avoid 401 on public routes) |

## 2) Query Strategy

**Query: Fetch Schedules**
- **Hook:** `useTourSchedules(tourId)`
- **Key:** `["tours", "schedules", tourId, params]` (Hierarchical convention)
- **Trigger:** Automatic on mount if `tourId` exists.
- **Stale Time:** Standard default (likely 0 or 5 mins based on global config), keeps schedules relatively fresh.
- **Dependency:** `enabled: !!tourId`

## 3) Mutation Strategy

For the Departure Select screen, **no explicit mutation is required**. 
- We perform a local capacity check (`totalPassengers > availableSeats`) to guard the CTA.
- The actual booking creation happens in the subsequent `/book` step.
- We intentionally avoid calling the `/bookings/calculate` endpoint here because that endpoint is protected (`401 Unauthorized` for public users). Price calculation is done synchronously on the client based on the prefetched `tour` prices.

## 4) UI State Handling

- **Loading State:** 
  - When `isLoadingSchedules` is true, the calendar renders a `<div className="animate-pulse ...">` block (Skeleton pattern).
  - The OrderSummaryCard does not need a loading spinner since prices are calculated locally and instantaneously.
- **Empty State:** 
  - Handled gracefully inside `ScheduleCalendar` (days appear disabled/crossed out if no schedule exists for that date).
- **Error State:**
  - Handled by inline validation messages in Zod/RHF (e.g., "Vượt quá số chỗ trống!").
- **Success State:**
  - Successful validation navigates to the next route with query parameters.

## 5) Files Modified/Implemented

- **Hook file (`src/features/tour/hooks/useTourDetail.ts`):** ALREADY EXISTS. No changes needed.
- **UI file (`src/features/tour/components/DepartureSelectClient.tsx`):** Implemented in `05-ui-components`. It already consumes `useTourSchedules`.

**Integration Verdict:** The Data Integration is fully wired. The UI component correctly isolates Client Queries, respects the hierarchical keys established in the repo, and mitigates the risk of 401s by computing totals locally before handoff.