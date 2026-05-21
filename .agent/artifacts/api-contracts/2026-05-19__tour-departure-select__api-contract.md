# API Contract: Tour Departure Select

## 1) Source Reconciliation

- **Screen Analysis:** `.agent/artifacts/analysis/2026-05-19__tour-departure-select__screen-analysis.md`
- **API Docs:** `api_list.md` (Tours & Bookings sections)
- **Repo Config:** `src/config/api.ts`

**Reconciliation Result:** 
The necessary endpoints and types are already present in the codebase.
- `GET /tours/{id}/schedules` is mapped to `tourService.getSchedules`.
- `POST /tours/{id}/check-availability` is mapped to `tourService.checkAvailability`.
- `POST /bookings/calculate` is mapped to `bookingService.calculate`.

**Resolution on Parameter Conflict (`schedule_id` vs `tour_schedule_id`):**
- The UI Form will use `schedule_id` (managed by `DepartureSelectFormValues`) as it aligns with the `checkAvailability` payload.
- When handing off to the Booking phase (calling `bookingService.calculate` or redirecting to `/book`), `schedule_id` will be mapped to `tour_schedule_id` as expected by the Booking APIs.

## 2) Type Design

### Shared Entity Types (Already Exist in `src/types/entities.types.ts`)
```typescript
export interface TourSchedule {
  id: number;
  tour_id: number;
  start_date: string;
  end_date: string;
  max_people: number;
  booked_people: number;
  status: 'available' | 'cancelled';
  booking_availability: 'open' | 'sold_out';
  // ...
}

export interface TourAvailability {
  is_available: boolean;
  available_seats: number;
  requested_seats: number;
}
```

### Feature-Local Form Type (Created)
```typescript
// src/features/tour/validators/departure-select.schema.ts
export type DepartureSelectFormValues = {
  schedule_id: number;
  quantity_adult: number;
  quantity_child: number;
  quantity_infant: number;
}
```

## 3) Validation Design

**Schema Boundary:** `src/features/tour/validators/departure-select.schema.ts`

```typescript
import { z } from "zod";

export const departureSelectSchema = z.object({
  schedule_id: z.number({
    required_error: "Vui lòng chọn ngày khởi hành.",
    invalid_type_error: "Ngày khởi hành không hợp lệ.",
  }).positive("Vui lòng chọn ngày khởi hành hợp lệ."),
  quantity_adult: z.number().int().min(1, "Phải có ít nhất 1 người lớn."),
  quantity_child: z.number().int().min(0).default(0),
  quantity_infant: z.number().int().min(0).default(0),
});

export type DepartureSelectFormValues = z.infer<typeof departureSelectSchema>;
```

**Notes:**
- Validation is handled at the Zod form level before any API calls are made.
- Validation messages should eventually be translated via next-intl, but currently hardcoded for MVP parity with existing repo validators.

## 4) Service Contract Design

Services already exist and strictly follow the Axios envelope pattern in the repo:

**1. `tourService.getSchedules(id, params)`**
- Path: `GET /api/v1/tours/{id}/schedules`
- Auth: 🌐 Public
- Input: `id: number | string`, optional `from_date`, `to_date`.
- Output: `Promise<ApiResponse<TourSchedule[]>>`

**2. `tourService.checkAvailability(id, payload)`**
- Path: `POST /api/v1/tours/{id}/check-availability`
- Auth: 🌐 Public
- Input: `id: number | string`, payload: `{ schedule_id, quantity_adult, quantity_child, quantity_infant }`
- Output: `Promise<ApiResponse<TourAvailability>>`

**3. `bookingService.calculate(data)`**
- Path: `POST /api/v1/bookings/calculate`
- Auth: 🌐 Public / 🔐 User (Depending on middleware, but typically public calculation)
- Input: `BookingQuantityPayload` -> `{ tour_id, tour_schedule_id, quantity_adult, ... }`
- Output: `Promise<ApiResponse<BookingCalculation>>`

## 5) Handoff To Implementation

- **Files Created:**
  - `src/features/tour/validators/departure-select.schema.ts`
- **Files Verified (No changes needed):**
  - `src/services/tour.service.ts`
  - `src/services/booking.service.ts`
  - `src/types/entities.types.ts`
  - `src/types/booking.types.ts`
- **Implementation Readiness:**
  The data layer is fully integrated and typed. The next step (`04-layout-routing`) can safely define the route parameters (`slug`) and page shell, after which `05-ui-components` can wire up the React Hook Form using `departureSelectSchema`.
