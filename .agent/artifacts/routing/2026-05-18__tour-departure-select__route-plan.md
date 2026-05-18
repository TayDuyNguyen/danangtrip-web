# Route Plan: Chọn lịch khởi hành (Tour Departure Select)

## 1. Route Scope Review
- **Route Path**: `/tours/[slug]/departures`
- **Route Group**: `(public)` inside `src/app/[locale]/(main)/(public)`
- **Status**: New active route (dedicated page for selecting departure schedule and passenger quantities).
- **Layout Target**: Reuses the main layout `src/app/[locale]/(main)/layout.tsx`.

*Note on Repo Reality*: The `BookingSidebar.tsx` on the Tour Detail page currently provides a basic schedule selection. However, to provide a richer mobile and desktop experience matching the requested "Chọn lịch khởi hành" screen (with visual calendars, availability badges, and dedicated passenger counters), we will implement the dedicated route as requested by the feature prompt. The Tour Detail page can later link to this route, or this route can act as the primary entry to the booking flow.

## 2. Page Structure Review
- **Page File**: `src/app/[locale]/(main)/(public)/tours/[slug]/departures/page.tsx`
  - Acts as the Server Component shell.
  - Fetches the `Tour` by slug using `tourService.getDetail(slug)`.
  - Passes the `tour` data down to the client component.
- **Client Component**: `src/features/tour/components/DepartureSelectClient.tsx`
  - Needs `"use client"`.
  - Renders `ScheduleCalendar`, `QuantityCounter`, and `OrderSummaryCard`.
- **Metadata**: 
  - Uses `generateMetadata` in the `page.tsx` to set the `<title>` to something like "Chọn lịch khởi hành - [Tên Tour]".

## 3. Server / Client Boundary
- **Server (`page.tsx`)**: 
  - Responsible for routing, layout shell, SEO metadata, and initial data fetching (fetching the tour details).
- **Client (`DepartureSelectClient.tsx`)**: 
  - Needs `"use client"` because it handles complex user interactions: selecting dates, incrementing/decrementing passenger counts, observing `useCheckTourAvailability`, computing dynamic prices, and handling the redirect to the `/book` route.

## 4. Locale / Navigation Review
- **`src/config/routes.ts` Impact**:
  - Add `TOUR_DEPARTURES: (slug: string) => \`/tours/${slug}/departures\`` to `PUBLIC_ROUTES`.
- **Locale Keys Impact**:
  - `src/messages/vi/tour.json` and `src/messages/en/tour.json` need new keys:
    - `"departures.title": "Chọn lịch khởi hành"`
    - `"departures.select_date": "Ngày đi"`
    - `"departures.passengers": "Số lượng khách"`
    - `"departures.continue": "Tiếp tục đặt tour"`
- **Navigation Flow**:
  - From `/tours/[slug]`, user clicks "Đặt ngay" (or similar CTA) -> goes to `/tours/[slug]/departures`.
  - From `/tours/[slug]/departures`, user selects schedule and passengers -> clicks "Tiếp tục" -> goes to `/tours/[slug]/book?schedule_id=X&adults=Y&children=Z`.

## 5. Implementation Handoff (Files to change)
- **Create**: `src/app/[locale]/(main)/(public)/tours/[slug]/departures/page.tsx`
- **Create**: `src/features/tour/components/DepartureSelectClient.tsx` (In Step 05)
- **Modify**: `src/config/routes.ts` (Add `TOUR_DEPARTURES` route).
- **Modify**: `src/messages/vi/tour.json` & `src/messages/en/tour.json` (Add `departures` object).