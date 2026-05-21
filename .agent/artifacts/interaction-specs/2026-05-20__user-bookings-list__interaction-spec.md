# Interaction Specification: Lịch sử đặt tour (user-bookings-list)

This document specifies the interactive behavior for the User Tour Bookings History list page, ensuring a premium, responsive, and validated user experience.

## 1) Action Breakdown

| Action | Type | Trigger | Feedback |
|---|---|---|---|
| **Change Status Tab** | Filter | Click on a status tab (All, Pending, Confirmed, Completed, Cancelled) | Highlights active tab, filters lists, resets page parameters to `1`. |
| **Search Input** | Filter | Type keywords in the search input field | Debounces keyboard inputs, filters lists, resets page parameters to `1`. |
| **Change Page** | Navigation | Click next/prev/number page controls | Fetches next segment of items, updates active pagination index. |
| **Open Cancel Dialog** | Dialog | Click "Hủy đơn" button on eligible tour cards | Opens modal dialog containing confirmation question, cancellation warnings, and textarea input. |
| **Submit Cancellation** | Form Submission | Click "Xác nhận hủy" inside Cancel Dialog | Runs validation, triggers `useCancelBooking` mutation, shows toast message, closes modal, and refetches active query cache. |
| **View Details** | Navigation | Click "Xem chi tiết" button on cards | Navigates user to `/payment/result?booking_code=...`. |
| **Rebook Tour** | Navigation | Click "Đặt lại" button on cancelled/completed cards | Navigates user to `/tours/[slug]#booking-cta`. |

## 2) URL-Synced State Plan

| State | Storage | Sync Logic |
|---|---|---|
| `searchTerm` | Component State / Hook | Syncs input text, debounces by 400ms before sending to API queries. |
| `activeTab` | Component State / Hook | Syncs active tab selection (`BookingStatus | "all"`), resets page parameters to `1`. |
| `page` | Component State / Hook | Syncs active pagination index, resets to `1` when tab filter or search changes. |

## 3) Debounce Strategy

- **Search Inputs**: 400ms debounce on `searchTerm` before calling `useUserBookings` queries to minimize redundant database load during quick typing.
- **Form Submission**: Disable the submit button immediately upon cancellation request to prevent double submit during network delays.

## 4) Form Flow (Validation)

### Validator: `cancelBookingSchema` (Zod)
- **Path**: `src/features/tour/validators/booking.schema.ts`
- **Rules**:
    - `cancellation_reason`: minimum 10 characters required, error message: `tour.history.cancel_reason_min_error` (or fallback).

### Submit Flow
1. User clicks "Xác nhận hủy".
2. Run Zod `safeParse` on input reason.
3. If invalid: Display error message directly below the textarea field and highlight border in red.
4. If valid: Trigger `cancelBooking` mutation with booking ID and payload.
5. Success: Close modal, show `toast.success`, reset form fields, and call parent `refetch()`.
6. Failure: Display Axel/Server error string via `toast.error`, enable submit button for retry.

## 5) i18n Keys to Verify

All translation keys are loaded from the `"tour.history"` namespace:
- `tour.history.tabs.all`, `tabs.pending`, `tabs.confirmed`, `tabs.completed`, `tabs.cancelled`
- `tour.history.cancel_title`
- `tour.history.cancel_confirm_question`
- `tour.history.cancel_reason_label`
- `tour.history.cancel_reason_placeholder`
- `tour.history.cancel_warning`
- `tour.history.cancel_success`
- `tour.history.cancel_failed`
- `tour.history.button_close`
- `tour.history.button_submit`
- `tour.history.empty_title`
- `tour.history.empty_desc`
- `tour.history.empty_cta`
- `tour.history.error_load`
- `tour.history.button_retry`

## 6) Component & Hook Mapping

- **Main Container**: `BookingsHistoryClient` (`src/features/tour/components/BookingsHistoryClient.tsx`)
- **Card Renderer**: `BookingHistoryCard` (`src/features/tour/components/BookingHistoryCard.tsx`)
- **Modal Component**: `CancelBookingDialog` (`src/features/tour/components/CancelBookingDialog.tsx`)
- **Data Hook**: `useUserBookings` (`src/features/tour/hooks/useBookingQueries.ts`)
- **Mutation Hook**: `useCancelBooking` (`src/features/tour/hooks/useBookingQueries.ts`)
