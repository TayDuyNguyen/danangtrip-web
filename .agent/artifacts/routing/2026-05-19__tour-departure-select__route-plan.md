# Route Plan: Tour Departure Select

## 1) Route Scope Review

- **Route Path:** `/tours/{slug}/departures`
- **Route Group:** `(public)` inside `src/app/[locale]/(main)/(public)/`
- **Active/Planned Status:** Active. Will be added to `PUBLIC_ROUTES` in `src/config/routes.ts`.
- **Layout Target:** The screen will use the standard `(main)` layout (header and footer).

**Decision (Page vs Modal):**
Although the prototype documentation suggests this could be a modal on the tour detail page, implementing it as a **dedicated page** provides a cleaner UX on mobile, allows for a dedicated URL for sharing or deep-linking to the booking funnel, and prevents the tour detail page from becoming too heavy.

## 2) Page Structure Review

- **Page File:** `src/app/[locale]/(main)/(public)/tours/[slug]/departures/page.tsx`
- **Layout:** Inherits from `(main)/layout.tsx`.
- **Dynamic Route:** Uses `[slug]` to fetch the associated tour.
- **Metadata:** Placed in the `page.tsx` via `generateMetadata`. It fetches the tour details by slug to set the title dynamically (e.g., `Chọn lịch khởi hành - [Tên Tour] | DanangTrip`).

## 3) Server / Client Boundary Review

**Server Component (`page.tsx`):**
- **Responsibility:** Extract `slug` from params, prefetch the basic tour details (Name, ID, Thumbnail) using `tourService.getDetail(slug)`, handle 404s if the tour doesn't exist, and render the initial metadata.
- **Why:** To improve SEO and initial load performance by not having the client fetch the basic tour details.

**Client Component (`DepartureSelectClient.tsx`):**
- **Responsibility:** Render the interactive calendar, the quantity selectors, and the dynamic price summary. Make API calls to fetch schedules (`GET /tours/{id}/schedules`), check availability (`POST`), and calculate prices (`POST`). Handle state changes and form validation using Zod and React Hook Form.
- **Why:** The component relies heavily on user interaction, component state (`useState`), and dynamic client-side data fetching (TanStack Query).

## 4) Locale / Navigation Review

- **Locale Keys:** Need to add translations for the new departure selection view.
  - Required keys in `tour.json`: `departures.title`, `departures.select_date`, `departures.passengers`, `departures.adult`, `departures.child`, `departures.infant`, `departures.remaining_seats`, `departures.sold_out`, `departures.total`, `departures.book_now`.
- **Breadcrumb Impact:** Should be "Trang chủ / Tour / [Tên Tour] / Chọn lịch khởi hành".
- **Route Config Impact:** Add `TOUR_DEPARTURES: (slug: string) => \`/tours/${slug}/departures\`` to `PUBLIC_ROUTES` in `src/config/routes.ts`.

## 5) Handoff To Implementation

- **Route Files:**
  - `src/app/[locale]/(main)/(public)/tours/[slug]/departures/page.tsx` (To be implemented/verified)
- **Config Changes:**
  - `src/config/routes.ts` (To be updated with `TOUR_DEPARTURES`)
- **Locale Files:**
  - `src/messages/vi/tour.json`
  - `src/messages/en/tour.json`
- **Components to Build:**
  - `DepartureSelectClient.tsx` (Handled in `05-ui-components`)