# Data Integration Plan: Tour Booking

> Feature slug: `tour-booking`
> Date: 2026-05-16
> Service scope: `src/services/booking.service.ts`, `src/services/tour.service.ts`, `src/services/payment.service.ts`

---

## 1) Data Sources
| Purpose | Source | Server or Client | Notes |
|---|---|---|---|
| Fetch Tour Detail | `GET /tours/{slug}` | Server (RSC) | Cần để lấy `id` cho các queries tiếp theo & metadata |
| Fetch Schedules | `GET /tours/{id}/schedules` | Client (Query) | Hiển thị lịch trong Calendar |
| Check Availability | `POST /tours/{id}/check-availability` | Client (Mutation/Query) | Kiểm tra chỗ trống khi chọn lịch/số lượng |
| Calculate Price | `POST /bookings/calculate` | Client (Mutation) | Tính tổng tiền real-time khi form thay đổi |
| Create Booking | `POST /bookings` | Client (Mutation) | Submit form đặt tour |
| Create Payment | `POST /payments/create` | Client (Mutation) | Lấy link thanh toán sau khi có booking |

## 1.1) Data Ownership Notes
- **Source of Truth:** `useTourDetail` (Server Prefetched) và `useTourSchedules`.
- **Supporting Lookup:** `useCheckTourAvailability` để validate chỗ trống ngay lập tức.

## 2) Query / Hook Plan
| Query Key | Hook File | Trigger | staleTime | Notes |
|---|---|---|---|---|
| `['tours', 'detail', slug]` | `useTourDetail.ts` | Server Prefetch | 10 mins | Đã có sẵn, dùng lại |
| `['tours', 'schedules', tourId]` | `useTourDetail.ts` | Mount | 5 mins | Đã có sẵn, dùng cho Calendar |
| `['bookings', 'calculate', payload]` | `useBookingQueries.ts` | Form changes | 0 | **NEW**: Dùng để hiển thị giá real-time |

## 2.1) Parallel / Dependent Query Notes
| Query | Parallel or Dependent | Why |
|---|---|---|
| `useTourSchedules` | Dependent | Cần `tourId` từ detail |
| `useBookingCalculate` | Dependent | Cần `tour_schedule_id` được chọn |

## 3) Mutation Plan
| Action | Service Function | Success Handling | Error Handling |
|---|---|---|---|
| **Create Booking** | `bookingService.create` | Redirect `/payment?booking_code=...` | Toast error message |
| **Check Availability**| `tourService.checkAvailability` | Update inline validation | Toast error |
| **Calculate Price** | `bookingService.calculate` | Update state `total_amount` | Silent error (log only) |

## 4) UI State Handling
| UI Section | Loading | Empty | Error | Success |
|---|---|---|---|---|
| **Calendar** | Skeleton Grid | "No schedules" | Retry button | Highlight selected |
| **Price Summary** | Skeleton Pulse | $0 | "Error calculating" | Display final price |
| **Form Submit** | Button Loading Spinner | N/A | Toast notification | Success redirect |

## 4.1) Error Strategy
| Error Type | UI Handling | Toast | Retry |
|---|---|---|---|
| API Validation (422) | Map to React Hook Form errors | Yes | No (User correction) |
| Auth Error (401) | Redirect to login | Yes | No |
| Network Error | Inline alert | Yes | Yes (Retry button) |

## 5) Files Expected To Change
- `src/features/tour/hooks/useBookingQueries.ts` (New)
- `src/features/tour/hooks/useTourDetail.ts` (Reuse/Check)
- `src/app/[locale]/(main)/(protected)/tours/[slug]/book/page.tsx` (HydrationBoundary)

## 6) Risks / Open Questions
- **R-01:** Debounce calculation requests để tránh spam API khi user click nhanh bộ đếm số lượng.
- **Q-01:** Có cần fetch profile user trước để pre-fill form không? (Sẽ dùng `useAuthStore` hoặc fetch profile query riêng).
