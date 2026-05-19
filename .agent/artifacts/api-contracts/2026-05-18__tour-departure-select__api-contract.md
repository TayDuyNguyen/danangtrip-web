# API Contract: Chọn lịch khởi hành (Tour Departure Select)

## 1. Source References
- **Analysis File**: `.agent/artifacts/analysis/2026-05-18__tour-departure-select__screen-analysis.md`
- **API Docs**: `D:\DATN\DATN_Tài liệu\docs\api\api_list.md`
- **Config**: `src/config/api.ts`

## 2. Endpoints Overview

| Method | Path | Auth | Purpose | Service Method |
|---|---|---|---|---|
| GET | `/api/v1/tours/{id}/schedules` | 🌐 Public | Lấy danh sách lịch khởi hành của tour | `tourService.getSchedules` |
| POST | `/api/v1/tours/{id}/check-availability` | 🌐 Public | Kiểm tra số chỗ còn trống theo lịch | `tourService.checkAvailability` |
| POST | `/api/v1/bookings/calculate` | 🔐 User | Tính toán giá trị tạm tính | `bookingService.calculate` |

## 3. Data Types & Payloads

### Entity Types (Shared in `src/types/entities.types.ts`)
```typescript
export interface TourSchedule {
  id: number;
  tour_id: number;
  start_date: string;
  end_date: string;
  max_people: number;
  booked_people: number;
  current_people?: number;
  min_people?: number;
  status: 'available' | 'cancelled';
  booking_availability: 'open' | 'sold_out';
  price_adult?: string | number | null;
  price_child?: string | number | null;
  price_infant?: string | number | null;
  // ...
}

export interface TourAvailability {
  is_available: boolean;
  available_seats: number;
  requested_seats: number;
}

export interface BookingCalculation {
  total_amount: number | string;
  discount_amount?: number | string;
  final_amount: number | string;
  deposit_amount?: number | string;
  available_seats?: number;
}
```

### Form & Component Payload Types (`src/features/tour/validators/departure-select.schema.ts` and `src/types/booking.types.ts`)
```typescript
// Used for POST /bookings/calculate and check-availability mapping
export interface BookingQuantityPayload {
  tour_id: number;
  tour_schedule_id: number;
  quantity_adult: number;
  quantity_child?: number | null;
  quantity_infant?: number | null;
}
```

## 4. Validation Schema
The local UI schema for the Departure Select component has been extracted.
```typescript
import { z } from "zod";

export const departureSelectSchema = z.object({
  tour_schedule_id: z.number().min(1, "vui lòng chọn ngày khởi hành"),
  quantity_adult: z.number().min(1, "tối thiểu 1 người lớn"),
  quantity_child: z.number().min(0).default(0),
  quantity_infant: z.number().min(0).default(0),
});

export type DepartureSelectFormValues = z.infer<typeof departureSelectSchema>;
```
*Note: validation messages should use `next-intl` translation keys like `t("validation.select_date")` when implementing the form, but the schema acts as the strict contract.*

## 5. Service Methods (Existing in `src/services/` and `src/features/tour/hooks/`)
The necessary service methods and `react-query` hooks are already present in the codebase.
- `useTourSchedules(tourId, params)` maps to `GET /tours/{id}/schedules`
- `useCheckTourAvailability(tourId)` maps to `POST /tours/{id}/check-availability`
- `useBookingCalculate()` maps to `POST /bookings/calculate`

## 6. Assumptions & Risks
- `[ASSUMPTION] POST /bookings/calculate Auth requirement`: According to the `api_list.md`, `/bookings/calculate` is marked as `🔐 User`. If a public user (not logged in) uses the departure select screen, calling `calculate` might return a `401 Unauthorized` error.
  - **Fallback Strategy**: If the API call fails or is bypassed for guests, the frontend can perform local calculation using the prices available on `TourSchedule` (`price_adult`, `price_child`, `price_infant`) and `Tour.discount_percent` to display the estimated total price before redirecting to the booking page.
- `[CONTRACT ALIGNMENT] schedule_id vs tour_schedule_id`:
  - `check-availability` expects `schedule_id` according to backend docs, but the `tourService.checkAvailability` method already maps it gracefully. 
  - The UI state and handoff to the booking page will standardize on `tour_schedule_id` to match `BookingQuantityPayload`.

## 7. Next Actions (Implementation Handoff)
- No additional types or service files need to be created (they were already present from the previous booking implementation).
- `src/features/tour/validators/departure-select.schema.ts` has been successfully created.
- The UI layer (Step 05) can now safely use `DepartureSelectFormValues` to handle the local component state and safely build the transition via URL search parameters to the booking page.